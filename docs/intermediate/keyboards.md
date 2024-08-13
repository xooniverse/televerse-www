# Mastering Keyboards for Better Bot Engagement

If you've been hanging around Telegram bots, you've definitely come across those nifty little keyboards that make interacting with the bot much easier. Telegram bots primarily support two types of keyboards: the Reply Keyboard, also known as the Custom Keyboard (`ReplyKeyboardMarkup`), and the Inline Keyboard (`InlineKeyboardMarkup`).

The Custom Keyboard is presented to the user, and when an option is selected, the option text is sent as a message. This can drastically simplify and streamline user interaction with your bot. However, there are times when you want to take an action without sending a message, like toggling off game notifications. That’s where Inline Keyboards come into play. Both keyboards have their own button types tailored for specific use cases.

Televerse supports building both types of keyboards out of the box. Not only that, Televerse simplifies the process with its custom utility classes—fittingly named `Keyboard` and `InlineKeyboard`.

## The Telegram Way

According to Telegram's Bot API documentation, you'll notice methods accepting a `reply_markup` parameter of type `InlineKeyboardMarkup` or `ReplyKeyboardMarkup`. These are the ones that support sending keyboards.

For example, consider this scenario:

![Keyboard Example](/keyboards/keyboard.png)

To build a keyboard like this, you might write a snippet like this:

```dart
bot.command("start", (ctx) async {
    final keyboard = ReplyKeyboardMarkup(
        keyboard: [
            [
                KeyboardButton(text: "📱 Account"),
            ],
            [
                KeyboardButton(text: "⚙️ Settings"),
                KeyboardButton(text: "🤌 Nevermind"),
            ]
        ],
    );

    await ctx.reply(
        "Please choose an option.",
        replyMarkup: keyboard,
    );
});
```

If you're thinking, "That looks tedious," you're not alone. This is where Televerse's custom `Keyboard` and `InlineKeyboard` classes come to the rescue.

## Keyboard

Let’s revisit the same example using Televerse's `Keyboard` class:

```dart
bot.command("start", (ctx) async {
  final keyboard = Keyboard()
      .text("📱 Account")
      .row()
      .text("⚙️ Settings")
      .text("🤌 Nevermind");

  await ctx.reply("Please choose an option.", replyMarkup: keyboard);
});
```

See the difference? The `Keyboard` class in Televerse simplifies the process, making it a breeze to convert your logic into Telegram Keyboards. We handle the JSON parsing under the hood so you can focus on the fun stuff—building great bot experiences.

### The Power of `Keyboard`

You might be wondering if `Keyboard.text` is the only method available. Not at all! The `Keyboard` class offers various methods for adding different kinds of buttons to your keyboard. Here's a breakdown:

| Method | Description | 
| --- | --- |
| `text`| Adds a simple text button to the keyboard. |
| `texts` | Adds multiple text buttons as a row. |
| `row` | Adds a new row to the keyboard. |
| `requestContact` | Adds a button that requests the user's phone number as contact. |
| `requestLocation` | Adds a button that requests the user's current location. |
| `addPlaceholder` | Adds placeholder text to be shown in the input field. |
| `requestUser` | Adds a button that prompts the user to select one of their personal chats (shared as [UsersShared](https://core.telegram.org/bots/api#usersshared)). |
| `requestChat` | Adds a button that prompts the user to select a chat. |

With these options, the `Keyboard` class in Televerse becomes an indispensable tool for boosting your bot's user experience by a factor of 100. And the best part? It’s also 100 times easier to build.

## Handling Keyboard Taps

Now that you’ve presented a keyboard to the user, how do you handle the button taps? Simple. When a button is tapped, the text on the button is sent as a regular text message. All you need to do is listen for incoming message updates. You can use the `Bot.text` method for this:

```dart
bot.text("⚙️ Settings", (ctx) async {
    // Load some settings and reply to the user
    await ctx.reply("Here are your settings.");
});
```

That’s it! When the user taps the "⚙️ Settings" button, your bot will respond with the message you’ve defined. Easy, right?

## Inline Keyboard

As we've discussed, there are times when your users don't need to send a message to take action—like toggling notifications on or off, selecting an option from a list, or implementing pagination. For these scenarios, Inline Buttons are the way to go. When a user taps a button on an Inline Keyboard, your bot receives a callback query.

Here's what an Inline Keyboard looks like:

![Inline Keyboard](/keyboards/inline-keyboard.png)

Building this is just as easy as building a `Keyboard`. The main difference is that, with Inline Keyboards, you’ll need to pass an additional `callback_data` parameter along with the button text.

```dart
bot.command("search", (ctx) async {
  // Make sure to calculate the current, next, and other pages
  final keyboard = InlineKeyboard()
      .add("<< 1", "first")
      .add("< 3", "previous")
      .add("• 4 •", "current")
      .add("5 >", "next")
      .add("10 >>", "last")
      .row()
      .addUrl("🌐 Search on the Web", "https://google.com/...");

  await ctx.reply("Results Page 4.", replyMarkup: keyboard);
});
```

And that’s it—your Inline Keyboard is ready. When a button is pressed, you’ll receive a `CallbackQuery` update that includes the `callback_data` as the `CallbackQuery.data` property. So, how do you make this keyboard interactive? We've got you covered.

You can use the `Bot.callbackQuery` method to listen for callback queries with specific data. In this case, you could handle the "previous" button like this:

```dart
bot.callbackQuery("previous", (ctx) async {
  final data = ctx.callbackQuery!.data;
  // Move to the previous page
  // ...
  // Then update the message
  await ctx.editMessageText(
    "Results Page X",
    replyMarkup: updatedKeyboard(...),
  );
});
```

You might be wondering if there’s a better way to bind buttons to their related actions. Absolutely. That’s where Menus in Televerse come into play. Menus are extended versions of `Keyboard` and `InlineKeyboard`, and we’ll dive into that in the next chapter.

In the meantime, have fun playing around with keyboards and enhancing your bot’s engagement. The sky's the limit with Televerse!