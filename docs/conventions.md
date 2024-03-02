# Conventions

This page will discuss not only coding conventions in all TypeScript files, but also the conventions used as part
of our [Git and GitHub workflow](git-github-workflow.md).

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

## JavaScript

- We use 4 spaces for indentation.
- Line lengths are limited to 120 characters, but this is not a hard limit.
- Run `npm run format` to format your code before committing.

<Callout type="warning" emoji="⚠️">
    `npm run format` will not automatically break lines in template strings. You should insert line breaks manually.
</Callout>

- JavaScript files must end with `.js`.
- Filenames should be in `kebab-case`.
- The only exception to the above rule is for Vue components and pages which must be named `PascalCase`.

### `.js` and `.vue`

The following conventions apply to JavaScript files and Vue components in `.vue` files.

- Use the `export default` syntax for exporting Vue components.
- Vue components should be declared in `.vue` files.
- Keep unrelated exported components in separate files.

An example Vue component:

```vue
<template>
  <div class="flex flex-col items-center justify-center">
    <h1 class="text-4xl font-bold">{{ prop1 }}</h1>
    <p class="text-xl">{{ prop2 }}</p>
  </div>
</template>

<script>
export default {
  props: {
    prop1: String,
    prop2: Number
    // ...
  }
}
</script>
```
