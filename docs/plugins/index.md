
# Televerse Plugins

Televerse plugins extend the capabilities of your Telegram bots, allowing you to add custom functionalities and enhance your bot's behavior. We support two types of plugins:

1. **Middlewares**
2. **Transformers**

These plugins can be used to inject custom logic before or during API calls, making your bot more powerful and flexible.

## ✨ Middlewares

Middlewares allow you to execute code before your main handler is run. This is useful for tasks like logging, authentication, and more. By using middlewares, you can enhance the functionality of your bot without modifying the core logic of your handlers.

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

In this example, the `LoggingMiddleware` logs each incoming update before passing it on to the next middleware or the main handler.


## ⚙️ Transformers

Transformers allow you to alter the request payloads directly, providing a more flexible way to modify requests before they are sent to the Telegram API. This makes transformers a powerful tool for fundamentally changing the behavior of your bot’s API interactions.

### Example: Auto Replier Transformer

```dart
class AutoReplyEnforcer implements Transformer {
  @override
  Future<Map<String, dynamic>> transform(
    APICaller call,
    APIMethod method, [
    Payload? payload,
  ]) async {
    final isSendMethod = APIMethod.sendMethods.contains(method);
    final isNotChatAction = method != APIMethod.sendChatAction;

    if (isSendMethod && isNotChatAction) {
      payload!.params["reply_markup"] = ForceReply().toJson();
    }

    return await call(method, payload);
  }
}

// Usage
bot.use(AutoReplyEnforcer());
```

In this example, the `AutoReplyEnforcer` transformer automatically adds a `ForceReply` markup to any send method, ensuring that the bot expects a response from the user.

## 🛸 Official Plugins

We currently have three plugins that are built and published on [pub.dev](https://pub.dev). These plugins are:

Certainly! Here's the information presented in a table format:
| Plugin Name          | Description |
|----------------------|-------------|
| **auto_retry**       | The `auto_retry` plugin helps your bot handle failed API requests more gracefully. It's common for API calls like `sendMessage` or `sendPhoto` to fail due to issues like rate limits. When this happens, Telegram often returns a `retry_after` value, indicating when you can retry the request. The `auto_retry` plugin automatically catches these errors and retries the request after the specified interval, ensuring a smoother user experience. |
| **auto_chat_action** | The `auto_chat_action` plugin automatically sends chat actions like "typing..." or "uploading photo..." whenever you call related methods like `sendMessage` or `sendPhoto`. This small addition can significantly improve the user experience by letting them know that the bot is processing their request. |
| **parse_mode_setter**| The `parse_mode_setter` plugin simplifies the process of setting the `parse_mode` for your bot's messages. Instead of manually adding the `parse_mode` property to each method, this plugin automatically sets the specified `parse_mode` for all applicable methods, saving you time and reducing boilerplate code. |


This table concisely presents the details about each plugin in a structured and easy-to-read format.

## 🧑🏻‍💻 Creating Your Own Plugins

Creating your own plugins in Televerse is straightforward. Whether you need a middleware to pre-process updates or a transformer to modify API calls, Televerse provides the flexibility to customize your bot to suit your needs.

### Steps to Create a Middleware

1. **Implement the Middleware interface**: Your class should implement the `Middleware` interface.
2. **Override the handle method**: This method takes the `Context` and `NextFunction` as parameters. Add your custom logic here.

### Steps to Create a Transformer

1. **Implement the Transformer interface**: Your class should implement the `Transformer` interface.
2. **Override the transform method**: This method takes the `APICaller`, `APIMethod`, and `Payload` as parameters. Use this method to modify the API request or response.

### 📖 Guide

We've an immersive guide to build yourself up a plugin tailored to your needs. Whether you're interested in creating a Middleware to execute code before your main handler runs, or a Transformer to modify API requests, you'll find step-by-step instructions and examples in our documentation. Check out the dedicated pages for [Middlewares](/plugins/build-middleware) and [Transformers](/plugins/build-transformer) to get started.

## Contributing

We encourage you to create and share your plugins with the community. If you’ve built something awesome, feel free to contribute it to the official Televerse plugins repository or publish it on [pub.dev](https://pub.dev) for others to use.

Happy coding!
