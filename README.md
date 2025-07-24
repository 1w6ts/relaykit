# Relaykit Monorepo

Relaykit is a modern, open source monorepo for building scalable web applications with Next.js, TypeScript, and a shared UI system. It is designed for maintainability, rapid development, and a great developer experience.

## Table of Contents

- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Building](#building)
- [Contributing](#contributing)
- [Community](#community)
- [License](#license)

## Project Structure

```
apps/
  docs/      # Documentation site (Next.js)
  web/       # Main web app (Next.js)
  waitlist/  # Waitlist/marketing app (Next.js)
packages/
  ui/                # Shared React UI components
  eslint-config/     # Shared ESLint config
  typescript-config/ # Shared TypeScript config
```

- Each app/package has its own README with specific instructions.
- All code is written in TypeScript.

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-org/relaykit.git
   cd relaykit
   ```
2. **Install dependencies:**
   ```sh
   pnpm install
   ```
3. **Run the development environment:**
   ```sh
   pnpm dev
   ```
   Or see each app's README for details.

## Development

- Use [Turborepo](https://turborepo.org/) for running, building, and testing across the monorepo.
- Lint and format code with ESLint and Prettier:
  ```sh
  pnpm lint
  pnpm format
  ```
- Run tests (if available):
  ```sh
  pnpm test
  ```

## Building

To build all apps and packages:

```sh
pnpm build
```

Or use Turborepo directly:

```sh
turbo build
```

## Contributing

We welcome contributions! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Community

- [GitHub Issues](https://github.com/your-org/relaykit/issues) — Report bugs or request features
- [Discussions](https://github.com/your-org/relaykit/discussions) — Ask questions, share ideas

## License

Relaykit is [MIT licensed](LICENSE).

---

_This project uses Turborepo, Next.js, TypeScript, and a modular, scalable architecture for professional open source development._
