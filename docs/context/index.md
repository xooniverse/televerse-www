# Understanding the `Context` in Televerse

## Overview

In Televerse, the `Context` class plays a crucial role in handling updates received from the Telegram Bot API. Every time an update is received, it is wrapped in a `Context` object, which makes it easier for you to interact with the update and its various components. The `Context` class serves as an abstraction layer that exposes the necessary details of an update, allowing you to access important information such as the chat, message, user, and more with minimal effort.

## Importance of the `Context` class

The `Context` class simplifies the process of handling updates by bundling together the update itself and other useful metadata such as the bot's information and the API instance. This allows you to write cleaner, more efficient code when processing updates, as they can focus on the logic of their bot rather than the intricacies of the Telegram Bot API.

The `Context` class is particularly powerful because:

1. **Encapsulation of Update Details:** It encapsulates the incoming update and provides easy access to its components like the message, chat, user, etc.

2. **Context-Aware Methods:** It offers context-aware methods that abstract away the need to repeatedly pass parameters like chat IDs when performing common operations such as sending messages or responding to updates.

3. **Middleware and Transformers:** The `Context` class can be used in conjunction with middleware and transformers to preprocess updates and apply custom transformations to the payload before it's sent to the Telegram API.

## Components of the `Context` class

Here's a breakdown of the key components and properties of the `Context` class:

Here's a table summarizing the key properties of the `Context` class:

| **Property**        | **Type**            | **Description** |
| --- | --- | --- |
| **`api`**        | `RawAPI`               | Provides access to the Telegram Bot API methods, allowing actions like sending messages, editing messages, and more. |
| **`me`**         | `User`                 | Holds information about the bot itself, such as its ID and username. |
| **`update`**     | `Update`               | The update object that triggered the current context. This is sent by the Telegram Bot API, such as messages, callback queries, inline queries, etc. |
| **`id`**         | `ChatID`               | Represents the ID of the chat from which the update was sent. Throws an exception if the update does not belong to a chat. |
| **`maybeId`**    | `ChatID?`              | A nullable version of the `id` property that returns `null` if the update does not have a chat associated with it. |
| **`matches`**    | `List<RegExpMatch>?`   | Contains the matches of the regular expression when the `Bot.hears` method is used. |
| **`args`**       | `List<String>`         | If the incoming message is a command, this property contains the command arguments. For example, `/hello @mom @dad` results in `ctx.args` being `['@mom', '@dad']`. |
| **`fileId`**     | `String?`              | Returns the File ID if the incoming message contains a file of any kind, such as a photo, video, document, or sticker. |
| **`messageId`**  | `int?`                 | Returns the message ID of the incoming message, useful for message-related operations like editing or deleting a message. |
| **`inlineMessageId`** | `String?`         | Returns the Inline Message ID from the incoming update, useful for operations involving inline messages.|

## Context-Aware Methods

In addition to the properties exposed by the `Context` class, Televerse provides extensions on the `Context` class that make interacting with the Telegram API even more straightforward.

### Example: `Context.reply`
One of the most commonly used context-aware methods is `Context.reply`, which allows you to respond to a message without manually specifying the chat ID. Here's a simple example:

```dart
ctx.reply("Hello, world!");
```

In this example, `Context.reply` automatically determines the chat ID from the incoming update and sends the message "Hello, world!" to that chat.

### Other Context-Aware Methods
Televerse also provides context-aware aliases for many other `RawAPI` methods, such as `Context.forwardMessage`, `Context.editMessageText`, and more. These methods take advantage of the information available in the `Context` object to reduce boilerplate code and improve developer productivity.

## Context and Update Properties

To further simplify access to the data contained in the update, Televerse includes an extension called `ContextUpdateMerger` that merges all properties of the `Update` class into the `Context` object. This means that you can directly access properties like `message`, `editedMessage`, `callbackQuery`, etc., from the `Context` object itself.

### Example: Accessing the Incoming Message

```dart
final message = ctx.message;
if (message != null) {
  print("Received a message: ${message.text}");
}
```

In this example, you can directly access the incoming message from the context without having to go through the `update` object.

## Handlers and the Context

All listener methods you know and love involves a parameter called `Handler`. This is where your incoming update is processed. Handlers in Televerse are context-centric, meaning that every handler receives a `Context` object as its parameter. This design allows handlers to easily process the incoming update and respond accordingly.

### Handler Definition

::: info
Just a peek into the actual code under-the-hood. This is how we defined the `Handler` type. In other words, `Handler` is a Function that process a `Context`.
:::


```dart
typedef Handler<CTX extends Context> = FutureOr<void> Function(
  CTX ctx,
);
```

## Custom Context
That's right, you can create your own custom context and integrate it with your bot. This gives you complete control over the Context class, allowing you to define your own methods and properties to increase flexibility and tailor the context to your specific needs.

::: tip
We have an entire section covering how to create and use custom context. [Check it out here.](./custom-context)
:::

## Conclusion

The `Context` class is a central component of Televerse, designed to make it easier for developers to handle updates and interact with the Telegram Bot API. By encapsulating the details of the incoming update and providing context-aware methods, the `Context` class streamlines bot development, allowing you to focus on building features rather than dealing with API intricacies.

Understanding and effectively using the `Context` class will significantly boost your productivity and help you create more robust and maintainable Telegram bots.