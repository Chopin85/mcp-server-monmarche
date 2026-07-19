# Mon Marché MCP Server

A Model Context Protocol (MCP) server that connects LLMs to the [Mon Marché](https://www.mon-marche.fr/) French grocery store. This server enables AI assistants to search for products, manage a shopping cart, and interact with the Mon Marché platform.

## Features

- **Product Search**: Find products by name.
- **Cart Management**:
  - Add items to cart.
  - View current cart contents.
  - Clear the entire cart.
- **Session Handling**: Automated login and session persistence via cookies. Supports explicit `--session` flag for scripted/headless use.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A valid [Mon Marché](https://www.mon-marche.fr/) account

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Chopin85/mcp-server-monmarche
   cd mcp-server-monmarche
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Copy the example environment file and add your credentials:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and fill in your details:
   ```env
   MON_MARCHE_EMAIL=your-email@example.com
   MON_MARCHE_PASSWORD=your-password
   ```

4. **Build the project:**
   ```bash
   npm run build
   ```

## Configuration & Authentication

Before using the MCP server or tools, you must authenticate to generate a session.

**Run the login script:**
```bash
npm run login
```
This command logs in using credentials from `.env` and saves the session cookies to `session-cookie.json`.

> [!IMPORTANT]
> You must re-run `npm run login` if your session expires or if you delete `session-cookie.json`.

## Usage

### Running the MCP Server

To start the server for use with an MCP client (like Claude Desktop or an IDE extension):

```bash
node dist/index.js
```

### Testing with MCP Inspector

You can test the tools interactively using the MCP Inspector:

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

### CLI Tools

The project includes helper scripts to run tools directly from the command line for testing or automation.

All commands support an optional `--session` flag to use an explicit session token instead of `session-cookie.json`:

```bash
node dist/utils/cli.js <command> [args...] [--session <token>]
```

- **Search**:
  ```bash
  npm run searchProducts "pomme"
  ```
- **Add to Cart**:
  ```bash
  npm run addProduct -- --id <PRODUCT_ID> --quantity <QTY>
  ```
- **View Cart**:
  ```bash
  npm run getCartList
  ```
- **Clear Cart**:
  ```bash
  npm run clearCart
  ```

#### Using `--session` (explicit token)

Pass a session token directly to skip the `session-cookie.json` file:

```bash
# Direct node usage
node dist/utils/cli.js searchProducts "pasta" --session "abc123"
node dist/utils/cli.js getCartList --session "abc123"
node dist/utils/cli.js addProduct --id "123" --quantity 2 --session "abc123"
node dist/utils/cli.js clearCart --session "abc123"
```

```bash
# Via npm scripts (with -- separator)
npm run searchProducts -- "pasta" --session "abc123"
npm run getCartList -- --session "abc123"
npm run addProduct -- --id "123" --quantity 2 --session "abc123"
npm run clearCart -- --session "abc123"
```

> [!NOTE]
> When `--session` is provided, the `session-cookie.json` file is ignored for that call.

## Available Tools

The server exposes the following tools to MCP clients:

### `searchProduct`
Searches for products on Mon Marché.
- **Input**: `{ "name": "string", "session?": "string" }`
- **Returns**: List of matching products with IDs and details.

### `addProduct`
Adds a specific product to the cart.
- **Input**: `{ "id": "string", "quantity": number, "session?": "string" }`
- **Returns**: Confirmation of addition.

### `getCartList`
Retrieves the current contents of the shopping cart.
- **Input**: `{ "session?": "string" }`
- **Returns**: List of items in the cart.

### `clearCart`
Removes all items from the shopping cart.
- **Input**: `{ "session?": "string" }`
- **Returns**: Confirmation message.

> [!NOTE]
> All tools accept an optional `session` parameter. If omitted, the session is read from `session-cookie.json`.

## Troubleshooting

- **Login Failed**: Ensure your email and password in `.env` are correct.
- **Session Errors**: If tools return authentication errors, run `npm run login` to refresh your session cookies, or pass a valid token via `--session`.
- **Build Errors**: Make sure all dependencies are installed with `npm install`.

## License

This project is licensed under the ISC License.
