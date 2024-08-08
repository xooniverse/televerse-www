import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  outDir: "../out",
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
          { text: "Installation", link: "/installation" },
          { text: "Build Your First Bot", link: "/hello-world" },
        ]
      },
      {
        text: 'Context',
        base: "/context",
        items: [
          { text: 'Using Custom Context with Your Bot', link: '/custom-context' },
        ]
      },
      {
        text: 'Plugins',
        base: "/plugins",
        link: "/",
        items: [
          { text: 'Overview', link: '/' },
          {
            text: 'Official Plugins',
            collapsed: true,
            base: "/plugins/plugin",
            items: [
              { text: "auto_retry", link: "/auto-retry" },
              { text: "auto_chat_action", link: "/auto-chat-action" },
              { text: "parse_mode_setter", link: "/parse-mode-setter" },
            ]
          },
          { text: 'Build A Middleware', link: '/build-middleware' },
          { text: 'Build A Transformer', link: '/build-transformer' },
        ]
      },
    ],

    socialLinks: [
      { icon: "github", link: 'https://github.com/xooniverse/televerse', }
    ]
  }
})
