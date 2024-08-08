# Guide to Building a Custom Transformer Plugin

Transformers in the context of API requests allow developers to modify the payload of an API request before it is sent to the server. This enables you to add additional parameters, tweak existing ones, or even perform other transformations as needed. This guide will walk you through the steps of creating your own transformer plugin, allowing you to customize how API calls are handled within your application.

## What is a Transformer?

A transformer is a class that implements the `Transformer` interface. It processes the payload of an API request and can modify it before passing the request along to the server. This allows for pre-processing of API requests, ensuring that all necessary parameters are included or adjusted as needed.

### Example Overview

Below is a brief example of what a simple transformer might look like. This transformer adds a `ForceReply` markup to all outgoing messages, except for the `sendChatAction` method.

```dart
class AutoReplyEnforcer implements Transformer {
  @override
  FutureOr<Map<String, dynamic>> transform(
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
```

### Key Components

- **APICaller (`call`)**: A function that is used to make the actual API call. You pass the modified payload to this function.
- **APIMethod (`method`)**: The specific API method that is being called (e.g., `sendMessage`, `sendPhoto`).
- **Payload (`payload`)**: The data being sent to the server, typically in the form of key-value pairs that represent the parameters of the API request.

## Step-by-Step Guide to Building a Transformer

### 1. Create a New Transformer Class

To create a custom transformer, start by implementing the `Transformer` interface in a new class. This class will need to override the `transform` method, which is where the payload modification logic will reside.

```dart
class CustomTransformer implements Transformer {
  @override
  Future<Map<String, dynamic>> transform(
    APICaller call,
    APIMethod method,
    Payload payload,
  ) async {
    // Custom transformation logic goes here
  }
}
```

### 2. Implement the Transformation Logic

In the `transform` method, you will define how the payload should be modified. This could involve adding new parameters, modifying existing ones, or even conditionally altering the payload based on the API method being called.

For example, if you want to ensure that every message sent includes a specific parameter, you can add that logic here:

```dart
class CustomTransformer implements Transformer {
  @override
  Future<Map<String, dynamic>> transform(
    APICaller call,
    APIMethod method,
    Payload payload,
  ) async {
    // Check if the method is a "send" method
    if (APIMethod.sendMethods.contains(method)) {
      // Add a custom parameter to the payload
      payload.params['custom_param'] = 'CustomValue';
    }

    // Continue with the API call using the modified payload
    return await call(method, payload);
  }
}
```

### 3. Handle Special Cases

Sometimes, you might want to exclude certain API methods from being modified or handle them differently. For instance, the `sendChatAction` method might not require the same modifications as other methods:

```dart
class CustomTransformer implements Transformer {
  @override
  Future<Map<String, dynamic>> transform(
    APICaller call,
    APIMethod method,
    Payload payload,
  ) async {
    final isSendMethod = APIMethod.sendMethods.contains(method);
    final isNotChatAction = method != APIMethod.sendChatAction;

    if (isSendMethod && isNotChatAction) {
      payload['custom_param'] = 'CustomValue';
    }

    return await call(method, payload);
  }
}
```

::: info
Make sure that the parameter you modify exist on the Telegram Bot API, otherwise, it won't change anything - or at the worst case the request might fail.
:::


### 4. Returning the Transformed Payload

After modifying the payload, you should pass it to the `call` function along with the API method. This ensures that the API request is made with your customized payload.

```dart
class CustomTransformer implements Transformer {
  @override
  Future<Map<String, dynamic>> transform(
    APICaller call,
    APIMethod method,
    Payload payload,
  ) async {
    // Your custom transformation logic

    return await call(method, payload); // Pass the modified payload to the API
  }
}
```

### 5. Testing Your Transformer

After implementing your custom transformer, test it by integrating it into your application's middleware stack. Ensure that it correctly modifies the payload for the API methods you intended.

```dart
void main() {
  final bot = Bot('YOUR_BOT_TOKEN');
  
  bot.use(CustomTransformer());
  
  bot.start();
}
```

This example adds your `CustomTransformer` to the bot’s middleware stack, ensuring that every API call made by the bot is processed by your transformer before being sent to the server.

## Conclusion

By following this guide, you should be able to create a custom transformer that modifies API requests to suit your application's specific needs. Transformers offer a powerful way to handle complex request preprocessing, making your bot or application more flexible and robust. Experiment with different transformation logic to see how you can leverage this feature to its fullest potential.

::: tip
If you've already built a Transformer, why won't you let us know? Join our Telegram group and share the news. We'll be happy to check it out, as well as list it on the website if you'd like to.
:::