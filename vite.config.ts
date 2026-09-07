import { reactRouter } from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig(({ command }) => ({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  // The worker build needs bundled server dependencies, while Vite dev must
  // keep React's SSR runtime external so its ESM/CJS interop stays intact.
  ssr: command === "build" ? { noExternal: true } : undefined,
}))
