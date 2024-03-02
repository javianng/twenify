# Project Structure

This page will go into the details of the folder structure of the codebase.
It assumes that you have at least some understanding of the libraries and frameworks we use.

If you are new to the project, you should read the [Getting Started](/getting-started) page first,
and then check out the documentation of each of the libraries and frameworks mentioned before continuing.

```
twenity
├─ public
│  └─ *
├─ src
│  ├─ assets
│  │  └─ *
│  ├─ components
│  │  └─ common
│  │  └─ *
│  ├─ pages
│  │  ├─ docs
│  │  │  └─ *
│  │  ├─ _app.tsx
│  │  └─ index.tsx
├─ .gitignore
├─ env.mjs
├─ package.json
└─ package-lock.json
```

## `public`

The `public` folder contains static files that are served to the client.
This includes the twenity logo in `favicon.ico` and various images used in banners and promotions.

## `src`

The `src` folder is where you will spend the majority of your time.
It does not contain any files directly; instead, its sub-directories are of interest.

### `src/pages`

The `src/pages` directory defines the different routes of the website.
This directory also contains special `4xx.tsx` pages for client-side errors.

In addition, the `src/pages/_app.tsx` and `src/pages/_document.tsx` files are special Next.js files that
form the root of every page. **These should not be modified.**

<Callout type="info" emoji="ℹ️">
    Next.js uses file-based routing. As a convention, we name all our pages `index.tsx`, even though Next.js
    allows different names for pages.

    This means that `pages/index.tsx` is the homepage at `/`, `pages/admin/index.tsx` is the admin dashboard at `/admin`,
    and so on.

</Callout>

If you need to create a new page, create new folder(s) in `pages` and add an `index.tsx` file in it for the page itself.

Read the section on [creating a new page](/creating-a-new-page) for a guide on how to write a new page with `index.tsx`.

For more information on how Next.js handles routing, see the [Next.js documentation](https://nextjs.org/docs/routing/introduction).

#### `src/pages/docs`

The `docs` folder contains the documentation for the website (including this page!).

Unlike the other folders in `src/pages`, this is the only directory in which `*.mdx` files are used to define pages
instead of `index.tsx` files. In addition, the naming convention of `index.tsx` does not apply here — any filename is
allowed to name a page.

The layout of documentation pages is automatically taken care of by [Nextra](https://nextra.site).

### `src/components`

Often, writing a page in a single file results in files with hundreds if not upwards of a thousand lines of code.

To prevent page definition `.tsx` files from exploding in size, we extract components into the `components` directory
and import them into the page file where necessary.

<Callout type="info" emoji="ℹ️">
    **Components should be defined following the same path as the page that uses them.** For example, if a component is needed
    in `pages/admin/index.tsx`, it should be defined in `components/admin/*.tsx`.

    Each component should be defined in its own file, and the file should be named after the component.

    **If a component is used in multiple pages, it should be defined in the `components/common` directory.**

</Callout>

### `src/app`

The `src/app` directory, also known as "app dir", is the directory used by the beta Next.js App Router.

Pages in the `app` directory take a drastically different approach to rendering pages than those in the `pages` directory.
The most prominent difference is that pages in the `app` directory can be nested
and follow a different naming convention (`page.tsx` instead of `index.tsx`).

The app directory is currently in beta, and existing libraries such as tRPC do not work with it.
As such, we have not migrated our pages yet.

For more information on the Next.js App Router, read their [beta documentation](https://beta.nextjs.org/docs).

### `src/server`

All of the above directories are for client-side (frontend) code.
The `src/server` directory contains all of the code that runs exclusively server-side.

This prevents the client from being able to access sensitive information and call server functions from the client.

#### `src/server/auth.ts`

The `auth.ts` file contains the code for authenticating users with [NextAuth](https://next-auth.js.org/).

We currently allow users to sign in either with credentials (username and password) or with OAuth using their Google account.
In the future, if more sign in methods (known as providers) are added, they should be added to the `providers` array in this file.

We also use JWTs to authenticate users. The `jwt` object in this file defines the JWT payload and how it is encoded and decoded.

<Callout type="warning" emoji="⚠️">
    JWTs should not be used to store sensitive information on the client, as they are only meant to provide integrity
    about its payload. If you need to store sensitive information, write to the database instead.
</Callout>

For more information on how JWTs work, check out [jwt.io](https://jwt.io/).

This file also exports the function `getServerAuthSession` function which allows server-side code to request for
the user's session, for example, to check if the user is allowed to access a certain page based on their role.

For more information on how to use this function, check out the [T3 stack's guide on NextAuth](https://create.t3.gg/en/usage/next-auth).

#### `src/server/api`

Server side code is not limited to authentication. The `src/server/api` directory contains all of the server-side code,
such as generating itineraries, sending emails, and so on.

Unlike traditional backend code where RESTful API endpoints e.g. `/api/itineraries` are defined in individual files,
and invoked with a [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) call,
our server-side code is written with [tRPC](https://trpc.io/).

tRPC is a framework centered around the concept of [routers](https://trpc.io/docs/server/routers) and [procedures](https://trpc.io/docs/server/procedures).
A router is a collection of procedures, and a procedure is a function that can be called by the client with full
type-safety and auto-completion.

<Callout type="info" emoji="ℹ️">
    **Routers should be defined in separate files in `server/api/routers` for each logical grouping of procedures.**
    For example, procedures related to attractions and itineraries should be kept in separate router files.

    After creating a router, import it and add it to the root router in `server/api/root.ts`.

</Callout>

### `.env`, `env.example` and `env.mjs`

The `.env` file contains environment variables that are used by the website.

<Callout type="warning" emoji="⚠️">
    **The contents of `.env` are secrets.**
    Do not disclose the value of any environment variable to anyone.

    In addition, do not commit the `.env` file to Git. A rule in `.gitignore` to prevent this has already
    been set up, but please be aware of this nonetheless.

</Callout>

The `env.example` file is a template for the `.env` file. It contains all of the environment variables that are used
and is intended as a reference for developers to know what environment variables are needed when cloning the repository.

The `env.mjs` file is a JavaScript module that validates the environment variables in `.env` with [Zod](https://zod.dev)
and exports the environment variables as a JavaScript object for use elsewhere.

<Callout type="info" emoji="ℹ️">
    **Both `.env.example` and `env.mjs` should be updated whenever environment variables are added, removed, or modified
    in `.env`.** Otherwise, validation will fail and running any `npm` command to host the website will fail.
</Callout>

### `package.json` and `package-lock.json`

The `package.json` file contains the dependencies of the website, as well as the scripts used to build and/or serve
the website.

Dependencies are split into `dependencies` and `devDependencies`. The former is for dependencies that are required
to run the website, while the latter is for dependencies that are only required for development and are not included
in the production build.

The `package-lock.json` file is a lockfile that contains the exact versions of the dependencies that are installed.
It should be committed to ensure that all developers are using the same versions of the dependencies.
