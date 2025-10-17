import { chromium, Browser, Page } from "playwright";
import { writeFileSync, existsSync, readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

let browser: Browser | null = null;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(
  __dirname.replace("build/utils", ""),
  "session-cookie.json"
);

/** --- Browser Manager --- **/
async function getBrowser(): Promise<Browser> {
  if (!browser) {
    browser = await chromium.launch({
      headless: process.env.HEADLESS !== "false",
    });
  }
  return browser;
}

async function newPageWithCookies(): Promise<Page> {
  const browser = await getBrowser();
  const context = await browser.newContext();

  if (existsSync(filePath)) {
    const cookies = JSON.parse(readFileSync(filePath, "utf-8"));
    await context.addCookies(cookies);
  }

  return await context.newPage();
}

/** --- Login --- **/
export const loginSession = async () => {
  const email = process.env.MON_MARCHE_EMAIL;
  const password = process.env.MON_MARCHE_PASSWORD;

  if (!email || !password) {
    return { error: "Email or password not set" };
  }

  const browser = await getBrowser();
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();

  try {
    await page.goto("https://www.mon-marche.fr/", {
      waitUntil: "domcontentloaded",
    });
    await page
      .click("#didomi-notice-agree-button", { timeout: 3000 })
      .catch(() => {});
    await page.click('button[title="Mon compte"]');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    const cookies = await context.cookies();
    const wantedCookies = cookies.filter((c) =>
      ["session", "didomi_token"].includes(c.name)
    );

    writeFileSync(filePath, JSON.stringify(wantedCookies, null, 2));
    return { status: "Login OK" };
  } catch (err) {
    console.error("Login error:", err);
    return { error: "Errore durante il login", details: String(err) };
  } finally {
    await context.close();
  }
};

/** --- Search products --- **/
export const searchProducts = async (product: string) => {
  if (!existsSync(filePath)) {
    return { error: "You have to log in first" };
  }

  const page = await newPageWithCookies();
  try {
    await page.goto(
      `https://www.mon-marche.fr/recherche?term=${encodeURIComponent(product)}`,
      {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      }
    );

    await page.waitForSelector("article", { timeout: 10000 });

    const productLinks: string[] = await page.$$eval(
      "article a[href^='/produit/']",
      (links) => links.slice(0, 5).map((a) => (a as HTMLAnchorElement).href)
    );

    const scrapeProduct = async (link: string) => {
      const browserInstance = await getBrowser();
      const productPage = await browserInstance.newPage();
      await productPage.goto(link, { waitUntil: "domcontentloaded" });

      const product = await productPage.evaluate(() => {
        const nameEl = document.querySelector("h1");
        const name = nameEl?.textContent?.trim() || null;

        const priceEl = Array.from(document.querySelectorAll("span")).find(
          (s) => s.textContent?.includes("€")
        );
        const price = priceEl?.textContent?.trim() || null;

        let description = null;
        const h2s = Array.from(document.querySelectorAll("h2"));
        const descHeader = h2s.find((h) =>
          h.textContent?.toLowerCase().includes("description")
        );
        if (descHeader) {
          const nextDiv = descHeader.nextElementSibling;
          if (nextDiv) description = nextDiv.textContent?.trim() || null;
        }

        return { name, price, description, link: window.location.href };
      });

      await productPage.close();
      return product;
    };

    const products = await Promise.all(productLinks.map(scrapeProduct));

    return products;
  } catch (err) {
    console.error("Error searching product:", err);
    return { error: "Failed to fetch products", details: String(err) };
  } finally {
    await page.context().close();
  }
};

/** --- Add product --- **/
export const addProduct = async ({
  url,
  name,
  quantity,
}: {
  url?: string;
  name: string;
  quantity: number;
}) => {
  if (!existsSync(filePath)) {
    return { error: "You have to log in first" };
  }

  const page = await newPageWithCookies();
  try {
    await page.goto(
      url ||
        `https://www.mon-marche.fr/recherche?term=${encodeURIComponent(name)}`,
      { waitUntil: "domcontentloaded", timeout: 60000 }
    );
    await page.waitForTimeout(2000);

    await page.click("article");
    await page.click("text=Ajouter");
    await page.waitForTimeout(1500);

    return { status: `Product "${name}" added to cart` };
  } catch (err) {
    console.error("Add product error:", err);
    return { error: "Error while adding product", details: String(err) };
  } finally {
    await page.context().close();
  }
};
