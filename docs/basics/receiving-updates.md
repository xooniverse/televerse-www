# The Two Methods of Receiving Updates from Telegram Bot API: The Fetchers

Let's take a closer look at the two mutually exclusive methods for receiving updates from the Telegram Bot API: **getUpdates** and **webhooks**. Both are robust, each with its own strengths, and Televerse supports both right out of the box.

You might have noticed that `fetcher` argument in the `Bot` constructor and wondered what it’s all about. Well, that’s where the magic happens—this parameter dictates how your bot will receive updates from the Telegram Bot API. Here’s how they work:

## Long Polling

First up is `LongPolling`, the default method for receiving updates or we should say the most loved method (for those who like to keep things simple). When you call `bot.start()`, Televerse initiates an infinite loop that continually calls the `RawAPI.getUpdates` method. After each request, the bot pauses briefly before making the next one, ensuring it doesn’t overwhelm the Telegram API with too many requests (because nobody wants to deal with those 429 errors). The updates received are added to the bot’s `updatesStream`, triggering the appropriate handlers to process them.

### Constructor:
```dart
LongPolling({
  int offset = 0, 
  int timeout = 30, 
  int limit = 100, 
  List<UpdateType>? allowedUpdates, 
  Duration delayDuration = const Duration(milliseconds: 200)
})
```
- **offset**, **timeout**, **limit**, and **allowedUpdates** are passed directly into the `getUpdate` request.
- **delayDuration** sets the interval between the end of one request and the start of the next.

There are two related constructors that give you additional control:

### `LongPolling.allUpdates`
This constructor creates a `LongPolling` instance that requests every type of update, including those that aren’t sent by default (like `chat_member` or `message_reaction` updates). Telegram Bot API requires them to be explicitly specified in the allowed updates.
```dart
LongPolling.allUpdates({
    int offset = 0, 
    int timeout = 30, 
    int limit = 100, 
    Duration delayDuration = const Duration(milliseconds: 200)
})
```

### LongPolling.allExcept
If there are specific update types you want to exclude, this constructor lets you specify them. All other updates will be included.
```dart
LongPolling.allExcept(
    List<UpdateType> types, {
    int offset = 0, 
    int timeout = 30, 
    int limit = 100, 
    Duration delayDuration = const Duration(milliseconds: 200)
})
```

## Webhooks

If you prefer real-time interaction, **Webhooks** might be more your style. With webhooks, your code acts as a server endpoint. Whenever something happens, like a user sending a message to your bot, Telegram sends a POST request with a JSON-serialized `Update` to your specified URL.

The `Webhook` class in Televerse is designed to handle these requests, manage the lifecycle of the webhook, and ensure your bot stays up-to-date with all the latest activity.

### Constructor:
```dart
Webhook(
  HttpServer server, {
  String? url, 
  String? ipAddress, 
  String path = '/', 
  int port = 443, 
  int maxConnections = 40, 
  List<UpdateType>? allowedUpdates, 
  bool? dropPendingUpdates, 
  InputFile? certificate, 
  String? secretToken, 
  bool shouldSetWebhook = false
})
```
Here’s a breakdown of the parameters:

| **Parameter**        | **Description**                                                                 |
|----------------------|---------------------------------------------------------------------------------|
| `server`             | The HTTP server instance. (required)                                            |
| `url`                | The webhook URL. (required)                                                     |
| `ipAddress`          | The IP address of the webhook.                                                  |
| `path`               | The secret path for the webhook.                                                |
| `port`               | The port on which the webhook is running (default is 443).                      |
| `maxConnections`     | Maximum number of simultaneous HTTPS connections for update delivery.           |
| `allowedUpdates`     | List of the types of updates you want your bot to receive.                      |
| `dropPendingUpdates` | Flag to drop all pending updates.                                               |
| `certificate`        | Public key certificate for the webhook.                                         |
| `secretToken`        | Secret token for additional security.                                           |
| `shouldSetWebhook`   | If `true`, automatically sets the webhook using the `setWebhook` method.        |

### Example

Well lets take an example with Webhook!

```dart
// Bind the server to an available port
final server = await HttpServer.bind(InternetAddress.anyIPv6, 8080);

// Create a webhook fetcher instance
final webhook = Webhook(
  server,
  url: "https://mydomain.com",
);

// Now pass the webhook instance to the `fetcher` parameter.
final bot = Bot(
  "<BOT_TOKEN>",
  fetcher: webhook,
);

// Start the bot
bot.start();
```

::: tip
If you set `shouldSetWebhook` to `true`, Televerse will automatically set up the webhook for you - by calling the `setWebhook` method implicitly. It’s a simple, hassle-free way to get things running smoothly.
:::

And there you have it—the two primary methods for receiving updates via Televerse. Whether you prefer the steady reliability of LongPolling or the immediacy of Webhooks, Televerse has the tools you need to keep your bot connected and responsive.