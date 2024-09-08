
# File Handling with Televerse

> Let's take a journey through sending and handling files with Televerse.

Interacting with files in your bot is a pretty common scenario. Whether you’re sending a simple photo or downloading and processing a document sent by a user, Televerse makes this process seamless.

Televerse provides simple yet powerful methods to handle and upload files. But before we dive in, let's talk about the basics — Telegram’s principles for uploading files.

## Telegram Principles of File Upload

According to the [Telegram Bot API documentation](https://core.telegram.org/bots/api#sending-files), Telegram supports sending files in three main ways:

1. **Using `file_id`:** If the file is already stored on Telegram’s servers, you can simply use its `file_id` to send it again. There’s no file size limit when using this method.
2. **Using a File URL:** You can specify the URL of a file that’s publicly hosted. Telegram will download and send the file for you. This method has a size limit of **5 MB** for photos and **20 MB** for other file types.
3. **Using `multipart/form-data`:** The classic method of uploading files, just like a web form. This method allows file uploads up to **10 MB** for photos and **50 MB** for other types of content.

## The `InputFile` Class

Televerse allows you to send files in multiple ways, whether it's via a `file_id`, a URL, or a local file’s bytes. To handle all of these, we have the `InputFile` class. You’ll encounter `InputFile` across many methods, such as `sendPhoto`, because all file uploads in Televerse are done using this class.

### Constructors

The `InputFile` class has four constructors, each named based on its use case:

1. **`InputFile.fromFileId`**
2. **`InputFile.fromUrl`**
3. **`InputFile.fromFile`**
4. **`InputFile.fromBytes`**

The names say it all. `fromFile` accepts a `File` object, while `fromBytes` uses a `Uint8List`. Both serve the same purpose but give you flexibility based on the file source.

### Sending a Photo Example

Enough talk, let’s see how we can send a photo using all three methods. You’ll be able to handle `file_id`, URLs, and local files effortlessly.

::: code-group

```dart [With File ID]
bot.command('start', (ctx) async {
  const fileId = "AgACAgUAAxkBAAIvAWbUio...QADNQQ";

  // Create the InputFile instance
  final photo = InputFile.fromFileId(fileId);

  // Send it :)
  await ctx.replyWithPhoto(photo);
});
```

```dart [With URL]
bot.command('start', (ctx) async {
  const url = "https://televerse.xooniverse.com/assets/lockup-with-bg.png";

  // Create the InputFile instance
  final photo = InputFile.fromUrl(url);

  // Send it :)
  await ctx.replyWithPhoto(photo);
});
```

```dart [With File]
bot.command('start', (ctx) async {
  final file = File("assets/photo.jpeg");

  // Create the InputFile instance
  final photo = InputFile.fromFile(file);

  // Send it :)
  await ctx.replyWithPhoto(photo);
});
```

:::

See? That’s all it takes to send a file using Televerse.

## A Word About `file_id`

The `file_id` is a unique identifier for files already stored on Telegram's servers. However, keep in mind that the **same file** can have **different `file_id`s**. Yes, the same file, but multiple `file_id`s.

So, if you're using a `file_id`, try to stick to the ones your bot knows about. Using `file_id`s obtained from another bot is kind of like Schrödinger's cat — it might work, or it might not. Either way, you’ve been warned!


## Receiving Files

Televerse doesn’t just let you send files; it also helps you handle incoming ones, whether they’re photos, videos, or documents. Each type of file contains the famous `file_id` we just talked about.

## The `getFile` Method

The `getFile` method is a powerful tool that allows your bot to retrieve basic information about a file and prepare it for downloading. This method is perfect when you need to handle files users send to your bot.

When you call `getFile`, Telegram returns a `File` object that contains essential metadata like the file size and file path. You can then use the file path to download the file via a direct HTTP request using a URL like this:

```
https://api.telegram.org/file/bot<token>/<file_path>
```

Just replace `<file_path>` with the path provided by Telegram and `<token>` with your bot’s token. One thing to note: the download link is likely to expire after **one hour**, so if you miss the window, you’ll need to call `getFile` again to get a fresh link. Also, keep in mind that the max file size for downloads is **20MB**.

## Let's See it in Action

We all know examples make learning easier, right? So, let’s walk through how you can download an incoming video file. And hey, remember this: `Context` is Televerse’s secret weapon. It automatically adapts API methods based on the incoming update, making your life a lot simpler. 

For a little extra clarity—normally, the `getFile` method requires you to pass a `file_id`. But when you’re working within a `Context`, you don’t have to worry about that at all. Just call `ctx.getFile()`, and we’ll handle the `file_id` under the hood.

Oh, and don’t worry—we’ll also show you how to achieve the same thing without using `Context`. We know you like options!

::: code-group

```dart [Context]{7,10,18}
bot.onVideo((ctx) async {
  await ctx.reply("Got it!");

  final video = ctx.msg!.video!;

  // Prepare for downloading
  final file = await ctx.getFile();

  // Get the download URL
  final url = file.getDownloadUrl();

  await ctx.reply(
    "Tap the button to download the video.",
    replyMarkup: InlineKeyboard().addUrl("Download Now", url),
  );

  // You can also do:
  final downloaded = await file.download(); // To download the file 

  // `downloaded` will be a `File` from 'dart:io'
  // Do some processing here :)
});
```

```dart [Without Context]{8,11}
final token = Platform.environment["BOT_TOKEN"]!;
final bot = Bot(token);

void main(List<String> args) async {
  final fileId = "AgACAgUAAxkBAAIvAWbUio...QADNQQ";

  // Get the file information by passing the `file_id`
  final file = await bot.api.getFile(fileId);

  // Download and process it
  final downloaded = await file.download();

  // ...
}
```

:::
We’ve made it simple for you to either grab the download URL or download the file directly to your system.

::: info
When creating an instance of the `Bot` class, it will be accessible through `Bot.instance`. Methods like `File.getDownloadUrl` and `File.download` automatically use this to get the Bot token. However, if you’re working with multiple bot instances in the same project, be aware that the token might correspond to the most recently created bot. If needed, you can explicitly pass a different `token` as a named parameter in these methods. Just in case! : )
:::

---

There you have it! With Televerse, handling files in your bot is easier and more flexible than ever. Whether you're sending a quick photo or downloading a video, a document, a sticker, etc. for further processing, we've got you covered.

