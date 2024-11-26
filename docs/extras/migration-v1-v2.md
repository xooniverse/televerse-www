# Migrating from Televerse v1.x.x to v2.0.0: A Journey of Improvement

### 🌊 What Changed in the Conversation API?

In the previous version, handling conversations felt like navigating through misty waters:

```dart
// Old Way (v1.x.x)
final nameCtx = await conv.waitForTextMessage(
    chatId: ctx.id,
    timeout: Duration(minutes: 3),
);

if (nameCtx == null) {
    await ctx.reply("Sorry, I didn't catch that!");
    return;
}
```

But now? We've cleared the fog with a lighthouse of clarity! 

### ✨ Introducing Conversation Result Handling

```dart
// New Way (v2.0.0)
final response = await conv.waitForTextMessage(
  chatId: ctx.id,
  config: ConversationConfig(
    timeout: Duration(minutes: 3),
  ),
);

if (response is! ConversationSuccess<Context>) {
  print(response.state); // ConversationState.timedOut
  await ctx.reply("Oh no, I didn't catch that.");
  return;
}

await ctx.reply("Welcome, ${response.data.msg?.text}");
```

## 🎯 Key Improvements

### 1. Better Error Handling
- Introduced `ConversationResult` type
- Clear success/failure indication
- Proper state management with `ConversationState` enum

### 2. Resource Management Upgrades
- Improved subscription tracking
- More reliable resource cleanup
- Enhanced cancellation handling

### 3. Configuration Management
- New `ConversationConfig` class
- Easier to add future configuration options

### 4. Type Safety Enhancements
- Better generic usage
- More explicit type declarations
- Clearer interface boundaries

## 🔍 Filtering Messages: A New Perspective

Remember filtering messages? It used to be about `Update`, now it's all about `Context`!

```dart
// Old: Filtering with Update
Context? responseCtx = await conv.waitFor(
  chatId: ctx.id,
  filter: (Update update) {
    return update.message != null;
  },
);

// New: Filtering with Context
ConversationResult? response = await conv.waitFor(
  chatId: ctx.id,
  filter: (Context ctx) {
    return ctx.msg != null && !ctx.isServiceMessage();
  },
);
```

## 💡 Pattern Matching Magic

For those who love Dart's pattern matching for exhaustiveness check, we've got a treat! The `ConversationResult` class is sealed, so you can do:

```dart
final result = await conv.waitForTextMessage(
  chatId: ctx.id,
  config: ConversationConfig(timeout: Duration(minutes: 1)),
);

switch (result) {
  case ConversationSuccess(data: var ctx):
    await ctx.reply("Hello, ${ctx.msg?.text}!");
    break;
  case ConversationFailure(message: var error, state: ConversationState.timedOut):
    await ctx.reply("Sorry, you took too long to respond.");
    break;
  case ConversationFailure():
    await ctx.reply("Sorry, something went wrong.");
    break;
}
```

## 🚢 Smooth Sailing Ahead

By embracing these changes, you're not just updating a library - you're upgrading your bot's conversation capabilities!

### Migration Checklist
- Replace nullable context with `ConversationResult`
- Use `ConversationConfig` - where you used `timeout`.
- Leverage new result handling
- Update message filtering logic if you've used `Conversation.waitFor`

## 🆘 Need Help?

If you encounter any storms during your migration, our community and documentation are your lighthouse! 

<a href="https://telegram.me/TeleverseDart"><img src="https://img.shields.io/badge/Telegram%2F@TeleverseDart-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white"></a>


**Happy Coding, Bot Captains! 🤖**