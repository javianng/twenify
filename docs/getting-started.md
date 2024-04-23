# Getting Started

This guide will start from a blank slate and assumes that you have little to no prior experience in full-stack web development.

## Pre-requisites

Before you get started, ensure that you have the following software installed on your development machine.

- [**Node.js**](https://nodejs.dev/en/download/) v16.17.1 or higher
- [**Git**](https://git-scm.com/downloads) v2.17.0 or higher
- a [**GitHub**](https://github.com) account with read and write permissions to the [twenify codebase](https://github.com/javianng/twenify).
  If you do not have access to the codebase, please let any member of the core team know.
- any IDE of your choice, but [**WebStorm**](https://www.jetbrains.com/webstorm/) is strongly recommended.
  [Visual Studio Code](https://code.visualstudio.com/) is also another popular choice, but requires additional configuration with plugins.
- any terminal of your choice, but if you are on Windows, [**WSL 2**](https://learn.microsoft.com/en-us/windows/wsl/install) is strongly recommended.

The next few command-line tools are optional for those familiar with the graphical user interface (GUI) of GitHub or PlanetScale.

- [**GitHub CLI**](https://cli.github.com/) v2.24.0 or higher

For the purposes of this guide, we will be using the command-line interface (CLI) wherever available.

## Setup

1. In your terminal, navigate to the directory where the repository should be located.

```
cd /path/to/directory
```

2. Clone the repository.

```
git clone https://github.com/javianng/twenify.git
```

3. Navigate to the newly created folder containing the twenify codebase.

```
cd twenify
```

4. Install the dependencies.

```
npm install
```

5. Start the development server, then navigate to `http://localhost:5173` in your browser.
   You should see the twenify landing page.

```
npm run dev
```

6. You're all set! Read on to learn more about the codebase and our workflow before you begin contributing.
