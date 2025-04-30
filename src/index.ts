import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import z from "zod";
import { addProduct, searchProducts } from "./utils/monmarche.js";

// Create the server
const server = new Server(
  {
    name: "product-api-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define tool schema using zod
const getProductsSchema = z.object({
  name: z.string().describe("Products name to search in the grocery store"),
});

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_products",
        description: "Search for product by name",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Product name to search for",
            },
          },
          required: ["name"],
        },
      },
      {
        name: "add_product",
        description: "Find product by name and add to cart",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Product name to find for add to cart",
            },
          },
          required: ["name"],
        },
      },
    ],
  };
});

// Helper function to format a product recipe nicely
function formatProduct(product: any) {
  return `
🍸 ${product.name} 🍸
-----------------
Name: ${product.name}
Price ${product.price}
  `;
}

// Implement the tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_products") {
    try {
      // Parse and validate arguments using zod
      const args = getProductsSchema.parse(request.params.arguments);

      const response = await searchProducts(args.name);

      if (!response) {
        throw new Error(`Products API error: ${response}`);
      }

      const data = response;

      // Check if any drinks were found
      if (!data) {
        return {
          content: [
            {
              type: "text",
              text: `No  found matching "${args.name}". Try a different search term.`,
            },
          ],
        };
      }

      // Format each product recipe

      const productResult = Array.isArray(data) ? data.map(formatProduct) : [];

      // Create the formatted response
      const result = `
        Found ${data} product(s) matching 
        "${args.name}":\n\n${productResult.join("\n\n")}
      `;

      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error) {
      console.error("Error in get_product tool:", error);

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

  if (request.params.name === "add_product") {
    try {
      // Parse and validate arguments using zod
      const args = getProductsSchema.parse(request.params.arguments);

      const response = await addProduct(args.name);

      if (!response) {
        throw new Error(`Products API error: ${response}`);
      }

      const data = response;

      // Check if any drinks were found
      if (!data) {
        return {
          content: [
            {
              type: "text",
              text: `No add to cart"${args.name}". Try a different search term.`,
            },
          ],
        };
      }

      // Format each product recipe

      const productResult = Array.isArray(data) ? data.map(formatProduct) : [];

      // Create the formatted response
      const result = `
        Found ${data} product(s) and added to cart 
        "${args.name}":\n\n${productResult.join("\n\n")}
      `;

      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error) {
      console.error("Error in get_product tool:", error);

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

  // Handle unknown tool
  return {
    isError: true,
    content: [
      {
        type: "text",
        text: `Unknown tool: ${request.params.name}`,
      },
    ],
  };
});

// Connect the transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("product API server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
