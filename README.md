# My MCP Server

This project is a Model Context Protocol (MCP) server for interacting with the [Mon Marché](https://www.mon-marche.fr/) french grocery store website. It provides tools to search for products and add them to a cart using a command-line interface.

## Features

- **Search Products**: Search for products by name on the Mon Marché website.
- **Add Products to Cart**: Add products to your cart by specifying their name.
- **Check Cart**: Check the products on your cart.
- **Clear Cart**: Remove all products from your cart.
- **Session Management**: Automatically logs in and manages session cookies for interacting with the website.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Mon Marché account with valid credentials

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Chopin85/mcp-server-monmarche
   cd mcp-server-monmarche
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file based on the `.env.example` file:

   ```bash
   cp .env.example .env
   ```

   Fill in your Mon Marché credentials:

   ```env
   MON_MARCHE_EMAIL=your-email@example.com
   MON_MARCHE_PASSWORD=your-password
   ```

4. Build the project:

   ```bash
   npm run build
   ```

## Usage

### Build

Before using the tools, you need build:

```bash
npm run build
```

### Login Session

Before using the tools, you need to log in to Mon Marché:

```bash
npm run login
```

This will save the session cookies to session-cookie.json.

### Start the Server

Run the server:

```bash
node build/index.js
```

The server will start and listen for requests via the standard input/output (stdio) transport.

### Tools

#### Search Products

Use the `searchProduct` tool to search for products by name:

```json
{
  "name": "searchProduct",
  "query": {
    "name": "pomme"
  }
}
```

#### Add Products to Cart

Use the `addProduct` tool to add a product to your cart:

```json
{
  "name": "addProduct",
  "arguments": {
    "product": {
      "id": "VwsP7FRQ7",
      "quantity": 6
    }
  }
}
```

### Commands

You can also run commands directly thefrom CLI:

- **Login**: `npm run login`
- **SearchProducts**: `npm run searchProducts pomme`
- **AddProduct**: `npm run addProduct -- --id VwsP7FRQ7 --quantity 6`
- **GetCartList**: `npm run getCartList`
- **CleartCart**: `npm run clearCart`

## Project Structure

- index.ts: Main server implementation.
- monmarche.ts: Utility functions for interacting with the Mon Marché website.
- .env.example: Example environment variables file.
- tsconfig.json: TypeScript configuration.
- package.json: Project metadata and scripts.

## Development

### Build

To compile the TypeScript code:

```bash
npm run build
```

### Run in Test Mode

You can run the server directly using `@modelcontextprotocol/inspector`:

```bash
npx @modelcontextprotocol/inspector node build/index.js
```

### Debugging

```bash
HEADLESS=false npx @modelcontextprotocol/inspector node build/index.js
```

## Known Issues

- Ensure you have valid Mon Marché credentials in the .env file.
- The session-cookie.json file must exist for the tools to work.

## License

This project is licensed under the ISC License.
