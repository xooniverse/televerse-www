# The `Bot` Class

The `Bot` class is the primary class of the Televerse framework. It is the central point of interaction for managing your Telegram bot. This class provides a wide range of methods to handle incoming updates, interact with the Telegram Bot API, and manage the bot's behavior.

## Listener Methods

The `Bot` class offers several methods to listen to different types of updates from Telegram:

- **`Bot.command`**: Listens for specific commands and sets up a handler for them. 
- **`Bot.onText`**: Handles incoming text messages by setting up a handler.
- **`Bot.callbackQuery`**: Sets up a handler for incoming callback query updates.
- **`Bot.inlineQuery`**: Sets up a handler for incoming inline query updates.

::: tip
Check out [features/listeners](/docs/features.html#_2-🎧-extensive-listener-methods) for more listenrers on the Bot class.
:::

All these listener methods accepts a `Handler<CTX>`parameter which is a callback function that processes the incoming update. Let's say you're setting up handler for the `/start` command. It would be something like:

```dart
bot.command("start", (ctx) async {
    await ctx.reply("Hey there!");
});
```

Or lets say if you're listening for a particular text message such as: "Settings" as sent by a Keyboard Markup button press. We can listen to just that by:

```dart
bot.text("Settings", (ctx) async {
    await ctx.reply("Roger, here's the current settings. ⚙️");
    /// ...
});
```

## Powerful Features

In addition to the standard update handlers, the `Bot` class includes some powerful methods:

- **`Bot.filter`**: Allows you to register a callback function that is triggered based on custom conditions you define. This method provides a flexible way to create custom filters and respond to specific situations.

- **`Bot.use`**: Enables you to attach plugins to the `Bot` instance. Plugins can be used to process and handle incoming updates or outgoing network requests. For more details on how to use plugins, refer to the plugin section.

## Initialization

To initialize the bot, you typically call:
```dart
await bot.start();
```

This method starts the bot and sets the `me` property. 

However, if you need to initialize the bot manually before starting it, you can use:

```dart
await bot.init();
```

This will also set the `me` property, allowing you to access the bot's information immediately. You can also make sure if the Bot is initialized with the `Bot.initialized` getter.


## Bot API Access

The `Bot` class exposes the `api` property, which gives you access to the `RawAPI` instance associated with the bot. Through this instance, you can call any Telegram Bot API method directly, providing you with full control over your bot's functionality.

That is you'll be able to call the `sendMessage` method as follows:

```dart
await bot.api.sendMessage(...);
```

Well, not only the `sendMessage`, but any other Bot API method. Make sure to check out the different methods you can use at the [Bot API Docs](https://core.telegram.org/bots/api#available-methods).

The `Bot` class also exposes the `me` property, which contains information about the bot itself, such as its username and ID. This property is automatically set when the bot is initialized.

Being said that, you can do this:

```dart
await bot.init();
print("Hello, I'm ${bot.me.firstName} 👋");
```

## Bot Constructors

The `Bot` class provides three constructor methods to create an instance:

### **Primary Constructor (`Bot`)**: 
The primary constructor is the most commonly used method for creating a `Bot` instance. It requires a `String token` parameter, which is the bot's API token provided by BotFather.

```dart
Bot(
  String token, {
  Fetcher<CTX>? fetcher,
  String baseURL = RawAPI.defaultBase,
  APIScheme scheme = APIScheme.https,
  LoggerOptions? loggerOptions,
  Duration? timeout,
});
```

- **`fetcher`**: Specifies the method to fetch updates, either via `LongPolling` (default) or `Webhook`. If no fetcher is provided, `LongPolling` is used by default.
- **`baseURL`**: Allows you to set a custom base URL for fetching updates, such as when using a local bot API server.
- **`loggerOptions`**: Configures logging options for your bot, allowing you to log requests and responses for debugging purposes.
- **`timeout`**: Sets a timeout duration for network requests.

### **`Bot.fromAPI` Constructor**:
This constructor creates a `Bot` instance from an existing `RawAPI` instance. It is useful when your bot is primarily centered around the `RawAPI`, and you want to expose the `RawAPI` instance in the public scope.

```dart
Bot.fromAPI(RawAPI api, {Fetcher<CTX>? fetcher})
```

### **`Bot.local` Constructor**:
The `local` constructor is designed for creating a bot that listens to updates from a local bot API server, typically served at "localhost:8081" using the HTTP scheme.

```dart
Bot.local(
  String token, {
  Fetcher<CTX>? fetcher, 
  String baseURL = "localhost:8081", 
  APIScheme scheme = APIScheme.http, 
  LoggerOptions? loggerOptions, 
  Duration? timeout
});
```

## Logger Options

The `LoggerOptions` class allows you to configure detailed logging for your bot's interactions with the Telegram Bot API. This includes logging request bodies, headers, response bodies, and specific methods you want to monitor.

Here’s an example of how to configure `LoggerOptions`:

```dart {3-12}
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
    logPrint: print,
  ),
);
```

- **`requestBody`**: Logs the body of outgoing requests.
- **`requestHeader`**: Logs the headers of outgoing requests.
- **`responseBody`**: Logs the body of incoming responses.
- **`methods`**: Specifies which API methods to log.
- **`logPrint`**: Defines the function used to output log messages, such as `print`.

This detailed logging is invaluable for debugging and monitoring your bot's interactions with the Telegram Bot API.