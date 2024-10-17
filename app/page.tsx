"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Groq from "groq-sdk";

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
}

export default function Home() {
  
  const client = new Groq({
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  // Initialize state
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! How can I assist you today?", sender: "bot" },
  ]);

  // Initialize input state
  const [input, setInput] = useState("");

  // Handle user input
  const handleSend = () => {
    if (input.trim()) {
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, text: input, sender: "user" },
      ]);
      setInput("");
      setTimeout(() => {
        main([
          ...messages,
          { id: messages.length + 1, text: input, sender: "user" },
        ]);
      }, 1000);
    }
  };

  async function main(updatedMessages: Message[]) {
    const chatHistory = updatedMessages.map((message: Message) => ({
      content: message.text,
      name: message.sender === "user" ? "user" : "assistant",
    }));

    const chatCompletion = await client.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "system",
          content: `Welcome to the customer support team! You are an AI customer service agent operating a 24/7 help chatbox on our website. Your role is to assist customers with their questions, troubleshoot issues, provide information on products and services, and ensure a smooth, positive experience. Be polite, empathetic, and solution-oriented. Respond as if you are a real customer service agent working around the clock. Here is the chat history between you and the customer: ${JSON.stringify(
            chatHistory
          )}`,
        },
      ],
    });

    if (chatCompletion.choices[0].message.content) {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: chatCompletion.choices[0].message.content || "",
          sender: "bot",
        },
      ]);
    }
  }

  return (
    // Main container div
    // flex flex-col: Creates a flexbox container with vertical layout
    // h-screen: Sets the height to 100% of the viewport height
    // max-w-2xl: Sets the maximum width to 2xl (42rem / 672px)
    // mx-auto: Centers the container horizontally
    // bg-gradient-to-b from-gray-50 to-white: Creates a vertical gradient background from light gray to white
    // text-gray-800: Sets the text color to dark gray
    // p-4: Adds padding of 1rem (16px) on all sides
    // shadow-lg: Adds a large box shadow for depth
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-gradient-to-b from-gray-50 to-white text-gray-50 p-4 shadow-lg">
      {/* Header section */}
      {/* mb-4: Adds margin to the bottom */}
      {/* pb-2: Adds padding to the bottom */}
      {/* border-b border-gray-200: Adds a light gray border at the bottom */}
      <header className=" mb-4 pb-2 border-b border-gray-200">
        {/* h1 for the main title */}
        {/* text-xl: Sets font size to extra large */}
        {/* font-semibold: Sets font weight to semi-bold */}
        {/* text-gray-700: Sets text color to a darker gray */}
        <h1 className="text-x1 font-semibold text-gray-700">AI Support</h1>
      </header>
      {/* ScrollArea component for the chat messages */}
      {/* flex-grow: Allows this component to grow and fill available space */}
      {/* mb-4: Adds margin to the bottom */}
      <ScrollArea className="flex-grow mb-4">
        {messages.map((message) => (
          // Container for each message
          // mb-4: Adds margin to the bottom of each message
          // text-right or text-left: Aligns the text based on the sender
          <div
            key={message.id}
            className={`mb-4 ${
              message.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            {/* Message bubble */}
            {/* inline-block: Allows the div to fit the content */}
            {/* max-w-[80%]: Sets maximum width to 80% of the container */}
            {/* px-4 py-2: Adds horizontal and vertical padding */}
            {/* rounded-lg: Adds rounded corners */}
            {/* bg-gradient-to-r: Creates a horizontal gradient */}
            <div
              className={`inline-block 
              max-w-[80%] px-4 py-2 rounded-lg
              ${
                message.sender === "user"
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-800"
                  : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800"
              }`}
            >
              {/* Message text */}
              {/* text-sm: Sets font size to small */}
              <p className="text-sm">{message.text}</p>
            </div>
            {/* Sender label */}
            {/* text-xs: Sets font size to extra small */}
            {/* mt-1: Adds margin to the top */}
            {/* text-gray-500 or text-gray-400: Sets text color to a lighter gray */}
            <div
              className={`text-sm mt-1 mx-4 ${
                message.sender === "user" ? "text-gray-500" : "text-gray-400"
              }`}
            >
              {message.sender === "user" ? "You" : "AI"}
            </div>
          </div>
        ))}
      </ScrollArea>

      {/* Input area */}
      {/* flex items-center: Creates a flexbox container with vertically centered items */}
      {/* border-t border-gray-200: Adds a light gray border at the top */}
      {/* pt-4: Adds padding to the top */}
      <div className="flex items-center border-t border-gray-200 pt-4">
        {/* Input component */}
        {/* flex-grow: Allows the input to grow and fill available space */}
        {/* mr-2: Adds margin to the right */}
        {/* bg-gradient-to-r from-gray-50 to-white: Creates a horizontal gradient background */}
        {/* border-gray-200: Sets border color to light gray */}
        {/* focus:ring-gray-300 focus:border-gray-300: Changes the ring and border color when focused */}
        <Input
          className="
          flex-grow mr-2 
          bg-gradient-to-r from-gray-50 to-white      
          border-gray-200 
          focus:ring-gray-300 
          focus:border-gray-300
          text-gray-800"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
        />
        {/* Send button */}
        {/* bg-gradient-to-r: Creates a horizontal gradient background */}
        {/* hover:from-gray-600 hover:to-gray-700: Changes the gradient on hover */}
        {/* text-white: Sets text color to white */}
        <Button
          onClick={handleSend}
          className="bg-gradient-to-r from-gray-700 hover:to-gray-800 text-white"
        >
          {/* Send icon */}
          {/* w-4 h-4: Sets width and height to 1rem (16px) */}
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
