"use client";
import Image from "next/image";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function Home() {
  const [copySuccess, setCopySuccess] = useState("");

  const codeString = `import 'dart:io';
import 'package:televerse/televerse.dart';

// Create the bot instance
final bot = Bot(Platform.environment["BOT_TOKEN"]!);

void main(List<String> args) async {
  // Handle the /start command
  bot.command("start", (ctx) async {
    await ctx.reply("Welcome to Televerse! 🚀");
  });

  // Start the bot
  await bot.start();
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeString);
    setCopySuccess("Copied!");
    setTimeout(() => setCopySuccess(""), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#2C3E50] via-[#34495E] to-[#2C3E50] flex items-center justify-center p-4">
      <div className="w-full max-w-screen-xl p-6 md:p-10 flex flex-col md:flex-row items-start">
        <div className="md:w-1/2 w-full p-5 flex flex-col items-start">
          <Image
            src="/assets/lockup.png"
            alt="Televerse Lockup"
            width={250}
            height={250}
            className="md:ml-0 ml-auto mb-4"
            priority
          />
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-4 text-center md:text-left">
            Build Bots, Like A Pro
          </h1>
          <p className="text-white mt-2 text-center md:text-justify text-lg md:text-xl">
            Elevate your Telegram bot development with Televerse – your gateway
            to a seamless and efficient experience. Easily create, manage, and
            scale your bots with a framework designed for simplicity and power.
          </p>
          <div className="flex flex-col md:flex-row md:justify-start mt-4 space-y-2 md:space-y-0 md:space-x-4">
            <a
              href="https://pub.dev/packages/televerse"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white bg-opacity-20 text-white py-2 px-4 rounded-lg hover:bg-opacity-30 transition text-center"
            >
              pub.dev
            </a>
            <a
              href="/docs"
              className="bg-white bg-opacity-20 text-white py-2 px-4 rounded-lg hover:bg-opacity-30 transition text-center"
            >
              Documentation
            </a>
          </div>
        </div>
        <div className="md:w-1/2 w-full p-5 flex flex-col">
          <div className="bg-gray-800 text-white rounded-lg shadow-lg p-4 mb-4 flex items-center justify-between">
            <span className="text-gray-400">main.dart</span>
            <button
              onClick={copyToClipboard}
              className="text-sm text-blue-400 hover:underline focus:outline-none"
            >
              {copySuccess ? copySuccess : "Copy"}
            </button>
          </div>
          <SyntaxHighlighter
            language="dart"
            style={darcula}
            customStyle={{ padding: "1rem", borderRadius: "0.5rem" }}
          >
            {codeString}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}
