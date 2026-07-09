<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/javianng/twenify">
    <img src="public/twenifyLogo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">twenify</h3>

<p align="center">
A student productivity platform that tackles time management and digital distraction with a Pomodoro timer, integrated calendar/to-do list, website blocking tool, and Spotify music integration. Gamification features — a "QuackPal" virtual pet, a productivity leaderboard, and a friends system — keep the experience engaging and reward consistent focus. The app is a monorepo of three independently-deployed pieces: a Vue 3/Vite frontend, an Express backend for Google Calendar OAuth and Firebase auth, and a Chrome extension that enforces website blocking.
    <br />
    <a href="https://github.com/javianng/twenify"><strong>Explore the repo »</strong></a>
    <br />
    <br />
    <a href="https://twenify.vercel.app">View Demo</a>
    ·
    <a href="https://github.com/javianng/twenify/issues">Report Bug</a>
    ·
    <a href="https://github.com/javianng/twenify/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#project-structure">Project Structure</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

Twenify helps students beat time management and digital distraction with:

- **Pomodoro Timer** — focus sessions with configurable work/break intervals.
- **Calendar & To-Do List** — a FullCalendar-based scheduler that syncs with Google Calendar.
- **Website Blocker** — a companion Chrome extension that blocks distracting sites via `declarativeNetRequest`.
- **Spotify Integration** — control music without leaving the app.
- **QuackPal** — a virtual pet that grows as you stay productive.
- **Leaderboard & Friends** — social/gamification features to keep users motivated.

The app is split into three independently-deployed pieces:

| Part           | Stack                       | Deployed at                               |
| -------------- | --------------------------- | ----------------------------------------- |
| `/` (frontend) | Vue 3 + Vite                | `twenify.vercel.app`                      |
| `backend/`     | Express + Firebase Admin    | `twenify-backend.vercel.app`              |
| `extension/`   | Chrome MV3, Webpack + Babel | Loaded unpacked via `chrome://extensions` |

All three share one Firebase project, with user data stored in a single `Users/{email}` Firestore document.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [![Vue][Vue.js]][Vue-url]
- [![TailwindCSS][TailwindCSS]][TailwindCSS-url]
- Firebase (Auth + Firestore)
- Express (backend OAuth/token service)
- Chrome Extension (Manifest V3, `declarativeNetRequest`)
- FullCalendar, Chart.js

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

This is a monorepo with three independently-deployed parts (frontend, backend, extension), each with its own dependencies. To get everything running locally, set up each part separately.

### Prerequisites

- Node.js and npm
  ```sh
  npm install npm@latest -g
  ```
- A Firebase project (Auth + Firestore) — required by the frontend, backend, and extension.
- A Google Cloud OAuth client (Calendar API, `calendar.readonly` scope) — required by the backend.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/javianng/twenify.git
   cd twenify
   ```
2. **Frontend** (root) — initializes Firebase in `src/firebase.js`
   ```sh
   npm install
   npm run dev   # http://localhost:5173
   ```
3. **Backend** (`backend/`) — needs a `.env` with `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, and `SERVICE_ACCOUNT_KEY` (a JSON-stringified Firebase service account)
   ```sh
   cd backend
   npm install
   npm run dev   # http://localhost:8000
   ```
4. **Extension** (`extension/`) — bundles with Webpack, then load unpacked in Chrome
   ```sh
   cd extension
   npm install
   npx webpack
   ```
   Go to `chrome://extensions`, enable Developer Mode, and "Load unpacked" pointing at the `extension/` directory.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

Sign up or log in, then head to the dashboard to:

- Start a Pomodoro session to track focused work time.
- Add events and tasks to the integrated calendar/to-do list (syncs with Google Calendar once connected via OAuth).
- Toggle the website blocker and manage your blocklist — enforced by the companion Chrome extension.
- Check the leaderboard and add friends to stay motivated.
- Grow your QuackPal by staying productive.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- PROJECT STRUCTURE -->

## Project Structure

```
twenify/
├── src/            # Vue 3 frontend (views, components, router, firebase.js)
├── backend/        # Express app — Google OAuth + Firebase custom-token minting
├── extension/      # Chrome MV3 extension — website blocking via declarativeNetRequest
└── public/         # Static assets
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please open an issue with the tag "enhancement" or submit a pull request.
Don't forget to give the project a star! Thanks again!

`main` is production (auto-deployed) and `dev` is staging — direct pushes to either are prohibited. Cut feature branches from `dev` and open PRs back into `dev`.

1. Create your Feature Branch off `dev` (`git checkout -b feature/AmazingFeature dev`)
2. Commit your Changes following [Conventional Commits](https://www.conventionalcommits.org/) (`git commit -m 'feat: add some amazing feature'`)
3. Push to the Branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request into `dev`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

- Ng Zheng Han Javian - https://www.linkedin.com/in/javianngzh/
- Ooi Jia Yu, Anders - https://www.linkedin.com/in/andersooi/
- Sourick Paul - https://www.linkedin.com/in/sourick-paul/
- Anushka Ashirgade - linkedin.com/in/anushka-ashirgade/

Project Link: [https://github.com/javianng/twenify](https://github.com/javianng/twenify)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/javianng/twenify.svg?style=for-the-badge
[contributors-url]: https://github.com/javianng/twenify/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/javianng/twenify.svg?style=for-the-badge
[forks-url]: https://github.com/javianng/twenify/network/members
[stars-shield]: https://img.shields.io/github/stars/javianng/twenify.svg?style=for-the-badge
[stars-url]: https://github.com/javianng/twenify/stargazers
[issues-shield]: https://img.shields.io/github/issues/javianng/twenify.svg?style=for-the-badge
[issues-url]: https://github.com/javianng/twenify/issues
[license-shield]: https://img.shields.io/github/license/javianng/twenify.svg?style=for-the-badge
[license-url]: https://github.com/javianng/twenify/blob/master/LICENSE.txt
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[TailwindCSS]: https://img.shields.io/static/v1?style=for-the-badge&message=Tailwind+CSS&color=222222&logo=Tailwind+CSS&logoColor=06B6D4&label=
[TailwindCSS-url]: https://tailwindcss.com/
