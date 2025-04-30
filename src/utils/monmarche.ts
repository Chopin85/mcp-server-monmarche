import { chromium } from "playwright";
import { writeFileSync, existsSync, readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

let browser;
let page: any;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(
  __dirname.replace("build/utils", ""),
  "session-cookie.json"
);

// login function
export const loginSession = async () => {
  const email = process.env.MON_MARCHE_EMAIL;
  const password = process.env.MON_MARCHE_PASSWORD;

  if (!email || !password) {
    return { error: "Email or password not set" };
  }

  browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  page = await context.newPage();

  try {
    await page.goto("https://www.mon-marche.fr/");
    await page.click("button[id='didomi-notice-agree-button']");
    await page.click('button[title="Mon compte"]');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    await page.waitForTimeout(2000);

    const cookies = await context.cookies();

    const sessionCookie = cookies.find((c) => c.name === "session");
    const didomiToken = cookies.find((c) => c.name === "didomi_token");

    if (sessionCookie) {
      writeFileSync(
        filePath,
        JSON.stringify(
          [sessionCookie, didomiToken].map((cookie) => cookie),
          null,
          2
        )
      );
    }

    return { status: "Login OK" };
  } catch (err) {
    return { error: "Errore durante il login", details: err };
  } finally {
    browser.close();
  }
};

// stdio searchProducts
export const searchProducts = async (product: string) => {
  if (!existsSync(filePath)) {
    return { error: "You have to log in first" };
  }

  const sessionCookie = JSON.parse(readFileSync(filePath, "utf-8"));

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();

  await context.addCookies(
    sessionCookie.map((cookie: any) => ({
      ...cookie,
    }))
  );

  const page = await context.newPage();
  await page.goto(
    encodeURI(`https://www.mon-marche.fr/recherche?term=${product}`)
  );

  await page.waitForTimeout(2000); // aspetta un attimo per essere sicuri che la pagina sia caricata

  try {
    const articles = page.locator(
      '//*[@id="__next"]/div[4]/div/div[2]/div[1]/div'
    );

    const articlesfilter = articles.locator('article:has-text("€")');

    const count =
      (await articlesfilter.count()) >= 5 ? 5 : await articlesfilter.count();

    const products = [];
    for (let i = 0; i < count; i++) {
      const article = articlesfilter.nth(i);

      const name = await article
        .locator('a[href^="/produit"] >> div')
        .first()
        .innerText();

      const price = await article.locator('p:has-text("€")').last().innerText();

      products.push({ name: name.trim(), price: price.trim() });
    }

    return products;
  } catch (err) {
    console.error("Error in /products:", err);
    return { error: "Failed to fetch products", details: err };
  } finally {
    if (browser) await browser.close();
  }
};

// stdio addProduct
export const addProduct = async (product: string) => {
  if (!existsSync(filePath)) {
    return { error: "You have to log in first" };
  }

  const sessionCookie = JSON.parse(readFileSync(filePath, "utf-8"));

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();

  await context.addCookies(
    sessionCookie.map((cookie: any) => ({
      ...cookie,
    }))
  );

  const page = await context.newPage();
  await page.goto(`https://www.mon-marche.fr/recherche?term=${product}`);

  try {
    await page.waitForTimeout(2000);
    await page.click("article");
    await page.click("text=Ajouter");
    await page.waitForTimeout(2000);

    ({ status: `product "${product}" added to cart` });
  } catch (err) {
    ({ error: "Error while adding", details: err });
  } finally {
    await browser.close();
  }
};

const commands = {
  loginSession,
};

const cmd = process.argv[2] as keyof typeof commands;

(async () => {
  if (cmd in commands) {
    const result = await commands[cmd];
    if (typeof result === "function") {
      const response = await result();
      console.log(response);
    }
  } else {
    console.log(`Command "${cmd}" not recognized.`);
    console.log("Available commands:", Object.keys(commands).join(", "));
  }
})();
