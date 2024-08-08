# 🤖 Build Your First Bot 

Let's build our first Telegram bot with Televerse. 

Once you install Televerse package into your Dart / Flutter project you're already on full power to build amazing Telegram bots on your own. 

## Setup your Bot with [@BotFather](https://t.me/BotFather)

First, go talk with [@BotFather](https://t.me/BotFather) and get your bot token. Yeah, you already know this, Bot token is the identifier you use to communicate with Telegram servers to do particular actions with your bot. So, keep it safe, and use it wise.

## 🧩 Create your Bot Instance

Televerse package provides the `Televerse` class or aliased `Bot` class which can be used to create a bot instance.

Get back to your dart file. Write these lines:

Import Televerse into your file.

```dart
import 'package:televerse/televerse.dart';
```

And create the bot instance like:

```dart
    // Optional but safe: Get bot token from environment variables
    final String token = Platform.environment["BOT_TOKEN"]!;

    // Pass the bot token into Bot class to get an instance.
    Bot bot = Bot(token); 
    // This is the same as Televerse bot = Televerse(token)
```

Whoohoo! We have our bot instance ready to lunch! 🚀

## 💡 Idea

Let's create a simple bot that will greet the users with their name and when user sends a message to the bot, it'll count the characters in the message and send it back to the user.

So you need to setup a listener for the `/start` command as Telegram bots are always started with the `/start` command. And you need to setup a listener for the `message` event to count the characters in the message.

## 🎧 Setup Listeners


### Start command

Televerse provides a simple way to setup listeners for the events. You can use the `command` method to add a listener for the comamnds you specify. So let's do this for `/start`.

```dart
    bot.command("start", (ctx) {
        final String name = ctx.message.from!.firstName;
        ctx.reply("Hello $name!");
    });
```

The callback function accepts a parameter of type `MessageContext` which contains all the useful methods and data about the currently recieved message. For example, we can get the incoming message that is `/start` command message using `ctx.message` and can get the first name of the user as `ctx.message.from!.firstName`.

That's it, we've already done with the first part.

If you want to try it out right now, add one more line:

```dart
await bot.start();
```

And your bot is all set to recieve updates from Telegram servers. Just open your bot in Telegram, send a /start command.

![Start](/screenshots/start.png)

Whoohoo! That's a good sign! We got the first message from our bot! 🎉

### Message length counter

One last listener for the text messages. Let's learn about one more powerful method on Televerse.

It's the `on` method. The `on` method lets you filter out updates and listen for particular messages only. We're good to try it right away.

Set a listener for the `TeleverseEvent.text` filter. On the `on` method the callback function accepts the parameter of type `Context` which is an abstract class contains all basics methods and properties about the particular incoming update.

📝 Note: You might need to manually type cast to desired `Context` object such as `MessageContext` to have access to better context usage. 

The reason behind this is, with the `on` method you can listen to a vast variety of incoming updates - not just limited to incoming messages but also to callback queries, and inline queries etc.

So, let's type cast the `ctx` object to `MessageContext` and use it to reply with the length of the message.

```dart
  bot.on(TeleverseEvent.text, (ctx) {
    ctx as MessageContext;
    final int letterCount = ctx.message.text!.length;
    ctx.reply("Your message has $letterCount letters.");
  });
```

There we go! Now when you send a text message bot replies with the count of characters in your message!

![Bot Replies](/screenshots/final.png)

## 🎉 Whoohoo!

We made a bot with Televerse. Hope you had a good time learning about building Telegram bot with Televerse.

Hope to see you around :)