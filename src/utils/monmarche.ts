import { writeFileSync, existsSync, readFileSync } from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import {
  ProductSearchResponse,
  AddToCartResponse,
  ArticleDetailResponse,
  CartResponse,
} from "../types/index.js";

dotenv.config({ quiet: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(
  __dirname.replace("dist/utils", ""),
  "session-cookie.json"
);
/** --- API URL --- **/
const apiUrl = "https://www.mon-marche.fr/api";

/** --- Fetch Wrapper --- **/
const apiCall = async <T>({
  endpoint,
  body,
  method,
  isLogin = false,
}: {
  endpoint: string;
  body?: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  isLogin?: boolean;
}): Promise<T> => {
  let session: string | undefined;

  if (!isLogin) {
    session = JSON.parse(readFileSync(filePath, "utf-8")).session;
  }

  const cookie = !isLogin && session ? `session=${session};` : "";

  try {
    const response = await fetch(`${apiUrl}${endpoint}`, {
      headers: {
        accept: "*/*",
        "accept-language": "fr,it;q=0.9,en;q=0.8",
        "cache-control": "no-cache",
        "content-type": "application/json",
        pragma: "no-cache",
        priority: "u=1, i",
        "sec-ch-ua":
          '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        cookie,
        Referer: "https://www.mon-marche.fr/",
      },
      body,
      method,
    });

    if (isLogin) {
      const setCookie = response.headers.get("set-cookie");
      if (setCookie) {
        const cookies = setCookie.split(",").map((cookie) => cookie.trim());
        const sessionCookie = cookies.find((cookie) =>
          cookie.startsWith("session=")
        );
        if (sessionCookie) {
          const session = sessionCookie.split(";")[0].replace("session=", "");
          const newCookies = { session };

          console.log(newCookies);

          writeFileSync(filePath, JSON.stringify(newCookies, null, 2), "utf-8");
        }
      }
    }

    const data: T = await response.json();
    return data;
  } catch (err) {
    console.error("API call error:", err);
    throw err;
  }
};

/** --- Login --- **/
export const loginSession = async () => {
  const email = process.env.MON_MARCHE_EMAIL;
  const password = process.env.MON_MARCHE_PASSWORD;

  if (!email || !password) {
    return { error: "Email or password not set" };
  }

  try {
    const loginResponse = await apiCall<any>({
      endpoint: "/auth/signin",
      body: `{"email":"${email}","password":"${password}"}`,
      method: "POST",
      isLogin: true,
    });

    if (loginResponse.error) {
      return { error: loginResponse.error, message: loginResponse.message };
    }

    return { status: "Login OK" };
  } catch (error) {
    return { error: "Error logging in" };
  }
};

/** --- Search products --- **/
export const searchProducts = async (product: string) => {
  if (!existsSync(filePath)) {
    return { error: "You have to log in first" };
  }

  const productsResponse = await apiCall<ProductSearchResponse>({
    endpoint: `/search2?type=PRODUCT&text=${encodeURIComponent(
      product
    )}&modelVersion=ordinal_df`,
    method: "GET",
  });
  if (!productsResponse) {
    throw new Error(`Failed to search products: ${productsResponse}`);
  }
  const data = await productsResponse;

  const products = await Promise.all(
    data.items.map(async (item) => {
      const res = await apiCall<ArticleDetailResponse>({
        endpoint: `/articleDetailBySlug/${item.slug}`,
        method: "GET",
      });

      const name = res.name || null;
      const id = res.id || null;
      const weight =
        res.weightPrice && res.weightPrice.weight
          ? `${res.weightPrice.weight} ${res.weightPrice.unit}`
          : null;
      const price = res.pricing.sellPrices.perPiece
        ? `${res.pricing.sellPrices.perPiece.net / 100} €`
        : null;
      const priceKg = res.pricing.sellPrices.perWeightUnit
        ? `${res.pricing.sellPrices.perWeightUnit.net / 100} € / kg`
        : null;
      const description = res.description || null;
      const link = `https://www.mon-marche.fr/produit/${item.slug}`;

      return {
        name,
        id,
        weight,
        price,
        priceKg,
        description,
        link,
      };
    })
  );
  return products;
};

/** --- Add product --- **/
export const addProduct = async ({
  id,
  quantity,
}: {
  id: string;
  quantity: number;
}) => {
  if (!existsSync(filePath)) {
    return { error: "You have to log in first" };
  }

  const addProductResponse = await apiCall<AddToCartResponse>({
    endpoint: "/cart/product",
    body: `{"product":{"id":"${id}","quantity":${quantity}}}`,
    method: "PATCH",
  });
  if (!addProductResponse) {
    throw new Error(`Failed to add product: ${addProductResponse}`);
  }
  return addProductResponse;
};

/** --- Cart list --- **/
export const getCartList = async () => {
  if (!existsSync(filePath)) {
    return { error: "You have to log in first" };
  }

  const cartResponse = await apiCall<CartResponse>({
    endpoint: "/cart",
    method: "GET",
  });

  if (!cartResponse) {
    throw new Error(`Failed to get cart: ${cartResponse}`);
  }
  return cartResponse.products.map((product) => ({
    name: product.name,
    id: product.id,
    quantity: product.quotation.count,
    price: `${
      (product.pricing.sellPrices.perPiece.net / 100) * product.quotation.count
    } €`,
    link: `https://www.mon-marche.fr/produit/${product.slug}`,
  }));
};

/** --- Clear cart --- **/
export const clearCart = async () => {
  if (!existsSync(filePath)) {
    return { error: "You have to log in first" };
  }

  const clearCartResponse = await apiCall<CartResponse>({
    endpoint: "/cart",
    method: "DELETE",
  });

  if (!clearCartResponse) {
    throw new Error(`Failed to clear cart: ${clearCartResponse}`);
  }
  return { status: "Cart cleared" };
};
