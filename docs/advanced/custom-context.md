# Using Custom Context with Your Bot

## Introduction

So we're here. We know that you've built bots, we know that you've used Context.
All those Context aware methods such as `Context.reply`,
`Context.answerCallbackQuery`, etc., made your life so easy, right? On the way,
have you ever wondered if you had the ability to use one of your classes to be
used as Context? Well, we assume you did, and that's exactly why you're here.

The custom context feature allows you to extend the base functionality of your
bot by using your own custom context classes. This enables you to add tailored
methods and properties, enhancing your bot's capabilities and making your code
cleaner and more maintainable. This guide will walk you through the steps of
creating and using custom context classes, from simple implementations to more
advanced use cases with mixins.

## Why Use Custom Context?

Using a custom context provides several advantages:

- **Flexibility**: Define your own context classes to suit your specific needs.
- **Extensibility**: Easily add methods and properties to your context.
- **Encapsulation**: Keep your bot's logic organized and maintainable.
- **Modularity**: Leverage mixins to add reusable functionalities to your
  context.

## Getting Started with a Simple Custom Context

Let's start with a simple example. We'll create a custom context class without
any additional properties.

### Defining a Simple Custom Context

Let's start by defining a custom context class `MyContext`. Well, for custom
context to work with handlers that must be extended from the base `Context`
class.

We're building a class anyway, so let it include a method `doSomething` that can
perform some custom logic. Let's say our fancy hello-world printing logic is
inside :)

```dart
class MyContext extends Context {
  MyContext({
    required super.api,
    required super.me,
    required super.update,
  });

  void doSomething() {
    // Custom logic goes here
    print('Doing something!');
    print('Well actually printing "Hello World" 👋')
  }
}
```

### Explanation

- **Constructor**: As you can see, the extending the context class enforces our
  class to have the constructor takes three required named parameters: `api`,
  `me`, and `update`, which are passed to the super class `Context`. Namely, the
  `api` is the `RawAPI` instance, `me` will be the Information about the bot
  from `/getMe` request, and finally `update` is the actual incoming Update.
- **doSomething Method**: This method contains custom logic that can be executed
  inside a handler.

### Using the Custom Context

Next, we'll create a bot instance and use our custom context. As always we will
first create the bot instance. But, this time we'll specify that we look forward
to use the `MyContext` as our context in the type parameter.

Now that we have actually specified the type. But, when an update is received
the library does not know how to actually create an instance of the specified
class. For this reason, we have to register the constructor of our class to the
bot instance. We can do this by calling `Bot.contextBuilder` method. That's it.

We're set to use the custom context inside our handlers now.

```dart
// Create Bot instance along with specifiying the type parameter.
final bot = Bot<MyContext>(Platform.environment["BOT_TOKEN"]!);

// Use the custom context builder
bot.contextBuilder(MyContext.new);

// Example command handler
bot.command('start', (ctx) async {
  // `ctx` will be of type MyContext :)
  // Along with all the context aware methods of Context.

  // So you can do ctx.reply(...);
  await ctx.reply("Hello World!");

  // As well as, execute custom logic inside the handler
  ctx.doSomething();
});
```

### Explanation

- **Bot Initialization**: We create an instance of `Bot` with the custom context
  type `MyContext`.
- **contextBuilder**: We use the `Bot.contextBuilder` method to set the custom
  context constructor.
- **Command Handler**: Inside the command handler, we can now call the custom
  method `doSomething` defined in `MyContext`.

## Advanced Usage: Custom Context with Additional Properties

If you look closely, the `Bot.contextBuilder` method accepts a
`ContextConstructor` which is defined as follows:

```dart
typedef ContextConstructor<CTX extends Context> = FutureOr<CTX> Function({
  required RawAPI api,
  required User me,
  required Update update,
});
```

In other words, this means that the `contextBuilder` method expects a function
that takes the required parameters `api`, `me`, and `update`, and returns an
instance of the custom context.

Well, a side note, you can even pass a function that returns Future which
resolves to the custom context class.

Now, let's create a custom context class that includes additional properties.

### Defining a Custom Context with Properties

In this example, the custom context class `MyContext` has additional properties
`name` and `age`.

```dart
class MyContext extends Context {
  final String name;
  final int age;

  MyContext({
    required super.api,
    required super.me,
    required super.update,
    required this.name,
    required this.age,
  });

  void doSomething() {
    // Custom logic using additional properties
    print('Name: $name, Age: $age');
  }

  // Static method that returns ContextConstructor
  static ContextConstructor<MyContext> create() {
    return ({required api, required me, required update}) async {
      // Optionally do some processing if you'd like to :)
      final name = await getName(update);
      final age = await getAge(update);
      return MyContext(
        api: api,
        me: me,
        update: update,
        name: name,
        age: age,
      );
    };
  }
}
```

### Explanation

As in the example, our `MyContext` class now accepts two extra properties. Well,
that makes it break the laws - we mean now if you pass `MyContext.new` to
`Bot.contextBuilder` the Dart analyzer will be pretty unhappy about your
decision. If you're wondering why this is happening, we should say you know the
reason. It's because `contextBuilder` takes a Function of type
`ContextConstructor`, and now since we have to extra properties, `MyContext.new`
does not aligns with the shape of `ContextConstructor`.

It's at this time we introduce the static method `create`, which can take the
extra parameters and then return the actual ContextConstructor shaped
constructor method.

So things to note:

- **Additional Properties**: The `MyContext` class includes two additional
  properties: `name` and `age`.
- **Constructor**: The constructor now requires these additional properties.
- **doSomething Method**: This method uses the additional properties in its
  custom logic.
- **create Method**: This static method now takes `name` and `age` as parameters
  and returns a `ContextConstructor` for `MyContext`.

### Using the Custom Context with Additional Properties

Next, we'll create a bot instance and use the custom context with additional
properties.

```dart
// Create the Bot Instance
final bot = Bot<MyContext>(Platform.environment["BOT_TOKEN"]!);

// Use the custom context builder with additional properties
bot.contextBuilder(MyContext.create());

// Example command handler
bot.command('start', (ctx) async {
  await ctx.reply("Hello World!");

  // Execute custom logic inside the handler
  ctx.doSomething();
});
```

### Explanation

- **contextBuilder**: We use the `contextBuilder` method with `MyContext.create`
  and pass the additional properties `name` and `age`.
- **Command Handler**: Inside the command handler, we can now call the custom
  method `doSomething`, which utilizes the additional properties.

## Using Mixins with Custom Context

Mixins provide a powerful way to add reusable functionalities to your custom
context. Let's see how we can leverage mixins.

### 🚀 Futher Boost with Mixins

Another great usage of Custom Contexts comes in to play with
[Mixins](https://dart.dev/language/mixins).

Let's take an example and define a mixin `I18NMixin` that provides a `translate`
method. For now, let's keep it simple.

```dart
mixin I18NMixin {
  String translate(String key) {
    // Example translation logic
    Map<String, String> translations = {
      'hello': 'Hola',
      'world': 'Mundo',
    };
    return translations[key] ?? key;
  }
}
```

### Using a Mixin in Custom Context

Next, we'll create a custom context class `MyContext` that uses the `I18NMixin`.

```dart
class MyContext extends Context with I18NMixin {
  MyContext({
    required super.api,
    required super.me,
    required super.update,
  });
}
```

Now as before we attach it with the bot and enjoy our minimal translator right
inside the context handler.

### Using the Custom Context with Mixins

Next, we'll create a bot instance and use the custom context with the mixin.

```dart
// Create the Bot Instance
final bot = Bot<MyContext>(Platform.environment["BOT_TOKEN"]!);

// Use the custom context builder
bot.contextBuilder(MyContext.new);

// Example command handler
bot.command('start', (ctx) async {
  final t = ctx.translate("hello");
  await ctx.reply(t);
});
```

## Conclusion

Custom contexts provide a flexible and powerful way to extend your bot's
functionality. By defining your own context classes and leveraging mixins, you
can create modular, maintainable, and reusable code tailored to your specific
needs. Experiment with custom contexts and mixins to unlock the full potential
of your bot!
