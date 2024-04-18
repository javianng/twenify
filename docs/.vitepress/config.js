import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'twenify',
  description:
    "Twenify is your go-to productivity platform, meticulously crafted to tackle the challenges of modern-day student life while catering to the needs of individuals striving for efficient time management. Whether you're a student aiming for academic excellence or a professional seeking enhanced productivity, Twenify has got you covered.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'Conventions', link: '/conventions' },
      { text: 'Git-Github Workflow', link: '/git-github-workflow' },
      { text: 'Issue Tracking', link: '/issue-tracking' },
      { text: 'Project Structure', link: '/project-structure' }
    ],

    sidebar: [
      {
        items: [
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Conventions', link: '/conventions' },
          { text: 'Git-Github Workflow', link: '/git-github-workflow' },
          { text: 'Issue tracking', link: '/issue-tracking' },
          { text: 'Project Structure', link: '/project-structure' }
        ]
      }
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }]
  }
})
