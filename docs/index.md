---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
titleTemplate: false

hero:
  name: "Televerse"
  text: "Your gateway to seamless Telegram Bot Development"
  tagline: Build Bots, Like A Boss
  actions:
    - theme: brand
      text: Start the Journey 🚀
      link: https://pub.dev/packages/televerse
    - theme: alt
      text: Read the Docs
      link: /docs
  image:
    src: /assets/lockup.png
    alt: Televerse Logo

features:
  - title: Simple
    details: Televerse is designed with user-friendliness in mind. Building your bots never been this easy.
    icon: "✨"
  - title: Powerful
    details: Televerse offers extensive customization options to tailor the library to your specific needs.
    icon: "⚡️"
  - title: Community-Driven
    details: Televerse stands open-source all the time. We value the community, we value the network.
    icon: "🕸️"
---

## What exactly is Televerse?

Televerse is a powerful, easy-to-use, and highly customizable Telegram bot framework built with Dart programming language. It provides a complete and well-structured API that enables developers to create and deploy complex Telegram bots with ease. Televerse provides a total of 0 dynamic types on its public interface, making it easy for developers to write strictly typed code.

## How do I get started?

Building a simple bot is as simple as two steps. 

### 1. Get Televerse

Add `televerse` to your `pubspec.yaml` file by running `dart pub add televerse`.

  ```bash
  dart pub add televerse
  ```

### 2. Code your Bot

Get your bot ready in a few lines.

```dart [Dart]
import 'dart:io';
import 'package:televerse/televerse.dart';

// Create the bot instance
final bot = Bot(Platform.environment["BOT_TOKEN"]!);

void main(List<String> args) async {
  // Handle the /start command
  bot.command("start", (ctx) async {
    await ctx.reply("Welcome to Televerse! 🚀");
  });

  // Start the bot
  await bot.start();
}
```

That's it, your bot should be running fine and listening to the `/start` command.

---

Televerse supports the latest Telegram Bot API - 7.8!