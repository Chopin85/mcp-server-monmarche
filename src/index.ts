import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { addProduct, searchProducts } from "./utils/monmarche.js";

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

      const filteredProducts = products.filter((p) => p.name && p.price);

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
        name: z.string().describe("Name of the product to add"),
        quantity: z
          .number()
          .min(1)
          .max(100)
          .describe("Quantity of the product to add"),
      }),
    },
  },
  async ({ product }) => {
    const { url, name, quantity } = z
      .object({
        url: z.string().url().optional().describe("URL of the product to add"),
        name: z
          .string()
          .min(1)
          .max(100)
          .describe("Name of the product to search"),
        quantity: z
          .number()
          .min(1)
          .max(100)
          .describe("Quantity of the product to add"),
      })
      .parse(product);

    try {
      const productAdd = await addProduct({ url, name, quantity });
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

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("✅ MCP server running on stdio");
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
