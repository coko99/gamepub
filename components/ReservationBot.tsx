"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, X } from "lucide-react";
import {
  botSteps,
  buildReservationMessage,
  initialAnswers,
  mapChannelChoice,
  reservationBotContent,
  type ReservationAnswers,
} from "@/content/reservationBot";
import {
  handoffToViber,
  handoffToWhatsApp,
  hasMessagingNumber,
} from "@/lib/reservationHandoff";
import { useMounted } from "@/hooks/useMounted";
import { BotOrbitTrigger } from "./floating/BotOrbitTrigger";

type ChatEntry = {
  id: string;
  from: "bot" | "user";
  text: string;
};

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function ViberIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12.04 2c-5.03.03-9.08 4.1-9.1 9.12-.02 1.61-.05 4.62 2.94 5.48l-.03 1.73s-.03.79.49.95c.63.2 1-.41 1.6-1.05.33-.36.79-.88 1.14-1.27 3.14 1.31 5.55 1 5.55 1 2.05-.6 3.74-2.49 3.99-5.29.03-.28 1.02-6.89-3.05-8.15 0 0-1.08-.42-2.92-.43h-.01zm.05 1.8c1.6.01 2.62.37 2.62.37 2.48.97 2.48 6.66 2.45 6.87-.2 2.26-1.45 3.77-3.11 4.25-.04.01-1.99.35-4.62-.8 0 0-1.99 2.34-2.55 2.75-.35.29-.83.31-.83.31l-.01-2.92c-3.47-1.15-3.41-3.73-3.35-5.08.05-1.53.48-3.36 1.67-4.53 1.55-1.51 4.66-1.02 6.24-1.02h.49zm-1.2 3.6a1.05 1.05 0 00-1.05 1.05c0 .58.47 1.05 1.05 1.05s1.05-.47 1.05-1.05a1.05 1.05 0 00-1.05-1.05zm3.6 0a1.05 1.05 0 00-1.05 1.05c0 .58.47 1.05 1.05 1.05s1.05-.47 1.05-1.05a1.05 1.05 0 00-1.05-1.05zm-1.8 2.1a3.15 3.15 0 00-3.15 3.15 3.15 3.15 0 003.15 3.15 3.15 3.15 0 003.15-3.15 3.15 3.15 0 00-3.15-3.15z" />
    </svg>
  );
}

function getBotMessage(stepIndex: number, answers: ReservationAnswers) {
  const step = botSteps[stepIndex];
  if (!step) return "";
  return typeof step.botMessage === "function"
    ? step.botMessage(answers)
    : step.botMessage;
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ReservationBot({
  open: openProp,
  onOpenChange,
  showTrigger = true,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
} = {}) {
  const mounted = useMounted();
  const [openInternal, setOpenInternal] = useState(false);
  const open = openProp ?? openInternal;

  const setOpen = useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      const current = openProp ?? openInternal;
      const next = typeof value === "function" ? value(current) : value;
      if (openProp === undefined) setOpenInternal(next);
      onOpenChange?.(next);
    },
    [openProp, openInternal, onOpenChange],
  );
  const [canOrbit, setCanOrbit] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<ReservationAnswers>(initialAnswers);
  const [messages, setMessages] = useState<ChatEntry[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viberNotice, setViberNotice] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentStep = botSteps[stepIndex];
  const isDone = currentStep?.id === "summary";
  const canConfigureHandoff = hasMessagingNumber();
  const docked = showTrigger ? open || !canOrbit : true;

  useEffect(() => {
    setCanOrbit(
      typeof CSS !== "undefined" && CSS.supports("offset-path", "inset(0)"),
    );
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, []);

  const pushMessage = useCallback(
    (from: "bot" | "user", text: string) => {
      setMessages((prev) => [...prev, { id: uid(), from, text }]);
    },
    [],
  );

  const pushBotMessage = useCallback(
    (text: string, nextStepIndex?: number) => {
      setTyping(true);
      window.setTimeout(() => {
        pushMessage("bot", text);
        setTyping(false);
        if (nextStepIndex !== undefined) setStepIndex(nextStepIndex);
        scrollToBottom();
      }, 650);
    },
    [pushMessage, scrollToBottom],
  );

  const resetChat = useCallback(() => {
    setStepIndex(0);
    setAnswers(initialAnswers());
    setMessages([]);
    setInput("");
    setError(null);
    setViberNotice(false);
    window.setTimeout(() => {
      pushBotMessage(getBotMessage(0, initialAnswers()), 0);
    }, 200);
  }, [pushBotMessage]);

  useEffect(() => {
    if (!open || messages.length > 0) return;
    pushBotMessage(getBotMessage(0, initialAnswers()), 0);
  }, [open, messages.length, pushBotMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing, scrollToBottom]);

  useEffect(() => {
    if (open && currentStep?.input === "text") {
      inputRef.current?.focus();
    }
  }, [open, stepIndex, currentStep?.input]);

  const advanceAfterAnswer = useCallback(
    (updated: ReservationAnswers) => {
      const nextIndex = stepIndex + 1;
      if (nextIndex >= botSteps.length) return;

      const nextStep = botSteps[nextIndex];
      pushBotMessage(getBotMessage(nextIndex, updated), nextIndex);
    },
    [pushBotMessage, stepIndex],
  );

  const applyAnswer = useCallback(
    (rawValue: string) => {
      if (!currentStep) return;

      const value = rawValue.trim();
      setError(null);

      if (currentStep.id === "notes" && !value) {
        pushMessage("user", "Nema dodatnih napomena");
        advanceAfterAnswer({ ...answers, notes: "" });
        return;
      }

      if (currentStep.validate) {
        const validationError = currentStep.validate(value);
        if (validationError) {
          setError(validationError);
          return;
        }
      }

      let updated = { ...answers };

      if (currentStep.field === "channel") {
        const channel = mapChannelChoice(value);
        if (!channel) {
          setError("Izaberi WhatsApp ili Viber.");
          return;
        }
        updated.channel = channel;
        pushMessage("user", value);
        advanceAfterAnswer(updated);
        setAnswers(updated);
        return;
      }

      if (currentStep.field) {
        updated = { ...updated, [currentStep.field]: value };
        pushMessage("user", value);
        setAnswers(updated);
        advanceAfterAnswer(updated);
      }
    },
    [advanceAfterAnswer, answers, currentStep, pushMessage],
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim() || typing || isDone) return;
    applyAnswer(input);
    setInput("");
  };

  const handleChoice = (choice: string) => {
    if (typing || isDone) return;
    applyAnswer(choice);
  };

  const handleHandoff = async () => {
    const text = buildReservationMessage(answers);
    if (!canConfigureHandoff) return;

    if (answers.channel === "whatsapp") {
      handoffToWhatsApp(text);
      return;
    }

    setViberNotice(true);
    await handoffToViber(text);
  };

  if (!mounted) return null;

  const toggleOpen = () => setOpen((value) => !value);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            className="fixed right-5 bottom-[7.5rem] z-[60] flex w-[min(100vw-2.5rem,22rem)] flex-col overflow-hidden rounded-2xl border border-[#00E5FF]/25 bg-[#080816]/95 shadow-[0_0_40px_rgba(0,229,255,0.2)] backdrop-blur-xl sm:w-96 md:right-8 md:bottom-[8.5rem]"
          >
            <div className="relative border-b border-white/10 bg-gradient-to-r from-[#6C2DFF]/30 to-[#00E5FF]/20 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#6C2DFF] to-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.4)]">
                  <Bot className="h-6 w-6 text-white" />
                  <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#25D366] shadow-[0_0_8px_#25D366]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-heading truncate text-sm font-bold text-white">
                    {reservationBotContent.name}
                  </p>
                  <p className="text-xs text-[#B8B8C8]">
                    {reservationBotContent.tagline}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1.5 text-[#B8B8C8] transition-colors hover:bg-white/10 hover:text-white"
                  aria-label={reservationBotContent.closeLabel}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div
              ref={scrollRef}
              className="flex max-h-[min(50vh,22rem)] flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      message.from === "user"
                        ? "rounded-br-md bg-gradient-to-r from-[#6C2DFF] to-[#2F6BFF] text-white"
                        : "rounded-bl-md border border-white/10 bg-[#101024] text-[#E8E8F0]"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md border border-white/10 bg-[#101024] px-4 py-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((dot) => (
                        <motion.span
                          key={dot}
                          className="h-1.5 w-1.5 rounded-full bg-[#00E5FF]"
                          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                          transition={{
                            duration: 0.9,
                            repeat: Infinity,
                            delay: dot * 0.15,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-white/10 px-4 py-3">
              {isDone ? (
                <div className="space-y-2">
                  {!canConfigureHandoff ? (
                    <p className="text-center text-xs text-[#B8B8C8]">
                      {reservationBotContent.noPhoneConfigured}
                    </p>
                  ) : (
                    <>
                      {viberNotice && answers.channel === "viber" && (
                        <p className="text-center text-xs text-[#00E5FF]">
                          {reservationBotContent.viberCopied}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={handleHandoff}
                        className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] ${
                          answers.channel === "whatsapp"
                            ? "bg-gradient-to-r from-[#25D366] to-[#00E5FF] shadow-[0_0_20px_rgba(37,211,102,0.35)]"
                            : "bg-gradient-to-r from-[#7360F2] to-[#6C2DFF] shadow-[0_0_20px_rgba(115,96,242,0.35)]"
                        }`}
                      >
                        {answers.channel === "whatsapp" ? (
                          <WhatsAppIcon className="h-5 w-5" />
                        ) : (
                          <ViberIcon className="h-5 w-5" />
                        )}
                        {answers.channel === "whatsapp"
                          ? reservationBotContent.handoffWhatsapp
                          : reservationBotContent.handoffViber}
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={resetChat}
                    className="w-full py-1.5 text-xs text-[#B8B8C8] transition-colors hover:text-[#00E5FF]"
                  >
                    {reservationBotContent.restart}
                  </button>
                </div>
              ) : currentStep?.input === "choices" && currentStep.choices ? (
                <div className="flex flex-wrap gap-2">
                  {currentStep.choices.map((choice) => (
                    <button
                      key={choice}
                      type="button"
                      disabled={typing}
                      onClick={() => handleChoice(choice)}
                      className="rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/10 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:border-[#00E5FF]/60 hover:bg-[#00E5FF]/20 disabled:opacity-50"
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              ) : currentStep?.input === "date" ? (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (!input) {
                      setError("Izaberi datum.");
                      return;
                    }
                    applyAnswer(input);
                    setInput("");
                  }}
                  className="space-y-2"
                >
                  <input
                    type="date"
                    value={input}
                    onChange={(event) => {
                      setInput(event.target.value);
                      setError(null);
                    }}
                    className="w-full rounded-xl border border-white/10 bg-[#050510]/80 px-3 py-2.5 text-sm text-white outline-none focus:border-[#00E5FF]/50"
                  />
                  {error && <p className="text-xs text-[#FF6B6B]">{error}</p>}
                  <button
                    type="submit"
                    disabled={typing}
                    className="w-full rounded-xl bg-gradient-to-r from-[#6C2DFF] to-[#00E5FF] py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {reservationBotContent.send}
                  </button>
                </form>
              ) : currentStep?.input === "none" && stepIndex === 0 ? (
                <button
                  type="button"
                  disabled={typing}
                  onClick={() => advanceAfterAnswer(answers)}
                  className="w-full rounded-xl bg-gradient-to-r from-[#6C2DFF] to-[#00E5FF] py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Kreni 🚀
                </button>
              ) : currentStep?.input === "text" || currentStep?.input === "tel" ? (
                <form onSubmit={handleSubmit} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type={currentStep.input === "tel" ? "tel" : "text"}
                      value={input}
                      onChange={(event) => {
                        setInput(event.target.value);
                        setError(null);
                      }}
                      placeholder={reservationBotContent.placeholder}
                      disabled={typing}
                      className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#050510]/80 px-3 py-2.5 text-sm text-white placeholder:text-[#B8B8C8]/50 outline-none focus:border-[#00E5FF]/50"
                    />
                    <button
                      type="submit"
                      disabled={typing || !input.trim()}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#6C2DFF] to-[#00E5FF] text-white disabled:opacity-40"
                      aria-label={reservationBotContent.send}
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                  {currentStep.id === "notes" && (
                    <button
                      type="button"
                      onClick={() => applyAnswer("")}
                      className="text-xs text-[#B8B8C8] hover:text-[#00E5FF]"
                    >
                      {reservationBotContent.skip}
                    </button>
                  )}
                  {error && <p className="text-xs text-[#FF6B6B]">{error}</p>}
                </form>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showTrigger &&
        (docked ? (
          <BotOrbitTrigger open={open} onClick={toggleOpen} docked />
        ) : (
          <BotOrbitTrigger open={open} onClick={toggleOpen} docked={false} />
        ))}
    </>
  );
}
