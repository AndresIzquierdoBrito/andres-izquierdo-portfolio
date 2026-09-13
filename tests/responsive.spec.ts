import { expect, test, type Page } from "@playwright/test"

type ViewportCase = {
  name: string
  width: number
  height: number
}

type Rect = {
  x: number
  y: number
  width: number
  height: number
  right: number
  bottom: number
}

type LayoutSnapshot = {
  viewport: { width: number; height: number; clientWidth: number }
  document: {
    clientWidth: number
    scrollWidth: number
    bodyScrollWidth: number
  }
  nav: Rect
  toolbar: Rect
  navDisplay: string
  navPosition: string
  toolbarPosition: string
  navToolbarOverlap: boolean
  heroCopyOverlap: string[]
  visibleHeadings: Array<{ text: string; rect: Rect }>
}

const boundaryWidths = [
  320, 375, 414, 639, 640, 767, 768, 1023, 1024, 1049, 1050, 1051, 1279, 1280,
  1535, 1536, 1537, 1920,
]

const boundaryCases: ViewportCase[] = boundaryWidths.map((width) => ({
  name: `width-${width}`,
  width,
  height: 900,
}))

const deviceCases: ViewportCase[] = [
  { name: "phone-portrait", width: 320, height: 568 },
  { name: "modern-phone", width: 390, height: 844 },
  { name: "phone-landscape", width: 667, height: 375 },
  { name: "tablet-portrait", width: 768, height: 1024 },
  { name: "tablet-landscape", width: 1024, height: 600 },
  { name: "short-laptop", width: 1280, height: 720 },
  { name: "wide-desktop", width: 1536, height: 864 },
  { name: "large-desktop", width: 1920, height: 1080 },
]

const locales = ["en", "es"] as const

async function readLayout(page: Page): Promise<LayoutSnapshot> {
  return page.evaluate(() => {
    const nav = document.querySelector<HTMLElement>(
      '[data-testid="home-section-nav"]'
    )
    const toolbar = document.querySelector<HTMLElement>(
      '[data-testid="hero-toolbar"]'
    )

    if (!nav || !toolbar) {
      throw new Error("Responsive controls are not mounted")
    }

    const navRect = nav.getBoundingClientRect()
    const toolbarRect = toolbar.getBoundingClientRect()
    const asRect = (bounds: DOMRect): Rect => ({
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      right: bounds.right,
      bottom: bounds.bottom,
    })
    const intersects = (a: DOMRect, b: DOMRect) =>
      a.x < b.right && a.right > b.x && a.y < b.bottom && a.bottom > b.y

    const heroCopyOverlap = [
      ...document.querySelectorAll<HTMLElement>("#home h1, #home h2, #home p"),
    ]
      .filter((element) => intersects(navRect, element.getBoundingClientRect()))
      .map((element) => (element.textContent ?? "").trim())

    const visibleHeadings = [
      ...document.querySelectorAll<HTMLElement>(
        "#home h1, #background h2, #projects h2, #contact h2"
      ),
    ]
      .filter((element) => {
        const bounds = element.getBoundingClientRect()
        const styles = getComputedStyle(element)
        return (
          styles.display !== "none" &&
          styles.visibility !== "hidden" &&
          bounds.width > 0 &&
          bounds.height > 0
        )
      })
      .map((element) => ({
        text: (element.textContent ?? "").trim(),
        rect: asRect(element.getBoundingClientRect()),
      }))

    return {
      viewport: {
        width: innerWidth,
        height: innerHeight,
        clientWidth: document.documentElement.clientWidth,
      },
      document: {
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        bodyScrollWidth: document.body.scrollWidth,
      },
      nav: asRect(navRect),
      toolbar: asRect(toolbarRect),
      navDisplay: getComputedStyle(nav.querySelector("ol")!).display,
      navPosition: getComputedStyle(nav).position,
      toolbarPosition: getComputedStyle(toolbar).position,
      navToolbarOverlap: intersects(navRect, toolbarRect),
      heroCopyOverlap,
      visibleHeadings,
    }
  })
}

function expectInsideViewport(snapshot: LayoutSnapshot) {
  expect(snapshot.navPosition).toBe("fixed")
  expect(snapshot.toolbarPosition).toBe("fixed")
  expect(snapshot.nav.x).toBeGreaterThanOrEqual(-1)
  expect(snapshot.nav.right).toBeLessThanOrEqual(snapshot.viewport.width + 1)
  expect(snapshot.toolbar.x).toBeGreaterThanOrEqual(-1)
  expect(snapshot.toolbar.right).toBeLessThanOrEqual(
    snapshot.viewport.width + 1
  )
  expect(snapshot.navToolbarOverlap).toBe(false)
  expect(snapshot.document.scrollWidth).toBeLessThanOrEqual(
    snapshot.document.clientWidth + 1
  )
  expect(snapshot.document.bodyScrollWidth).toBeLessThanOrEqual(
    snapshot.document.clientWidth + 1
  )
}

function expectNavigationMode(snapshot: LayoutSnapshot, width: number) {
  if (width < 1050) {
    expect(snapshot.navDisplay).toBe("grid")
    expect(snapshot.nav.bottom).toBeGreaterThan(snapshot.viewport.height - 110)
  } else if (width < 1536) {
    expect(snapshot.navDisplay).toBe("grid")
    expect(snapshot.nav.y).toBeGreaterThanOrEqual(90)
    expect(snapshot.nav.y).toBeLessThan(120)
    expect(snapshot.nav.bottom).toBeLessThan(snapshot.viewport.height)
  } else {
    expect(snapshot.navDisplay).toBe("flex")
    expect(snapshot.nav.width).toBeGreaterThanOrEqual(230)
    expect(snapshot.nav.height).toBeGreaterThan(250)
    expect(snapshot.nav.x).toBeLessThan(20)
  }
}

test.describe("responsive geometry", () => {
  test.describe.configure({ mode: "parallel" })

  for (const locale of locales) {
    for (const viewport of boundaryCases) {
      test(`${locale} ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        })
        await page.goto(`/${locale}`, { waitUntil: "domcontentloaded" })
        await page.waitForTimeout(350)

        const snapshot = await readLayout(page)

        expectInsideViewport(snapshot)
        expectNavigationMode(snapshot, viewport.width)

        if (viewport.width >= 1536) {
          expect(snapshot.heroCopyOverlap).toEqual([])
        }
      })
    }
  }
})

test.describe("responsive device scenarios", () => {
  for (const locale of locales) {
    for (const viewport of deviceCases) {
      test(`${locale} ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        })
        await page.goto(`/${locale}`, { waitUntil: "domcontentloaded" })
        await page.waitForTimeout(350)

        const snapshot = await readLayout(page)

        expectInsideViewport(snapshot)
        expectNavigationMode(snapshot, viewport.width)

        if (viewport.height >= 568 && viewport.width < 1050) {
          expect(snapshot.heroCopyOverlap).toEqual([])
        }
      })
    }
  }
})

test.describe("responsive interactions", () => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1024, height: 768 },
    { width: 1280, height: 720 },
    { width: 1536, height: 864 },
  ]) {
    test(`navigation, locale, theme, and project controls at ${viewport.width}px`, async ({
      page,
    }) => {
      test.setTimeout(90_000)
      await page.setViewportSize(viewport)
      await page.goto("/en", { waitUntil: "domcontentloaded" })
      await page.waitForTimeout(350)

      const nav = page.getByTestId("home-section-nav")
      const sectionIds = ["home", "background", "projects", "contact"]

      for (const id of sectionIds) {
        await nav.getByRole("link", { name: new RegExp(id, "i") }).click()
        await page.waitForTimeout(700)

        await expect(page.locator(`#${id}`)).toBeVisible()
        await expect(
          nav.getByRole("link", { name: new RegExp(id, "i") })
        ).toHaveAttribute("aria-current", "location")

        const sectionHeading = page.locator(
          id === "home" ? "#home h1" : `#${id} h2`
        )
        const headingRect = await sectionHeading.boundingBox()
        const navRect = await nav.boundingBox()

        expect(headingRect).not.toBeNull()
        expect(navRect).not.toBeNull()

        if (viewport.width >= 1050 && viewport.width < 1536) {
          expect(headingRect!.y).toBeGreaterThanOrEqual(
            navRect!.y + navRect!.height - 1
          )
        } else if (viewport.width >= 1536) {
          expect(headingRect!.x).toBeGreaterThanOrEqual(navRect!.width - 1)
        }
      }

      await page.getByTestId("theme-toggle").click()
      await expect(page.locator("html")).toHaveClass(/dark/)

      await nav.getByRole("link", { name: /Projects/i }).click()
      await page.waitForTimeout(700)
      for (let index = 0; index < 3; index += 1) {
        await page.getByRole("button", { name: /Show next project/i }).click()
        await page.waitForTimeout(1_800)
      }

      const screenshotButtons = page.getByRole("button", {
        name: /Open ApunteX screenshot 1/i,
      })
      const activeScreenshotIndex = await screenshotButtons.evaluateAll(
        (buttons) =>
          buttons.findIndex((button) => {
            let ancestor = button.parentElement
            let opacity = 1

            while (ancestor && ancestor !== document.body) {
              if (ancestor.style.opacity) {
                opacity *= Number(ancestor.style.opacity)
              }
              ancestor = ancestor.parentElement
            }

            const bounds = button.getBoundingClientRect()
            return (
              opacity > 0.95 &&
              bounds.width > 0 &&
              bounds.height > 0 &&
              bounds.right > 0 &&
              bounds.left < innerWidth
            )
          })
      )

      expect(activeScreenshotIndex).toBeGreaterThanOrEqual(0)
      await screenshotButtons.nth(activeScreenshotIndex).click()
      await expect(
        page.getByRole("button", { name: /Close screenshot viewer/i })
      ).toBeVisible()
      await page
        .getByRole("button", { name: /Close screenshot viewer/i })
        .click()

      await page.getByRole("button", { name: /Español/i }).click()
      await expect(page).toHaveURL(/\/es(?:#.*)?$/)
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    })
  }
})

test.describe("Google Autocompleta project media", () => {
  for (const locale of locales) {
    test(`${locale} uses the correct screenshot frames`, async ({ page }) => {
      test.setTimeout(90_000)
      await page.setViewportSize({ width: 1024, height: 768 })
      await page.goto(`/${locale}`, { waitUntil: "domcontentloaded" })
      await page.waitForTimeout(350)

      await page
        .getByTestId("home-section-nav")
        .getByRole("link", { name: /Projects|Proyectos/i })
        .click()
      await page.waitForTimeout(700)

      for (let index = 0; index < 3; index += 1) {
        await page.getByRole("button", { name: /Show next project/i }).click()
        await page.waitForTimeout(1_800)
      }

      const googleCards = page.locator("article").filter({
        has: page.getByRole("heading", { name: "Google Autocompleta" }),
      })
      const activeCardIndex = await googleCards.evaluateAll((cards) =>
        cards.findIndex((card) => {
          const carouselItem = card.parentElement
          if (!carouselItem) return false
          const bounds = card.getBoundingClientRect()
          const styles = getComputedStyle(carouselItem)
          return (
            styles.zIndex === "5" &&
            Number.parseFloat(styles.opacity) > 0.95 &&
            bounds.width > 0 &&
            bounds.height > 0
          )
        })
      )

      expect(activeCardIndex).toBeGreaterThanOrEqual(0)
      const activeCard = googleCards.nth(activeCardIndex)
      await expect(activeCard).toContainText(
        locale === "es"
          ? "respuestas recopiladas previamente"
          : "previously collected answers"
      )
      await expect(
        activeCard.getByRole("link", {
          name: /Open Google Autocompleta website/i,
        })
      ).toHaveAttribute("href", "https://googleautocompleta.com")

      const screenshotButtons = activeCard.locator(
        "button[data-screenshot-frame]"
      )
      await expect(screenshotButtons).toHaveCount(3)
      await expect(screenshotButtons.nth(0)).toHaveAttribute(
        "data-screenshot-frame",
        "browser"
      )
      await expect(screenshotButtons.nth(1)).toHaveAttribute(
        "data-screenshot-frame",
        "browser"
      )
      await expect(screenshotButtons.nth(2)).toHaveAttribute(
        "data-screenshot-frame",
        "phone"
      )

      await screenshotButtons.nth(2).click()
      const viewer = page.getByRole("dialog")
      await expect(viewer).toBeVisible()
      await expect(
        viewer.locator('[data-screenshot-frame="phone"]')
      ).toBeVisible()
      await expect(viewer.locator("img")).toHaveAttribute(
        "src",
        /google_autocompleta_phone_sc\.png/
      )

      await page.keyboard.press("Escape")
      await expect(viewer).toHaveCount(0)
    })
  }
})

test.describe("webkit smoke @webkit", () => {
  for (const viewport of [
    { width: 375, height: 667 },
    { width: 1024, height: 768 },
    { width: 1280, height: 720 },
    { width: 1920, height: 1080 },
  ]) {
    test(`keeps the layout contained at ${viewport.width}px`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport)
      await page.goto("/en", { waitUntil: "domcontentloaded" })
      await page.waitForTimeout(350)

      const snapshot = await readLayout(page)

      expectInsideViewport(snapshot)
      expectNavigationMode(snapshot, viewport.width)
    })
  }
})
