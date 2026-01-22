# Building a Quote Bot: Your Journey into Inline Queries

Imagine you're scrolling through your group chat with friends, and someone shares a really profound thought. You want to respond with an inspiring quote, but switching to your quote bot, finding the perfect quote, copying it, and pasting it back feels... clunky. What if you could just type `@quotebot inspire` right in the chat and instantly get a beautiful quote to share?

That's exactly what we're going to build together. By the end of this journey, you'll have created a quote bot that your friends can use seamlessly in any chat, without ever leaving the conversation.

## The Magic of Inline Queries

Think of inline queries as your bot's superpower. Instead of people having to visit your bot's private chat (like knocking on a door), they can summon your bot anywhere in Telegram (like having a helpful friend who's always ready to assist, no matter where you are).

When someone types `@yourbot something` in any chat, Telegram whispers to your bot: "Hey, someone needs your help with 'something'." Your bot then responds with a menu of options that appear right above the keyboard and your users can simply select to send a pre-filled message.

## Setting Up Our Quote Bot

Let's start our journey by creating a simple quote bot. First, we need the right tools:

```dart
import 'package:televerse/televerse.dart';
```

Now, let's create our bot:

```dart
final bot = Bot('YOUR_BOT_TOKEN');
```

## Our First Inline Query Handler

Let's say someone types `@quotebot inspire` in their group chat. We want to catch that and respond with some inspiring quotes. Here's how we make the magic happen:

```dart
bot.inlineQuery("inspire", (ctx) async {
  print("Someone needs inspiration! 🌟");
  
  // We'll build our response here
});
```

This is like setting up a listener who perks up every time someone says "inspire" after mentioning our bot. But right now, our listener just prints a message and doesn't actually help. Let's fix that.

## Building Our Quote Collection

Every good quote bot needs great quotes. Let's create a collection:

```dart
final inspirationalQuotes = [
  {
    'text': 'The only way to do great work is to love what you do.',
    'author': 'Steve Jobs'
  },
  {
    'text': 'Life is what happens to you while you\'re busy making other plans.',
    'author': 'John Lennon'
  },
  {
    'text': 'The future belongs to those who believe in the beauty of their dreams.',
    'author': 'Eleanor Roosevelt'
  },
  {
    'text': 'In the end, we will remember not the words of our enemies, but the silence of our friends.',
    'author': 'Martin Luther King Jr.'
  }
];
```

Now our bot has something meaningful to share! But how do we turn these quotes into something users can actually select and send?

## Creating Beautiful Quote Cards

This is where the `InlineQueryResultBuilder` becomes our best friend. Think of it as an artist's palette – it helps us create beautiful, interactive cards that users can choose from:

```dart
bot.inlineQuery("inspire", (ctx) async {
  final builder = InlineQueryResultBuilder();
  
  // Let's create a card for each quote
  for (int i = 0; i < inspirationalQuotes.length; i++) {
    final quote = inspirationalQuotes[i];
    
    builder.article(
      "inspire_$i", // Unique ID for this quote
      "💫 ${quote['author']}", // Title that appears in the selection
      (content) => content.text(
        "\"${quote['text']}\"\n\n— ${quote['author']}",
        parseMode: ParseMode.markdown,
      ),
    );
  }
  
  // Send our beautiful quote cards to the user
  final results = builder.build();
  await ctx.answerInlineQuery(results);
});
```

Now when someone types `@quotebot inspire`, they'll see a beautiful menu with four quote options, each showing the author's name. When they tap one, it sends the full formatted quote to their chat. Pretty cool, right?

## Making It Smarter: Category-Based Quotes

But what if we want different types of quotes? Let's expand our bot to handle categories:

```dart
final quotes = {
  'motivational': [
    {'text': 'Success is not final, failure is not fatal: it is the courage to continue that counts.', 'author': 'Winston Churchill'},
    {'text': 'The way to get started is to quit talking and begin doing.', 'author': 'Walt Disney'},
  ],
  'funny': [
    {'text': 'I have not failed. I\'ve just found 10,000 ways that won\'t work.', 'author': 'Thomas Edison'},
    {'text': 'The trouble with having an open mind, of course, is that people will insist on coming along and trying to put things in it.', 'author': 'Terry Pratchett'},
  ],
  'wisdom': [
    {'text': 'The only true wisdom is in knowing you know nothing.', 'author': 'Socrates'},
    {'text': 'Yesterday is history, tomorrow is a mystery, today is a gift of God, which is why we call it the present.', 'author': 'Bill Keane'},
  ],
};
```

Now let's create handlers for each category:

```dart
bot.inlineQuery("motivational", (ctx) async {
  await sendQuotesByCategory(ctx, "motivational", "🚀");
});

bot.inlineQuery("funny", (ctx) async {
  await sendQuotesByCategory(ctx, "funny", "😄");
});

bot.inlineQuery("wisdom", (ctx) async {
  await sendQuotesByCategory(ctx, "wisdom", "🧠");
});
```

And here's our helper function that does the heavy lifting:

```dart
Future<void> sendQuotesByCategory(Context ctx, String category, String emoji) async {
  final builder = InlineQueryResultBuilder();
  final categoryQuotes = quotes[category] ?? [];
  
  for (int i = 0; i < categoryQuotes.length; i++) {
    final quote = categoryQuotes[i];
    
    builder.article(
      "${category}_$i",
      "$emoji ${quote['author']}",
      (content) => content.text(
        "\"${quote['text']}\"\n\n— ${quote['author']}",
        parseMode: ParseMode.markdown,
      ),
    );
  }
  
  final results = builder.build();
  await ctx.answerInlineQuery(results);
}
```

## Adding a Smart Search Feature

What if someone wants to search for quotes about a specific topic? Let's add a search feature using pattern matching:

```dart
bot.inlineQuery(RegExp(r'^search\s+(.+)'), (ctx) async {
  final inlineQuery = ctx.inlineQuery!;
  final match = RegExp(r'^search\s+(.+)').firstMatch(inlineQuery.query);
  final searchTerm = match?.group(1)?.toLowerCase() ?? '';
  
  print("🔍 Someone is searching for: $searchTerm");
  
  final builder = InlineQueryResultBuilder();
  final allQuotes = <Map<String, String>>[];
  
  // Gather all quotes from all categories
  quotes.values.forEach((categoryQuotes) {
    allQuotes.addAll(categoryQuotes.cast<Map<String, String>>());
  });
  
  // Find quotes that match the search term
  final matchingQuotes = allQuotes.where((quote) =>
    quote['text']!.toLowerCase().contains(searchTerm) ||
    quote['author']!.toLowerCase().contains(searchTerm)
  ).toList();
  
  if (matchingQuotes.isEmpty) {
    builder.article(
      "no_results",
      "🤷‍♂️ No quotes found",
      (content) => content.text(
        "Sorry, I couldn't find any quotes matching \"$searchTerm\".\n\n"
        "Try searching for: motivational, wisdom, success, life, or an author's name!",
      ),
    );
  } else {
    for (int i = 0; i < matchingQuotes.length && i < 10; i++) { // Limit to 10 results
      final quote = matchingQuotes[i];
      builder.article(
        "search_$i",
        "🔍 ${quote['author']}",
        (content) => content.text(
          "\"${quote['text']}\"\n\n— ${quote['author']}",
          parseMode: ParseMode.markdown,
        ),
      );
    }
  }
  
  final results = builder.build();
  await ctx.answerInlineQuery(results);
});
```

Now users can type `@quotebot search wisdom` or `@quotebot search Churchill` and get relevant results!

## The Helpful Guide: Adding a Help System

Every good bot needs a way to show users what it can do:

```dart
bot.inlineQuery("help", (ctx) async {
  final builder = InlineQueryResultBuilder();
  
  builder.article(
    "help_guide",
    "📚 How to Use Quote Bot",
    (content) => content.text(
      "🤖 *Quote Bot Help*\n\n"
      "Here's how to get amazing quotes:\n\n"
      "• `@quotebot motivational` - Get motivational quotes 🚀\n"
      "• `@quotebot funny` - Get humorous quotes 😄\n"
      "• `@quotebot wisdom` - Get wise quotes 🧠\n"
      "• `@quotebot search <topic>` - Search for specific quotes 🔍\n"
      "• `@quotebot help` - Show this help message 📚\n\n"
      "Just type any of these in any chat and watch the magic happen! ✨",
      parseMode: ParseMode.markdown,
    ),
  );
  
  final results = builder.build();
  await ctx.answerInlineQuery(results);
});
```

## The Safety Net: Handling Everything Else

What happens when someone types something our bot doesn't understand? We need a friendly fallback:

```dart
bot.onInlineQuery((ctx) async {
  final query = ctx.inlineQuery!.query;
  print('🤔 Hmm, someone asked for: "$query"');
  
  final builder = InlineQueryResultBuilder();
  
  builder.article(
    "fallback",
    "🤔 Not sure what you're looking for?",
    (content) => content.text(
      "I didn't understand \"$query\", but I'm here to help! 🤗\n\n"
      "Try one of these:\n"
      "• `@quotebot motivational` 🚀\n"
      "• `@quotebot funny` 😄\n"
      "• `@quotebot wisdom` 🧠\n"
      "• `@quotebot search <topic>` 🔍\n"
      "• `@quotebot help` 📚",
      parseMode: ParseMode.markdown,
    ),
  );
  
  final results = builder.build();
  await ctx.answerInlineQuery(results);
});
```

## Putting It All Together

Here's our complete quote bot that tells a story through code:

```dart
import 'package:televerse/televerse.dart';
import 'package:televerse/telegram.dart';

void main() {
  final bot = Bot('YOUR_BOT_TOKEN');
  
  // Our treasure chest of quotes
  final quotes = {
    'motivational': [
      {'text': 'Success is not final, failure is not fatal: it is the courage to continue that counts.', 'author': 'Winston Churchill'},
      {'text': 'The way to get started is to quit talking and begin doing.', 'author': 'Walt Disney'},
      {'text': 'Don\'t be afraid to give up the good to go for the great.', 'author': 'John D. Rockefeller'},
    ],
    'funny': [
      {'text': 'I have not failed. I\'ve just found 10,000 ways that won\'t work.', 'author': 'Thomas Edison'},
      {'text': 'The trouble with having an open mind, of course, is that people will insist on coming along and trying to put things in it.', 'author': 'Terry Pratchett'},
      {'text': 'I can resist everything except temptation.', 'author': 'Oscar Wilde'},
    ],
    'wisdom': [
      {'text': 'The only true wisdom is in knowing you know nothing.', 'author': 'Socrates'},
      {'text': 'Yesterday is history, tomorrow is a mystery, today is a gift of God, which is why we call it the present.', 'author': 'Bill Keane'},
      {'text': 'Be yourself; everyone else is already taken.', 'author': 'Oscar Wilde'},
    ],
  };
  
  // Helper function to send quotes by category
  Future<void> sendQuotesByCategory(Context ctx, String category, String emoji) async {
    final builder = InlineQueryResultBuilder();
    final categoryQuotes = quotes[category] ?? [];
    
    for (int i = 0; i < categoryQuotes.length; i++) {
      final quote = categoryQuotes[i];
      
      builder.article(
        "${category}_$i",
        "$emoji ${quote['author']}",
        (content) => content.text(
          "\"${quote['text']}\"\n\n— ${quote['author']}",
          parseMode: ParseMode.markdown,
        ),
      );
    }
    
    final results = builder.build();
    await ctx.answerInlineQuery(results);
  }
  
  // Category handlers
  bot.inlineQuery("motivational", (ctx) async {
    await sendQuotesByCategory(ctx, "motivational", "🚀");
  });
  
  bot.inlineQuery("funny", (ctx) async {
    await sendQuotesByCategory(ctx, "funny", "😄");
  });
  
  bot.inlineQuery("wisdom", (ctx) async {
    await sendQuotesByCategory(ctx, "wisdom", "🧠");
  });
  
  // Smart search feature
  bot.inlineQuery(RegExp(r'^search\s+(.+)'), (ctx) async {
    final inlineQuery = ctx.inlineQuery!;
    final match = RegExp(r'^search\s+(.+)').firstMatch(inlineQuery.query);
    final searchTerm = match?.group(1)?.toLowerCase() ?? '';
    
    final builder = InlineQueryResultBuilder();
    final allQuotes = <Map<String, String>>[];
    
    quotes.values.forEach((categoryQuotes) {
      allQuotes.addAll(categoryQuotes.cast<Map<String, String>>());
    });
    
    final matchingQuotes = allQuotes.where((quote) =>
      quote['text']!.toLowerCase().contains(searchTerm) ||
      quote['author']!.toLowerCase().contains(searchTerm)
    ).toList();
    
    if (matchingQuotes.isEmpty) {
      builder.article(
        "no_results",
        "🤷‍♂️ No quotes found",
        (content) => content.text(
          "Sorry, I couldn't find any quotes matching \"$searchTerm\".\n\n"
          "Try searching for: motivational, wisdom, success, life, or an author's name!",
        ),
      );
    } else {
      for (int i = 0; i < matchingQuotes.length && i < 10; i++) {
        final quote = matchingQuotes[i];
        builder.article(
          "search_$i",
          "🔍 ${quote['author']}",
          (content) => content.text(
            "\"${quote['text']}\"\n\n— ${quote['author']}",
            parseMode: ParseMode.markdown,
          ),
        );
      }
    }
    
    final results = builder.build();
    await ctx.answerInlineQuery(results);
  });
  
  // Help system
  bot.inlineQuery("help", (ctx) async {
    final builder = InlineQueryResultBuilder();
    
    builder.article(
      "help_guide",
      "📚 How to Use Quote Bot",
      (content) => content.text(
        "🤖 *Quote Bot Help*\n\n"
        "Here's how to get amazing quotes:\n\n"
        "• `@quotebot motivational` - Get motivational quotes 🚀\n"
        "• `@quotebot funny` - Get humorous quotes 😄\n"
        "• `@quotebot wisdom` - Get wise quotes 🧠\n"
        "• `@quotebot search <topic>` - Search for specific quotes 🔍\n"
        "• `@quotebot help` - Show this help message 📚\n\n"
        "Just type any of these in any chat and watch the magic happen! ✨",
        parseMode: ParseMode.markdown,
      ),
    );
    
    final results = builder.build();
    await ctx.answerInlineQuery(results);
  });
  
  // The safety net - handles everything else
  bot.onInlineQuery((ctx) async {
    final query = ctx.inlineQuery!.query;
    
    final builder = InlineQueryResultBuilder();
    
    builder.article(
      "fallback",
      "🤔 Not sure what you're looking for?",
      (content) => content.text(
        "I didn't understand \"$query\", but I'm here to help! 🤗\n\n"
        "Try one of these:\n"
        "• `@quotebot motivational` 🚀\n"
        "• `@quotebot funny` 😄\n"
        "• `@quotebot wisdom` 🧠\n"
        "• `@quotebot search <topic>` 🔍\n"
        "• `@quotebot help` 📚",
        parseMode: ParseMode.markdown,
      ),
    );
    
    final results = builder.build();
    await ctx.answerInlineQuery(results);
  });
  
  print("🤖 Quote Bot is ready to inspire! Type @yourbotname in any chat to get started.");
  bot.start();
}
```

## What We've Built Together

Congratulations! You've just created a sophisticated inline bot that:

- **Responds to specific categories** (motivational, funny, wisdom)
- **Searches through quotes** intelligently
- **Provides helpful guidance** when users need it
- **Handles edge cases** gracefully
- **Works seamlessly** in any Telegram chat

## The Journey Continues

This is just the beginning! Here are some ideas to make your quote bot even more awesome:

- **Add more categories**: Love quotes, success quotes, friendship quotes
- **Include images**: Send quotes as beautiful images
- **User favorites**: Let users save their favorite quotes
- **Daily quotes**: Send a quote of the day
- **Quote contributions**: Let users submit their own quotes

Remember, the key to great inline bots is thinking like your users. What would make their experience delightful? What would save them time? What would make them smile?

Your bot is now ready to spread wisdom, motivation, and laughter across Telegram. Go forth and inspire! 🌟