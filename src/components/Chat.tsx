"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { generateChatResponse } from "@/utils/actions";
import toast from "react-hot-toast";

type ChatMessage = {
  role: string;
  content: string;
};

const Chat = () => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { mutate, isPending } = useMutation({
    mutationFn: (query: ChatMessage) =>
      generateChatResponse([...messages, query]),
    onSuccess: (data) => {
      if (!data) {
        toast.error("Error generating response");
        return;
      }
      setMessages((prev) => [...prev, data as ChatMessage]);
    },
  });
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const query = { role: "user", content: text };
    mutate(query as ChatMessage);
    setMessages((prev) => [...prev, query]);
    setText("");
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] grid grid-rows-[1fr,auto]">
      <div>
        {messages.map(({ role, content }: ChatMessage, index) => {
          const avatar = role === "user" ? "👤" : "🤖";
          const bgc = role === "user" ? "bg-base-200" : "bg-base-100";
          return (
            <div
              key={index}
              className={`${bgc} flex py-6 -mx-8 px-8 text-xl leading-loose border-b border-base-300`}
            >
              <span className="mr-4">{avatar}</span>
              <p className="max-w-3xl">{content}</p>
            </div>
          );
        })}
        {isPending ? <span className="loading mt-4"></span> : null}
      </div>
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl pt-12"
      >
        <div className="join w-full">
          <input
            type="text"
            placeholder="Message GeniusGPT"
            className="input input-border join-item w-full"
            value={text}
            required
            onChange={(e) => setText(e.target.value)}
          />
          <button
            className="btn btn-primary uppercase"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Asking..." : "Ask Question"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
