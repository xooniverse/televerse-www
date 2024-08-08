# Creating a Custom Middleware for Your Telegram Bot

Middleware plays a crucial role in building complex, maintainable, and efficient bots. By leveraging middleware, you can intercept and process incoming requests before they reach the main handler. This allows you to perform tasks like logging, authentication, rate limiting, and more, creating a robust and scalable bot architecture.

In this guide, we’ll dive deep into what middleware is, how it works, and how you can create your own custom middleware to enhance the functionality of your bot.

## What is Middleware?

Middleware is a function or set of functions that process requests in sequence before they reach the main handler. Each middleware function has access to the `Context` object, which contains information about the current request, and a `NextFunction`, which controls whether the next middleware or main handler should be executed.

### Key Concepts

- **Context**: The `Context` object (`CTX` in our generic interface) represents the current inocming request. It contains data such as the update received from Telegram, the bot instance, and any other information that might be relevant to the processing of the request.

- **NextFunction**: The `NextFunction` is a callback that, when called, passes control to the next middleware in the stack. If it's not called, the subsequent middleware and the main handler will not be executed.

### Why Middleware is Important

Middleware allows you to modularize your bot’s functionality. Instead of handling all the logic in one place, you can break down your logic into small, reusable components that can be applied selectively to different parts of your bot.

Some common use cases for middleware include:

- **Logging**: Track incoming requests and responses for debugging or audit purposes.
- **Authentication**: Verify that a user is authorized to perform a certain action.
- **Rate Limiting**: Limit the number of requests a user can make in a given period.
- **Data Validation**: Ensure that incoming requests contain valid data before they are processed.

## Structure of Middleware

A middleware in the `Televerse` framework implements the `Middleware` interface. The interface defines a single method, `handle`, which takes in a `Context` and a `NextFunction` as arguments. The `handle` method is where the logic for your middleware resides.


::: info
This is just technical info, just letting you know what's under the hoods. You can skip this part entirely. After all it's 90% doc comments.
:::

Here’s what the `Middleware` interface looks like:

```dart
/// Represents a Middleware that can be used to process requests
/// before they reach the main handler.
///
/// This class should be implemented by any middleware that needs to perform
/// operations on the [Context] object or decide whether to pass control to
/// the next middleware or the main handler.
///
/// Example usage:
/// ```dart
/// class Logger implements Middleware {
///   @override
///   FutureOr<void> handle(Context ctx, NextFunction next) async {
///     print('Request received: ${ctx.update}');
///     await next(); // Pass control to the next middleware or handler
///     print('Response sent');
///   }
/// }
/// ```
///
/// By using the `Middleware` class, you can create reusable components that
/// can be attached to the bot and executed in sequence.
abstract interface class Middleware<CTX extends Context>
    implements MiddlewareBase {
  /// The middleware function that processes the [Context] and optionally
  /// passes control to the next middleware or main handler.
  ///
  /// The [handle] function should call the [next] function to pass control
  /// to the next middleware in the stack or to the main handler if there are
  /// no more middlewares. If [next] is not called, the subsequent middlewares
  /// and the main handler will not be executed.
  ///
  /// Example usage:
  /// ```dart
  /// @override
  /// FutureOr<void> handle(Context ctx, NextFunction next) async {
  ///   // Perform some pre-processing
  ///   print('Before main handler');
  ///
  ///   // Pass control to the next middleware or the main handler
  ///   await next();
  ///
  ///   // Perform some post-processing
  ///   print('After main handler');
  /// }
  /// ```
  FutureOr<void> handle(
    CTX ctx,
    NextFunction next,
  );

  /// Constructs a [Middleware] instance.
  const Middleware();
}
```

## Creating Your First Middleware

Let’s create a simple logging middleware that logs the details of every request received by your bot.

### Step 1: Define the Middleware

First, create a class that implements the `Middleware` interface:

```dart
import 'dart:async';
import 'package:televerse/televerse.dart';

class LoggingMiddleware implements Middleware {
  @override
  FutureOr<void> handle(Context ctx, NextFunction next) async {
    print('Request received: ${ctx.update}');
    await next(); // Pass control to the next middleware or handler
    print('Response sent');
  }
}
```

### Step 2: Attach the Middleware to Your Bot

Now that we have our `LoggingMiddleware`, we need to attach it to our bot. This is done using the `use` method of the bot instance.

```dart
import 'package:televerse/televerse.dart';

void main() {
  final bot = Bot('YOUR_BOT_TOKEN');

  // Attach the logging middleware
  bot.use(LoggingMiddleware());

  // Define your bot's command handlers, etc.
  bot.command('start', (ctx) {
    ctx.reply('Hello, World!');
  });

  // Start the bot
  bot.start();
}
```

### Step 3: Test Your Middleware

When you run your bot and send a message, you should see the following output in your console:

```
Request received: Update { ... }
Response sent
```

This indicates that the middleware intercepted the request, logged it, passed control to the main handler, and then logged the response.

## Advanced Middleware Techniques

Now that you’ve built your first middleware, you can explore more advanced use cases:

### 1. Conditional Middleware

You can create middleware that only runs under certain conditions. For example, you might only want to log requests from a specific user or only log requests that contain certain keywords.

```dart
class ConditionalLoggingMiddleware implements Middleware {
  final int userId;

  ConditionalLoggingMiddleware(this.userId);

  @override
  FutureOr<void> handle(Context ctx, NextFunction next) async {
    if (ctx.update.message?.from?.id == userId) {
      print('Request received from user $userId: ${ctx.update}');
    }
    await next();
  }
}
```

### 2. Blocking Middleware

Sometimes you may want to block a request from reaching the main handler. This can be done by simply not calling the `next` function.

```dart
class BlockSpamMiddleware implements Middleware {
  @override
  FutureOr<void> handle(Context ctx, NextFunction next) async {
    if (isSpam(ctx)) {
      print('Blocked spam from ${ctx.update.message?.from?.id}');
      return; // Do not call next, so the main handler is not executed
    }
    await next();
  }

  bool isSpam(Context ctx) {
    // Implement your spam detection logic here
    return false;
  }
}
```

### 3. Chaining Middleware

You can chain multiple middleware functions together to create complex request-processing pipelines. Each middleware can either pass control to the next middleware or block the request from reaching the main handler.

```dart
bot.use(LoggingMiddleware());
bot.use(AuthenticationMiddleware());
bot.use(RateLimitingMiddleware());
```

In this example, the request will pass through the `LoggingMiddleware`, `AuthenticationMiddleware`, and `RateLimitingMiddleware` in sequence before reaching the main handler.

## Conclusion

Middleware is a powerful tool that can help you build more modular, maintainable, and scalable bots. By understanding and implementing middleware, you can intercept and process requests in creative ways, ensuring that your bot performs exactly as you need it to.

Start experimenting with custom middleware in your bot today, and unlock new possibilities in bot development!

::: tip
If you've already built a Middleware, why won't you let us know? Join our Telegram group and share the news. We'll be happy to check it out, as well as list it on the website if you'd like to.
:::