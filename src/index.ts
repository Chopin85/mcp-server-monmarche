import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  addProduct,
  searchProducts,
  getCartList,
  clearCart,
} from "./utils/monmarche.js";

// Create an MCP server
const server = new McpServer({
  name: "monmarche-server",
  version: "1.0.0",
});

// Tool searchProduct
server.registerTool(
  "searchProduct",
  {
    title: "Search Product",
    description: "Search for a product on Mon Marché",
    inputSchema: {
      query: z.object({
        name: z
          .string()
          .min(1)
          .max(100)
          .describe("Name of the product to search"),
      }),
    },
  },
  async ({ query }) => {
    try {
      const args = z
        .object({
          name: z
            .string()
            .min(1)
            .max(100)
            .describe("Name of the product to search"),
        })
        .parse(query);

      const products = await searchProducts(args.name);

      if (!Array.isArray(products) || products.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No products found matching "${args.name}". Try a different search term.`,
            },
          ],
        };
      }

      const filteredProducts = products.filter((p) => p.name);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(filteredProducts, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error("Error in searchProduct tool:", error);

      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error searching for product: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          },
        ],
      };
    }
  }
);

// Tool addProduct
server.registerTool(
  "addProduct",
  {
    title: "Add Product",
    description: "Add a product to the Mon Marché shopping cart",
    inputSchema: {
      product: z.object({
        id: z.string().describe("ID of the product to add"),
        quantity: z.number().min(1).describe("Quantity of the product to add"),
      }),
    },
  },
  async ({ product }) => {
    const { id, quantity } = z
      .object({
        id: z.string().describe("ID of the product to add"),
        quantity: z.number().min(1).describe("Quantity of the product to add"),
      })
      .parse(product);

    try {
      const result = await addProduct({ id, quantity });
    } catch (error) {
      console.error("Error adding product:", error);
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error adding product: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `Product added to cart: ${JSON.stringify(product)}`,
        },
      ],
    };
  }
);

// Tool getCartList
server.registerTool(
  "getCartList",
  {
    title: "Get Cart List",
    description:
      "Retrieve the list of products in the Mon Marché shopping cart",
    inputSchema: {},
  },
  async () => {
    try {
      const cartItems = await getCartList();

      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "Your shopping cart is empty.",
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(cartItems, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error("Error retrieving cart list:", error);

      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error retrieving cart list: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          },
        ],
      };
    }
  }
);

// Tool clearCart
server.registerTool(
  "clearCart",
  {
    title: "Clear Cart",
    description: "Clear all products from the Mon Marché shopping cart",
    inputSchema: {},
  },
  async () => {
    try {
      const result = await clearCart();

      return {
        content: [
          {
            type: "text",
            text: `Shopping cart cleared.`,
          },
        ],
      };
    } catch (error) {
      console.error("Error clearing cart:", error);

      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error clearing cart: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          },
        ],
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("✅ MCP server running on stdio");
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
