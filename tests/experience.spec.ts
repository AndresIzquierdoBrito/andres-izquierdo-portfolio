import { expect, test } from "@playwright/test"

const experiencePanel = '[role="tabpanel"][aria-labelledby="experience-tab"]'

const expectedHighlights = {
  en: {
    count: 9,
    text: [
      "Developed and maintained multiple FastAPI microservices",
      "Developed 1000+ tests with pytest",
      "Designed and developed a multi-office employee QR check-in system",
      "Engineered a data scraping pipeline using Node.js",
      "Orchestrated the technical recruitment and onboarding process",
      "Managed the redesign of the corporate website using Next.js",
      "Developed comprehensive UI/UX design projects in Figma",
      "Coordinated a development team of 5 people using Trello",
      "Implemented a RESTful API utilizing Large Language Models",
    ],
  },
  es: {
    count: 10,
    text: [
      "Desarrollé y mantuve múltiples microservicios FastAPI",
      "Desarrollé más de 1000 tests con Pytest",
      "Lideré la implementación de pruebas E2E con Cypress",
      "Diseñé un pipeline de extracción de datos",
      "Diseñé y desarrollé un sistema de check-in mediante QR",
      "Coordiné procesos de selección y onboarding",
      "Implementé un chatbot con API RESTful",
      "Gestioné el rediseño de la web corporativa con Next.js",
      "Desarrollé proyectos integrales de diseño UI/UX en Figma",
      "Coordiné un equipo de desarrollo de 5 personas utilizando Trello",
    ],
  },
} as const

for (const locale of ["en", "es"] as const) {
  test(`${locale} renders every experience highlight`, async ({ page }) => {
    await page.goto(`/${locale}`, { waitUntil: "domcontentloaded" })

    const panel = page.locator(experiencePanel)
    const highlights = panel.locator("ul > li")

    await expect(highlights).toHaveCount(expectedHighlights[locale].count)

    for (const text of expectedHighlights[locale].text) {
      await expect(highlights.filter({ hasText: text })).toHaveCount(1)
    }
  })
}
