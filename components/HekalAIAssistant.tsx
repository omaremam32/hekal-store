"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Loader2, MessageCircle, Send, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type ChatMessage = {
  role: "assistant" | "user";
  text: string;
};

export default function HekalAIAssistant() {
  const { locale } = useLanguage();
  const isArabic = locale === "ar";

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: isArabic
        ? "أهلاً 👋 أنا مساعد هيكل. أقدر أساعدك في المقاس، الألوان، الطلب، والاستبدال."
        : "Hi 👋 I’m Hekal AI. I can help you with sizing, colors, ordering, and exchanges.",
    },
  ]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const quickQuestions = useMemo(
    () =>
      isArabic
        ? [
            "ما المقاس المناسب لي؟",
            "هل يمكن الاستبدال؟",
            "ما اللون المناسب مع بنطلون أسود؟",
            "قميص مناسب لفرح؟",
          ]
        : [
            "What size should I choose?",
            "Can I exchange?",
            "What color matches black pants?",
            "A shirt for a wedding?",
          ],
    [isArabic]
  );

  async function sendMessage(customText?: string) {
    const finalMessage = (customText ?? message).trim();

    if (!finalMessage || sending) return;

    const assistantIndex = messages.length + 1;

    setMessages((current) => [
      ...current,
      { role: "user", text: finalMessage },
      {
        role: "assistant",
        text: "",
      },
    ]);

    setMessage("");
    setSending(true);

    try {
      const response = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: finalMessage,
          locale,
        }),
      });

      if (!response.body) {
        throw new Error("No response stream.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let finalText = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        finalText += chunk;

        setMessages((current) =>
          current.map((item, index) =>
            index === assistantIndex
              ? {
                  ...item,
                  text: finalText,
                }
              : item
          )
        );
      }

      if (!finalText.trim()) {
        setMessages((current) =>
          current.map((item, index) =>
            index === assistantIndex
              ? {
                  ...item,
                  text: isArabic
                    ? "لم أستطع كتابة إجابة الآن. حاول مرة أخرى."
                    : "I could not write an answer right now. Please try again.",
                }
              : item
          )
        );
      }
    } catch {
      setMessages((current) =>
        current.map((item, index) =>
          index === assistantIndex
            ? {
                ...item,
                text: isArabic
                  ? "تعذر الاتصال الآن. حاول مرة أخرى بعد قليل."
                  : "Connection failed right now. Please try again shortly.",
              }
            : item
        )
      );
    } finally {
      setSending(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-5 right-5 z-[9999] inline-flex items-center gap-2 rounded-full bg-ink px-5 py-4 text-sm font-bold text-bone shadow-2xl transition hover:-translate-y-1 hover:bg-thread"
      >
        <MessageCircle size={20} />
        {isArabic ? "اسأل مساعد هيكل" : "Ask Hekal AI"}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-5 z-[9999] w-[calc(100vw-2.5rem)] max-w-md overflow-hidden rounded-[2rem] border border-ink/10 bg-bone shadow-2xl"
            dir={isArabic ? "rtl" : "ltr"}
          >
            <div className="flex items-center justify-between gap-4 bg-ink px-5 py-4 text-bone">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bone text-ink">
                  <Bot size={20} />
                </div>

                <div>
                  <p className="text-sm font-bold">
                    {isArabic ? "مساعد هيكل" : "Hekal AI"}
                  </p>
                  <p className="text-xs text-bone/70">
                    {isArabic
                      ? "اسأل عن المقاسات، الألوان، والطلبات"
                      : "Ask about sizing, colors, and orders"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-bone/70 transition hover:bg-white/10 hover:text-bone"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[420px] space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((chatMessage, index) => (
                <div
                  key={`${chatMessage.role}-${index}`}
                  className={`flex ${
                    chatMessage.role === "user"
                      ? isArabic
                        ? "justify-start"
                        : "justify-end"
                      : isArabic
                        ? "justify-end"
                        : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-3xl px-4 py-3 text-sm leading-6 ${
                      chatMessage.role === "user"
                        ? "bg-thread text-bone"
                        : "border border-ink/10 bg-white text-charcoal"
                    }`}
                  >
                    {chatMessage.text ||
                      (chatMessage.role === "assistant" && sending
                        ? isArabic
                          ? "يكتب..."
                          : "Typing..."
                        : "")}
                  </div>
                </div>
              ))}

              {sending && (
                <div className="text-center text-[11px] text-charcoal/40">
                  {isArabic ? "مساعد هيكل يكتب..." : "Hekal AI is typing..."}
                </div>
              )}
            </div>

            <div className="border-t border-ink/10 px-4 py-3">
              <div className="mb-3 flex flex-wrap gap-2">
                {quickQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => void sendMessage(question)}
                    className="rounded-full border border-ink/10 bg-white px-3 py-2 text-xs font-semibold text-charcoal/70 transition hover:border-thread hover:text-thread"
                  >
                    {question}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  ref={inputRef}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder={
                    isArabic ? "اكتب سؤالك هنا..." : "Write your question here..."
                  }
                  className="min-w-0 flex-1 rounded-full border border-ink/20 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-charcoal/35 focus:border-thread"
                />

                <button
                  type="submit"
                  disabled={sending || !message.trim()}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-ink text-bone transition hover:bg-thread disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {sending ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </form>

              <p className="mt-3 text-center text-[11px] leading-5 text-charcoal/45">
                {isArabic
                  ? "المساعد يساعدك في الاختيار، لكن التفاصيل النهائية يتم تأكيدها من هيكل."
                  : "The assistant helps you choose, but final order details are confirmed by Hekal."}
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}