# Features

Televerse comes packed with a wide array of features designed to make bot development as seamless as possible:

## 1. 💪 Strictly Typed

Televerse uses 0 dynamic types on the public interface, ensuring type safety and
reliability throughout your bot development process.

## 2. 🎧 Extensive Listener Methods

Televerse offers a wide array of listener methods to cater to your bot's needs,
including:

| Method              | Description                                                                                                      |
| ------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `bot.command`       | For listening commands                                                                                           |
| `bot.hears`         | For listening to specified Regular Expression                                                                    |
| `bot.inlineQuery`   | For listening to inline query with specified query text                                                          |
| `bot.text`          | For listening to message with specified text                                                                     |
| `bot.callbackQuery` | For listening to specified callback data                                                                         |
| `bot.onDocument`    | For listening to messages that contain a document                                                                |
| `bot.onPhoto`       | For listening to photo messages                                                                                  |
| `bot.chatType`      | For filtering updates on specific type of chat such as Super Group or Channel or Private Chat                    |
| `bot.entity`        | Sets up handler method for messages that contains specified entity type                                          |
| `bot.myChatMember`  | Listens to change in Bot's chat member status - such as bot is added to a channel or kicked from a group etc.    |

- And much much more :)


```dart
/// Creates the bot instance, optionally passing the base URL of the local Bot API Server.
final Bot bot = Bot.local(
 "YOUR_BOT_TOKEN",
 baseURL: "mybotapi.com",
);
```

## 3. 🌐 Serverless Setup Compatibility

Whether you're using Cloud Functions or Lambda Functions, Televerse has you
covered. Utilize `Bot.handleUpdate` to handle updates manually in your
serverless environment.

```dart
// Create bot instance, and setup listeners
// ...

final json = jsonDecode(event.body);
final update = Update.fromJson(json);
bot.handleUpdate(update);
```

## 4. 🔄 Network Interceptor Support

Say goodbye to uncertainty with Televerse's `LoggerOptions`, allowing you to
customize network logging options to your heart's content.

```dart
final bot = Bot(
 "YOUR_BOT_TOKEN",
 loggerOptions: LoggerOptions(
   requestBody: true,
   requestHeader: true,
   responseBody: true,
   methods: [
     APIMethod.sendMessage,
     APIMethod.sendPhoto,
   ],
 ),
);
```

## 5. ⌨️ `Keyboard` and `InlineKeyboard` Utility Classes

Easily create Keyboard Reply Markup and Inline Keyboard Markup with Televerse's
intuitive utility classes. Easy as it sounds.

```dart
bot.command('keyboard', (ctx) async {
  final keyboard = Keyboard()
    .text("Account")
    .text("Referral")
    .row()
    .text("Settings")
    .resized();

  await ctx.reply(
    "Choose an option:",
    replyMarkup: keyboard,
  );
});
```

## 6. 🏠 Local Bot API Server Support

Host your own Bot API server and listen to updates effortlessly with Televerse.
Simply use the `Bot.local` constructor to configure your bot with a custom base
URL.


## 7. 🛠️ Custom Listener Methods

Wait a second, did we miss your use case? Create your own listener methods with
ease using `Bot.filter`.

```dart
bot.filter((ctx) {
  return (ctx.message.photo?.last.fileSize ?? 0) > 1000000;
}, (ctx) async {
  ctx.reply('Wow, that\'s a big photo!');
});
```

## 8. 🚀 Latest Telegram Bot API Support

Stay up-to-date with the latest version of the Telegram Bot API, supported by
Televerse. That's a promise.

## 9. 🛡️ Error Handling

Handle errors gracefully with `Bot.onError`, catching almost all uncaught errors
from any handlers.

```dart
import 'dart:developer';

// ...

bot.onError((err) {
  log(
    "Something went wrong: $err",
    error: err.error,
    stackTrace: err.stackTrace,
  );
});
```

## 10. 💬 Conversation API

Engage users in one-on-one conversations with the Conversation API, waiting for
their messages seamlessly.

```dart
// Create your bot instance
final bot = Bot(
  "YOUR_BOT_TOKEN",
);

// Create the Conversation API instance
final conv = Conversation(bot);

bot.command('start', (ctx) async {
  await ctx.reply("Hello, I am ${ctx.me.firstName}. What should I call you?");

  // Now wait you can wait for the user's reply message. Easy, right?
  final nameCtx = await conv.waitForTextMessage(chatId: ctx.id);
  await nameCtx?.reply("Good to meet you, ${ctx.message?.text}");
});
```

## 11. 📲 `InlineMenu` and `KeyboardMenu` Utility Classes

Effortlessly build Inline Reply Markup and Keyboard Reply Markup with
Televerse's utility classes, bound with handler methods for button taps.

```dart
// Define handler methods
Future<void> accountHandler(Context ctx) async {
  await ctx.replyWithPhoto(InputFile.fromFile(File("hello.png")));
  await ctx.reply("Here's your account details...");
}

// Define menu options
final menu = KeyboardMenu()
  .text("Account", accountHandler)
  .text("Referral", referralHandler)
  .text("Settings", settingsHandler)
  .resized();

// Attach menu to bot
bot.attachMenu(menu);

// Start bot
bot.command('start', (ctx) async {
  await ctx.reply(
    "Hello, I am ${ctx.me.firstName}. Let's start.",
    replyMarkup: menu,
  );
});
```

## 12. 🔍 Inline Query Result Builder

Efficiently build inline query results with the InlineQueryResultBuilder,
simplifying the process of generating inline query results.

## 13. 🔌 Plugin Support

Televerse support Middlewares and Transformers in the library. These features
allow you to preprocess and manipulate API requests seamlessly.

### Middlewares

Middlewares let you execute code before your main handler is run. This is useful
for tasks like logging, authentication, and more.

### Example: Logging Middleware

```dart
class LoggingMiddleware implements Middleware {
  @override
  Future<void> handle(
    Context ctx,
    NextFunction next,
  ) async {
    print('Received update: ${ctx.update}');
    await next();
  }
}

// Usage
bot.use(LoggingMiddleware());
```

### Transformers

Transformers allow you to alter the request payloads directly, providing a more
flexible way to modify requests before they are sent to the API.

### Example: Auto Replier Transformer

```dart
class AutoReplyEnforcer implements Transformer {
  @override
  Future<Map<String, dynamic>> transform(
    APICaller call,
    APIMethod method,
    Payload payload,
  ) async {
    final isSendMethod = APIMethod.sendMethods.contains(method);
    final isNotChatAction = method != APIMethod.sendChatAction;

    if (isSendMethod && isNotChatAction) {
      payload.params["reply_markup"] = ForceReply().toJson();
    }

    return await call(method, payload);
  }
}

// Usage
bot.use(AutoReplyEnforcer());
```
