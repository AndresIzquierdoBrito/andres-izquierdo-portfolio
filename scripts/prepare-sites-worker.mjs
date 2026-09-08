import { cp, mkdir, readdir, rm, writeFile } from "node:fs/promises"
import { promisify } from "node:util"
import { execFile } from "node:child_process"
import path from "node:path"

const execFileAsync = promisify(execFile)
const projectRoot = path.resolve(new URL("..", import.meta.url).pathname)
const buildServer = path.join(projectRoot, "build/server/index.js")
const buildClient = path.join(projectRoot, "build/client")
const distServer = path.join(projectRoot, "dist/server")
const distClient = path.join(projectRoot, "dist/client")
const appBuild = path.join(distServer, "app.js")
const workerEntry = path.join(distServer, "worker-entry.mjs")
const workerOutput = path.join(distServer, "index.js")
// Sites expects the generated server bundle to expose a default fetch handler,
// so keep this adapter separate from React Router's normal Node server build.
const pnpmStore = path.join(projectRoot, "node_modules/.pnpm")
const esbuildPackage = (await readdir(pnpmStore)).find((name) =>
  name.startsWith("esbuild@"),
)

if (!esbuildPackage) {
  throw new Error("Unable to locate the installed esbuild binary.")
}

const esbuild = path.join(
  pnpmStore,
  esbuildPackage,
  "node_modules/esbuild/bin/esbuild",
)

await mkdir(distServer, { recursive: true })
await mkdir(distClient, { recursive: true })
await cp(buildClient, distClient, { recursive: true })
await cp(buildServer, appBuild)
await writeFile(
  workerEntry,
  `import { createRequestHandler } from "react-router";
import * as build from "./app.js";

const handleRequest = createRequestHandler(build, "production");

export default {
  fetch(request, env, ctx) {
    return handleRequest(request, { cloudflare: { env, ctx } });
  },
};
`,
)

await execFileAsync(esbuild, [
  workerEntry,
  "--bundle",
  "--format=esm",
  "--platform=neutral",
  "--target=es2022",
  "--main-fields=browser,module,main",
  "--conditions=workerd,worker,browser",
  "--define:process.env.NODE_ENV=\"production\"",
  `--outfile=${workerOutput}`,
])

await rm(workerEntry)
await rm(appBuild)
