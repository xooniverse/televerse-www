import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  outDir: "../out",
  title: "Televerse - Your gateway to seamless Telegram Bot Development",
  description: "Your gateway to a seamless Telegram Bot development",
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: 'https://televerse.xooniverse.com/assets/logo.png' }],
    ['meta', { name: 'description', content: 'A powerful Telegram Bot API Framework built with Dart' }],
    ['meta', { name: 'keywords', content: 'Televerse, Telegram bot, Dart, Telegram API, bot framework, Xooniverse' }],

    // Open Graph Meta Tags
    ['meta', { property: 'og:title', content: 'Televerse' }],
    ['meta', { property: 'og:description', content: 'A powerful, easy-to-use, and highly customizable Telegram bot framework built with Dart language.' }],
    ['meta', { property: 'og:image', content: 'https://televerse.xooniverse.com/assets/lockup-with-bg.png' }],
    ['meta', { property: 'og:url', content: 'https://github.com/Xooniverse/televerse' }],
    ['meta', { property: 'og:site_name', content: 'Televerse' }],

    // Twitter Meta Tags
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Televerse' }],
    ['meta', { name: 'twitter:description', content: 'A powerful, easy-to-use, and highly customizable Telegram bot framework built with Dart language.' }],
    ['meta', { name: 'twitter:image', content: 'https://televerse.xooniverse.com/assets/lockup-with-bg.png' }],

    // Robots Meta Tag
    ['meta', { name: 'robots', content: 'index, follow' }],

    // Alternate Links
    ['link', { rel: 'alternate', hreflang: 'en', href: 'https://televerse.xooniverse.com/en' }],

    // Canonical Link
    ['link', { rel: 'canonical', href: 'https://televerse.xooniverse.com' }],

    // Author and Publisher
    ['meta', { name: 'author', content: 'Xooniverse' }],
    ['meta', { name: 'publisher', content: 'Xooniverse' }],
  ],
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
