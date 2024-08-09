# The `RawAPI` Class
The `RawAPI` class is your gateway to the entire range of methods offered by the Telegram Bot API. Whether you need to send messages, photos, videos, animations, audio, documents, or any other type of interaction, the `RawAPI` class gives you direct access to these capabilities.

## Key Features

### Complete Access

The `RawAPI` class provides direct access to all methods of the Telegram Bot API. This includes methods like `sendMessage`, `sendPhoto`, `sendVideo`, `sendAnimation`, `sendAudio`, `sendDocument`, and many more. Essentially, if it's available in the Telegram Bot API, you can do it with `RawAPI`.

### Standalone Use

There are scenarios where you might not need the full `Bot` class, but rather just the raw power of the Telegram API. For example, if you're building a Flutter app as an admin panel for your Telegram bot, and you want to broadcast a message to all users, you don’t need to create a `Bot` instance at all. Instead, you can simply instantiate the `RawAPI` class with your bot token and directly invoke methods like `sendMessage` or `sendPhoto` to handle your broadcast logic.

An example worth more than a million lines of explanation, right?

```dart
// Initialize RawAPI with your bot token
final api = RawAPI("YOUR_BOT_TOKEN");

// Loop through your users and send a broadcast message
for (var user in users) {
    await api.sendMessage(
        ChatID(user.id), 
        "Hello World!",
    );
}
```

### Always Updated
The `RawAPI` class is consistently maintained to reflect the latest changes and additions to the Telegram Bot API, ensuring that you always have access to the newest features and methods. We keep this as a promise.

## API Reference

For a full list of available methods and their detailed documentation, please visit the [API Reference](https://pub.dev/documentation/televerse/latest/televerse/RawAPI-class.html).
