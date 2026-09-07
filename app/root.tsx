import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useParams,
} from "react-router"

import AppI18nProvider from "~/i18n/provider"
import { resolveAppLanguage } from "~/i18n/settings"

import type { Route } from "./+types/root"
import "./app.css"

const initialThemeScript = `(() => {
  try {
    const stored = localStorage.getItem("portfolio-theme");
    const dark = stored === "dark" || (stored !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
  } catch {}
})();`

export function Layout({ children }: { children: React.ReactNode }) {
  const { lang } = useParams()
  const documentLanguage = resolveAppLanguage(lang)

  return (
    <html lang={documentLanguage} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light dark" />
        <script dangerouslySetInnerHTML={{ __html: initialThemeScript }} />
        <Meta />
        <Links />
      </head>
      <body className="min-h-svh overflow-x-hidden">
        <div className="relative z-10">{children}</div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  const { lang } = useParams()
  const language = resolveAppLanguage(lang)

  return (
    <AppI18nProvider language={language}>
      <Outlet />
    </AppI18nProvider>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!"
  let details = "An unexpected error occurred."
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error"
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
