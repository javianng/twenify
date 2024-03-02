# Project Structure

This page will go into the details of the folder structure of the codebase.
It assumes that you have at least some understanding of the libraries and frameworks we use.

If you are new to the project, you should read the [Getting Started](/getting-started) page first,
and then check out the documentation of each of the libraries and frameworks mentioned before continuing.

```
twenity
├─ docs
├─ public
│  └─ *
├─ src
│  ├─ assets
│  ├─ components
│  ├─ views
│  │  └─ Dashboard.vue
│  │  ├─ Home.vue
│  │  ├─ Register.vue
│  │  ├─ SignIn.vue
│  ├─ App.vue
│  ├─ main.js
├─ .gitignore
├─ package.json
└─ package-lock.json
```

# Documentation

## `public`

The `public` folder contains static files that are served to the client. This includes the Twenity logo in `favicon.ico` and various images used in banners and promotions.

## `src`

The `src` folder is where you will spend the majority of your time. It does not contain any files directly; instead, its sub-directories are of interest.

### `src/assets`

The `assets` directory is used for storing project assets like images, fonts, etc.

### `src/components`

The `components` directory contains reusable Vue components. These components can be used across different views/pages.

### `src/views`

The `views` directory contains Vue components that represent different views or pages in the application.

#### `src/views/Dashboard.vue`

The `Dashboard.vue` file represents the dashboard view of the application.

#### `src/views/Home.vue`

The `Home.vue` file represents the home page of the application.

#### `src/views/Register.vue`

The `Register.vue` file represents the register page of the application.

#### `src/views/SignIn.vue`

The `SignIn.vue` file represents the sign-in page of the application.

### `src/App.vue`

The `App.vue` file is the root Vue component that serves as the entry point for the application.

### `src/main.js`

The `main.js` file is the main JavaScript file where the Vue application is initialized and configured.

### `docs`

The `docs` folder contains documentation for the website. This includes guides, tutorials, and any other d
