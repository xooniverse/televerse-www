import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Televerse - Your gateway to seamless Telegram Bot Development",
  description: "Your gateway to a seamless Telegram Bot development",
  themeConfig: {

    externalLinkIcon: true,
    siteTitle: "Televerse",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/docs' },
      { text: 'Examples', link: 'https://github.com/xooniverse/TeleverseExamples' }
    ],

    sidebar: [
      {
        text: 'Overview',
        base: "/docs",
        link: "/",
        items: [
          { text: "Features", link: "/features" },
          { text: "Installation", link: "/installation" }
        ]
      },
      {
        text: 'Context',
        items: [
          { text: 'Using Custom Context with Your Bot', link: '/context/custom-context' },
        ]
      }
    ],

    socialLinks: [
      { icon: "github", link: 'https://github.com/xooniverse/televerse', }
    ]
  }
})
