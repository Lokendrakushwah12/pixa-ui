![pixaui.com](https://github.com/Lokendrakushwah12/pixa-ui/blob/main/apps/www/public/og.png)

<h3 align="center">pixaui.com</h3>
<p align="center">The <strong>everything but AI</strong> company.</p>

## About the Project

pixaui.com is the ...
We're building the pixa stack, a one line `npm install @pixa` package that includes everything you need to build your application.

### Apps and Packages

- **`apps/www/`** - Main pixaui.com website
- **`packages/ui/`** - Shared UI components package
- **`packages/typescript-config/`** - TypeScript configurations
- **`biome.json`** - Shared Biome configuration for linting and formatting

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Environment Variables

This monorepo contains multiple Next.js applications that are designed to link to each other. For the navigation to work correctly, you must set up environment variables for both local development and production deployments.

#### Local Development

For local development, create a `.env.local` file in each of the app directories with the corresponding variables.

1.  **`www` app**

    This app needs to know the URLs of the other apps. Create a file at `apps/www/.env.local`:

    ```sh
    # apps/www/.env.local
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    ```

> [!NOTE]
> Turborepo is configured to watch for changes in `.env*` files, so it will automatically invalidate the cache when these variables change.

### Development

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Biome](https://biomejs.dev/) for linting and formatting

#### Build

To build all apps and packages:

```sh
pnpm run build
```

To build a specific app:

```sh
pnpm run build --filter=www
```

#### Develop

To develop all apps and packages:

```sh
pnpm run dev
```

To develop a specific app:

```sh
pnpm run dev --filter=www
```

## pixa ui

**pixa ui** is a collection of beautifully designed, accessible, and composable components for your React apps. Built on top of [Base UI](https://base-ui.com/) and styled with [Tailwind CSS](https://tailwindcss.com/), it's designed for you to copy, paste, and own.

We think Base UI is the best foundation for modern web applications. We've taken its powerful, unstyled primitives and given them a design system that's ready to go, right out of the box.

## Acknowledgements

Special thanks to:

- **[Tailwind CSS](https://tailwindcss.com/)** - For the utility-first CSS framework that powers our design system
- **[Base UI](https://base-ui.com/)** - For providing the robust, accessible primitives that form the foundation of our components
- **[shadcn/ui](https://ui.shadcn.com/)** - For inspiring our copy-paste approach and component philosophy
- **[Fumadocs](https://fumadocs.dev/)** - For providing the documentation framework that powers our component docs
