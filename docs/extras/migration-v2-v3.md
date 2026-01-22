# Migration Guide: Televerse 2.7.0 → 3.0.0

## Overview

Televerse 3.0.0 introduces a **major architectural overhaul** inspired by grammY, bringing modern patterns and enhanced developer experience. This guide will help you migrate your existing bots from version 2.7.0 to 3.0.0.

::: warning Breaking Changes
This is a **major breaking release**. Please read through this guide carefully and test your bot thoroughly after migration.
:::

## Quick Migration Checklist

- [ ] Update imports to include `telegram.dart`
- [ ] Migrate middleware from classes to functions
- [ ] Update bot constructor and context factory
- [ ] Migrate conversation API usage
- [ ] Update keyboard/menu method names
- [ ] Replace deprecated handler types
- [ ] Update custom context access patterns
- [ ] Migrate to new plugin system (optional)

## 1. Import Changes

### Before (2.7.0)
```dart
import 'package:televerse/televerse.dart';
```

### After (3.0.0)
```dart
import 'package:televerse/televerse.dart';
import 'package:televerse/telegram.dart'; // Required for enums and types
```

**Why this change?** Many Telegram-specific enums and types (`ParseMode`, `ChatAction`, `ChatType`, etc.) have been moved to the `telegram.dart` library for better organization.

## 2. Bot Constructor Changes

### `Bot.local()` Constructor
The `baseURL` parameter was optional in the earlier versions. 
**Before (2.7.0)**
```dart
final bot = Bot.local('token', baseURL: 'http://localhost:8081');
```

**After (3.0.0)**

We require the `baseURL` to be present as positional parameter. 
```dart
final bot = Bot.local('token', 'http://localhost:8081');
```

### Custom Context Factory
**Before (2.7.0)**
```dart
final bot = Bot<MyContext>('token');
bot.useContext(MyContext.new);
```

**After (3.0.0)**
```dart
final bot = Bot('token', contextFactory: MyContext.new);
```

### Update Fetcher
**Before (2.7.0)**
```dart
final bot = Bot('token', fetcher: customFetcher);
await bot.start();
```

**After (3.0.0)**
```dart
final bot = Bot('token');
await bot.start(customFetcher); // Pass fetcher to start()
```

We have also renamed `Webhook` and `LongPolling` classes to `WebhookFetcher` and `LongPollingFetcher`.

## 3. Context Changes

### Accessing Bot Information
**Before (2.7.0)**
```dart
String botName = ctx.me.firstName;
int botId = ctx.me.id;
```

**After (3.0.0)**
```dart
String? botName = ctx.me.me?.firstName;
int? botId = ctx.me.me?.id;
```

**Why this change?** `Context.me` is now a `BotInfo` object instead of a direct `User` object, providing more structured bot information.

## 4. Middleware System Migration

This is one of the biggest changes. Middleware is now function-based instead of class-based.

### Simple Middleware
**Before (2.7.0)**
```dart
class LoggingMiddleware extends Middleware {
  @override
  Future<void> handle(Context ctx, NextFunction next) async {
    print('Processing update ${ctx.update.updateId}');
    await next();
    print('Finished processing');
  }
}

bot.use(LoggingMiddleware());
```

**After (3.0.0)**
```dart
// Function-based middleware
Middleware<Context> loggingMiddleware = (ctx, next) async {
  print('Processing update ${ctx.update.updateId}');
  await next();
  print('Finished processing');
};

bot.use(loggingMiddleware);
```

### Transformer Attachment
**Before (2.7.0)**
```dart
bot.use(MyTransformer()); // Both middleware and transformers
```

**After (3.0.0)**
```dart
bot.use(myMiddleware);        // Only middleware
bot.api.use(MyTransformer()); // Transformers go to api.use()
```

## 5. Conversation API Migration

The conversation API has been completely redesigned.

### Basic Text Waiting
**Before (2.7.0)**
```dart
var response = await conversation.waitForTextMessage(chatId: ctx.id);

if (response is! ConversationSuccess<Context>) {
  await ctx.reply("Something went wrong.");
  
  response as ConversationFailure<Context>;
  print(response.state);
  print(response.message);
  return;
}

await ctx.reply("Hello, ${response.data.message?.text}!");
```

**After (3.0.0)**
```dart
// Install ConversationPlugin first
bot.plugin(ConversationPlugin<Context>());

// Then use the new API
final nameCtx = await conversation.filter(Filters().text);
await nameCtx.reply("Hello ${nameCtx.text}");
```

### Advanced Conversation Patterns
**Before (2.7.0)**
```dart
// Various specific wait methods
await conversation.waitForPhoto(ctx.id);
await conversation.waitForDocument(ctx.id);
await conversation.waitForContact(ctx.id);
```

**After (3.0.0)**
```dart
// Unified filter-based approach
await conversation.filter(Filters().photo);
await conversation.filter(Filters().document);
await conversation.filter(Filters().contact);

// Or using the bot's filters property
await conversation.filter(bot.filters.photo);
await conversation.filter(bot.filters.document);
await conversation.filter(bot.filters.contact);
```

### With Timeout Support (New Feature)
```dart
try {
  final ctx = await conversation.filter(
    bot.filters.text,
    timeout: Duration(minutes: 2),
  );
  await ctx.reply("Got your message: ${ctx.text}");
} on ConversationTimeoutException {
  await ctx.reply("You took too long to respond!");
}
```

## 6. Keyboard and Menu Changes

### Keyboard Methods
**Before (2.7.0)**
```dart
keyboard.addText('Button text');
```

**After (3.0.0)**
```dart
keyboard.text('Button text');
```

### Inline Keyboard Methods
**Before (2.7.0)**
```dart
inlineKeyboard.addUrl('Google', 'https://google.com');
```

**After (3.0.0)**
```dart
inlineKeyboard.url('Google', 'https://google.com');
```

### Inline Menu Changes
**Before (2.7.0)**
```dart
InlineMenu(name: "Start Menu")
    .text("Hello", helloCallback, data: 'hello');
```

**After (3.0.0)**
```dart
InlineMenu(name: "Start Menu")
    .text("Hello", 'hello', helloCallback); // data and handler swapped
```

### Switch Inline Query
**Before (2.7.0)**
```dart
button.switchInlineQueryCurrentChat('Text', 'query');
```

**After (3.0.0)**
```dart
button.switchInlineCurrentChat('Text', 'query');
```

## 7. Handler Type Changes

### Handler Typedef
**Before (2.7.0)**
```dart
Handler<Context> myHandler = (ctx) async {
  await ctx.reply('Hello');
};
```

**After (3.0.0)**
```dart
UpdateHandler<Context> myHandler = (ctx) async {
  await ctx.reply('Hello');
};
```

## 8. Removed Methods and Classes

### Bot Methods
```dart
// REMOVED in 3.0.0
bot.removeMenu(); // No replacement - manage menus manually

// REMOVED in 3.0.0  
ID.get(); // Replace with: api.getChat(id)
```

### Logger Options
**Before (2.7.0)**
```dart
final bot = Bot('token', loggerOptions: LoggerOptions(...));
```

**After (3.0.0)**
```dart
// Use custom HTTP client with interceptors instead
final dio = Dio();
dio.interceptors.add(LogInterceptor());
final bot = Bot('token', httpClient: DioHttpClient(dio: dio));
```

## 9. Plugin System (New Feature)

Consider migrating to the new plugin system for better organization:

### Session Management
**Before (2.7.0)**
```dart
// Manual session management
final sessions = <int, Map<String, dynamic>>{};

bot.use((ctx, next) async {
  final userId = ctx.from?.id;
  if (userId != null) {
    ctx.session = sessions[userId] ??= {};
  }
  await next();
  if (userId != null) {
    sessions[userId] = ctx.session;
  }
});
```

**After (3.0.0) - Using Session Plugin**
```dart
// Install plugin
bot.plugin(SessionPlugin<BotContext, Map<String, dynamic>>(
  initial: () => {'count': 0},
  getSessionKey: (ctx) => 'user_${ctx.from?.id ?? 0}',
));

// Now sessions are automatically managed
bot.on(bot.filters.text, (ctx) async {
  final count = ctx.session['count'] as int? ?? 0;
  ctx.session['count'] = count + 1;
  await ctx.reply('Message count: ${count + 1}');
});
```

## Benefits of Migrating

After completing the migration, you'll enjoy:

- ✅ **Better Type Safety**: Full generic support with compile-time error checking
- ✅ **Modern Filter System**: 80+ built-in filters with logical operators
- ✅ **Plugin Architecture**: Extensible and reusable components
- ✅ **Enhanced Developer Experience**: More intuitive API inspired by grammY
- ✅ **Improved Performance**: Optimized middleware composition
- ✅ **Better Error Handling**: Enhanced error boundaries and recovery
- ✅ **Built-in Webhook Support**: Easy deployment with automatic server setup

## Need Help?

If you encounter issues during migration:

1. Check the [GitHub Issues](https://github.com/theweaverlabs/televerse/issues) for similar problems
2. Review the [examples repository](https://github.com/theweaverlabs/TeleverseExamples) for updated patterns
3. Join the [Telegram Group](https://telegram.me/TeleverseDart) for support

Happy migrating! 🚀