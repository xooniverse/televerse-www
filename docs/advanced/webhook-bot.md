# Revolutionize Your Telegram Bot with Webhooks and Shelf Integration  

Telegram bots have changed the way we interact with services, offering automation and dynamic responses. When building a Telegram bot, **fetching updates** is the backbone of its operation. There are two approaches to fetching updates: **`LongPolling`** and **`Webhook`**. With **Televerse** you get support for both methods right out of the box. However, with the advent of `TeleverseShelfWebhook`, you can now push the boundaries of what your bot's server can do. 

This guide dives deep into how **`Webhooks` work**, why they’re better than `LongPolling`, and how `TeleverseShelfWebhook` empowers your server to handle multiple routes alongside your bot’s webhook.

## **Understanding `LongPolling` vs `Webhook`**  

### **LongPolling**
This is the traditional way of fetching updates:
- Your bot repeatedly sends requests to Telegram’s `getUpdates` endpoint in an infinite loop.
- This is like constantly knocking on a door, asking, "Got any updates?" : )
- This method involves polling the server frequently, creating overhead and potential delays.

### **Webhook**
Webhooks work the other way around:
- Instead of asking Telegram for updates, you leave a **server endpoint** open for Telegram to deliver updates directly. 
- Each incoming update is processed as soon as it arrives, enabling **concurrent processing**.  

This is why webhooks are considered faster and more efficient than `LongPolling`. They’re especially useful when handling high traffic or when latency matters.  

## **How Webhooks Work in Televerse**  

In Televerse, setting up a webhook involves just a few lines of code. In fact, we have already discussed it in the [Receiving Updates](/basics/receiving-updates.md) post with example. The library internally starts the `HttpServer` that you've provided and listens for incoming requests from Telegram. Whenever an update arrives, Televerse parses it, validates it (using a secret token if provided), and streams it to your bot’s listeners.  

Here’s a quick example of starting a webhook-enabled bot:  

```dart
import 'package:televerse/televerse.dart';

void main() async {
  final server = await HttpServer.bind(InternetAddress.anyIPv4, 8080);

  // Create a webhook fetcher instance
  final webhook = Webhook(
    server,
    url: "https://mydomain.com",
  );

  // Now pass the webhook instance to the `fetcher` parameter.
  final bot = Bot("YOUR_BOT_TOKEN", fetcher: webhook);

  // Start the bot (implicit webhook server starts here)
  await bot.start();
}
```

This works great! But here's where things get interesting! The default webhook implementation has a significant limitation: the HTTP server is locked down, offering minimal external configuration. You're essentially restricted to a single-purpose endpoint solely dedicated to Telegram bot updates. 

But let's be real - who wants such a constrained setup? 

Modern web applications demand flexibility. Imagine you're building a bot that's not just a messaging tool, but a comprehensive system. You might want to:
- Serve an admin management API
- Monitor server health
- Provide additional endpoints for various microservices

Why limit yourself to just bot updates when your server can do so much more? Enter the solution that breaks these constraints and unleashes your server's true potential. That’s where **TeleverseShelfWebhook** shines.

## **Enter `TeleverseShelfWebhook`: The Game-Changer**

While the default webhook server in Televerse is sufficient for many use cases, it has limitations:
- The server is locked solely for bot updates.
- You can’t add extra routes to serve additional APIs or admin functionalities.

With `TeleverseShelfWebhook`, you integrate Telegram updates into a **`shelf`** server, allowing you to dedicate specific routes for bot updates while utilizing other routes for different purposes.

---

### **How `TeleverseShelfWebhook` Works**

1. **Fetcher Integration:**  
   `TeleverseShelfWebhook` acts as a fetcher for the `Bot` class. You simply attach it while initializing your bot.

2. **Route Dedication:**  
   Using the `createHandler` method, you assign a specific route (e.g., `/webhook`) for Telegram updates.

3. **Full Shelf Power:**  
   The rest of the server is yours to configure for additional endpoints like `/api`, `/health`, or anything else.

---

### **Setting Up a Multi-Purpose Server with `TeleverseShelfWebhook`**

Here’s a step-by-step example:  

#### 1. Import Required Packages  
```dart
import 'dart:io';

import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart';
import 'package:shelf_router/shelf_router.dart';
import 'package:televerse/televerse.dart';
import 'package:televerse_shelf/televerse_shelf.dart';
```

#### 2. Create the Fetcher and Bot  
```dart
// Get your token from @BotFather
final token = Platform.environment["BOT_TOKEN"]!;

// Initialize the TeleverseShelfWebhook fetcher
final fetcher = TeleverseShelfWebhook();

// Create the bot and attach the fetcher
final bot = Bot(token, fetcher: fetcher);

// Add a basic command
bot.command('start', (ctx) async {
  await ctx.reply("Hello from Shelf-powered Webhook!");
});
```

#### 3. Configure Your Routes  
```dart {5}
// Create a router for handling requests
final router = Router();

// Assign /webhook for Telegram updates
router.post('/webhook', fetcher.createHandler());

// Add other routes
router.get('/api', (req) => Response.ok("Hello from API!"));
router.get('/health', (req) => Response.ok('{"status":"OK"}'));
```

See, it's simple as it looks. The `fetcher.createHandler()` returns a handler method which parses the incoming update and passes it to the update stream.

#### 4. Setup Middleware and Start the Server  

Rest is your everyday chores with `shelf`. Create the Pipeline add middlewares if you may, attach the handler - and fire away! Also, make sure that you call `bot.start()` to start listening to the bot updates.

```dart
// Add middlewares and attach the router
final pipeline = Pipeline()
    .addMiddleware(logRequests())
    .addHandler(router.call);

// Start the server
final server = await serve(pipeline, 'localhost', 8080);
print('Server running on port ${server.port}');

// Start the bot
await bot.start();
```

---

## **Putting It All Together**  

With the code above, you now have a server that:  
- Handles Telegram updates via `/webhook`.
- Serves additional functionalities on `/api` or any other custom route.
- Benefits from shelf's flexibility for middleware, logging, or custom responses.

---

### **Why Use TeleverseShelfWebhook?**
- **Flexibility:** Your bot’s server isn’t just limited to handling Telegram updates.  
- **Scalability:** Add more routes as your project grows.  
- **Ease of Use:** The `createHandler` method makes integration seamless.  

## **Wrapping Up**

By integrating `TeleverseShelfWebhook` into your bot’s architecture, you unlock endless possibilities for creating multi-purpose servers. Whether you're adding admin panels, health checks, or additional APIs, this setup keeps your server organized and efficient.  

Ready to elevate your Telegram bot game? Give `TeleverseShelfWebhook` a spin and take full control of your bot's backend today!

## Things before checking out

1. [package:televerse_shelf](https://pub.dev/packages/televerse_shelf)
2. [package:shelf](https://pub.dev/packages/shelf)
3. [package:shelf_router](https://pub.dev/packages/shelf_router)
4. Read about [Receiving updates](/basics/receiving-updates.md)