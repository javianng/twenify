# Conventions

This page will discuss not only coding conventions in all TypeScript files, but also the conventions used as part
of our [Git and GitHub workflow](/docs/git-github-workflow).

## Git and GitHub

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) when writing commit messages.
In short, the commit message should be in the following format:

```
<type>[optional scope]: <description>
```

The `type` must be one of the following:

- **`feat`** for new features,
- **`fix`** for bug fixes,
- **`refactor`** for code changes that neither fixes a bug nor adds a feature,
- **`build`** for commits that modify dependencies or build scripts,
- **`style`** for commits that only modify the formatting of code,
- **`chore`** for any other changes that don't modify the functionality of the source code.

Other less frequently used `type`s include `docs`, `ci`, `perf`, `test` and `revert`.

The `scope` is optional and can be used to specify the part of the codebase that the commit affects.
For example, new features to the CMS will be prefixed with `feat(cms):`.

The `description` should be a short one-line summary of the changes made in the commit.

<Callout type="info" emoji="ℹ️">
    **The description must be written in the imperative mood, start in lowercase, and end *without* a period.**

    For example, `feat: implement user sign-in` is a valid commit message.
    The following are not valid commit messages:
    - `feat: implemented user sign-in`
    - `feat: Implement user sign-in`
    - `feat: implement user sign-in.`
    - `Implement user sign-in`
    - `Implement some features` (too vague)

    If you are unsure whether a description is valid, read it with the sentence "This commit will..."
    followed by the description. If it sounds right, it is probably correct.

</Callout>

### Pull Requests

Pull request titles should follow the same format as commit messages.

You should also include a brief description of the changes made in the PR, and link to any relevant issues to be closed.
If the PR is a work in progress, please include `(wip, don't merge)` as the scope in the title.

Screenshots to show the changes made are also appreciated.

<Callout type="info" emoji="ℹ️">
    Pull requests should be limited in scope as much as possible — only tangentially related changes should be included
    within the same PR.

    For example, if you are working on a new feature, you should not include unrelated bug fixes in the same PR.
    Instead, create a separate branch and PR for them.

</Callout>

Each issue in the issue tracker has an issue number starting with a `#`.
If your PR resolves an issue, please include `Resolves #<issue number>.` in the PR description to automatically close the issue
when the PR is merged.

## TypeScript

- We use 4 spaces for indentation.
- Line lengths are limited to 120 characters, but this is not a hard limit.
- Run `npm run format` to format your code before committing.

<Callout type="warning" emoji="⚠️">
    `npm run format` will not automatically break lines in `className` props. You should insert line breaks manually.
</Callout>

- TypeScript files must end with `.ts` and React components and pages with `.tsx`.
- `.ts` filenames must be in `camelCase` and `.tsx` filenames in `PascalCase`.
- The only exception to the above rule is for Next.js pages which must be named `index.tsx`.

### `*.tsx`

The following conventions apply to all React components in `.tsx` files.

- Declared types for the props of a component should be named `<ComponentName>Props` and located immediately above the component declaration.
- Keep unrelated exported components in separate files.
- Return types should be inferred where possible and not explicitly declared.
- You can (and should) destructure props in the function signature if it will fit on one line.
- TailwindCSS classes should be declared in the `className` prop, not `class`, as required by React.

An example component:

```tsx
type ComponentProps = {
    prop1: string;
    prop2: number;
    // ...
};

export default function Component({prop1, prop2, ...}: ComponentProps) {
    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold">{prop1}</h1>
            <p className="text-xl">{prop2}</p>
        </div>
    );
}
```

### `index.tsx`

The following conventions apply to all Next.js pages in `index.tsx` files.

#### Using `getServerSideProps` (gSSP) or `getStaticProps` (gSP)

- If present, place the `getServerSideProps` or `getStaticProps` function at the top of the file, below the imports.
- gSSP and gSP functions should be typed with `GetServerSideProps` and `GetStaticProps` respectively exported from `next`.
- Place the type definition of the `props` returned by gSSP/gSP immediately below.
- Alternatively, you can inline the type definition in the page's function signature with `NextPage<Props>`.

An example page using gSSP:

```tsx
import { GetServerSideProps, NextPage } from 'next'

type PageProps = {
  // ...
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  // ...
}

export const Page: NextPage<PageProps> = () => {
  // ...
}
```

#### Not using gSSP/gSP

- Your page function signature should be `export default function Page()`.

```tsx
export default function Page() {
  // ...
}
```
