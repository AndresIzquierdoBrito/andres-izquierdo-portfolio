import { defineConfig, devices } from "@playwright/test"

const port = 4175
const baseURL = `http://127.0.0.1:${port}`

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 45_000,
  expect: {
    timeout: 7_000,
  },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    reducedMotion: "reduce",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      grepInvert: /@webkit/,
    },
    {
      name: "webkit-smoke",
      use: { ...devices["Desktop Safari"] },
      grep: /@webkit/,
    },
  ],
  webServer: {
    command: "pnpm start",
    url: `${baseURL}/en`,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      HOST: "127.0.0.1",
      PORT: String(port),
    },
    stdout: "ignore",
    stderr: "pipe",
  },
})
