'use client';

import {
  ArrowUpRight,
  Bot,
  Check,
  Copy,
  Download,
  Maximize2,
  MessageCircle,
  Mic,
  Minimize2,
  RotateCcw,
  Send,
  Sparkles,
  Square,
  Volume2,
  X,
} from 'lucide-react';
import {
  type KeyboardEvent,
  type SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { guidedPresenceAnswer } from '@/lib/presence-assistant-guided';
import styles from './presence-assistant.module.css';

const STORAGE_KEY = 'nexteleven-presence-assistant-v1';
const MAX_STORED_MESSAGES = 12;
const MAX_INPUT_LENGTH = 800;

type MessageSource = 'system' | 'live' | 'guided';

type ConversationMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  source?: MessageSource;
  action?: {
    label: string;
    href: string;
  };
  streaming?: boolean;
  stopped?: boolean;
};

type AssistantStatus = 'checking' | 'live' | 'guided';

type RecognitionResultEvent = Event & {
  results: ArrayLike<{
    0: { transcript: string };
  }>;
};

type RecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: RecognitionResultEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type RecognitionConstructor = new () => RecognitionInstance;

const welcomeMessage: ConversationMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    'I’m the NextEleven Web Presence guide. I can compare engagement depths, explain the published commercial boundaries, explore connected capabilities, or direct you to the project brief.',
  createdAt: '',
  source: 'system',
};

const quickPrompts = [
  'Which build depth fits?',
  'Compare A / B / C',
  'Who owns the source?',
  'What can an assistant do?',
];

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatTime(value: string) {
  if (!value) return 'Now';
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return 'Now';
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function safeStoredMessages(value: unknown): ConversationMessage[] | null {
  if (!Array.isArray(value)) return null;
  const messages = value
    .filter((item): item is ConversationMessage => {
      if (!item || typeof item !== 'object') return false;
      const candidate = item as Partial<ConversationMessage>;
      return (
        (candidate.role === 'user' || candidate.role === 'assistant') &&
        typeof candidate.id === 'string' &&
        typeof candidate.content === 'string' &&
        candidate.content.length > 0 &&
        candidate.content.length <= 4_000 &&
        typeof candidate.createdAt === 'string'
      );
    })
    .slice(-MAX_STORED_MESSAGES)
    .map((message) => ({
      ...message,
      streaming: false,
      stopped: Boolean(message.stopped),
    }));
  return messages.length ? messages : null;
}

export function PresenceAssistant() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState<AssistantStatus>('checking');
  const [messages, setMessages] = useState<ConversationMessage[]>([
    welcomeMessage,
  ]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceAvailable, setVoiceAvailable] = useState(false);
  const [speechOutputAvailable, setSpeechOutputAvailable] = useState(false);
  const [copiedId, setCopiedId] = useState('');
  const [historyReady, setHistoryReady] = useState(false);

  const panelRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const recognitionRef = useRef<RecognitionInstance | null>(null);

  const checkStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/assistant', {
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });
      const result = (await response.json()) as { configured?: boolean };
      setStatus(response.ok && result.configured ? 'live' : 'guided');
    } catch {
      setStatus('guided');
    }
  }, []);

  useEffect(() => {
    const featureTimer = window.setTimeout(() => {
      void checkStatus();
      const speechWindow = window as Window & {
        SpeechRecognition?: RecognitionConstructor;
        webkitSpeechRecognition?: RecognitionConstructor;
      };
      setVoiceAvailable(
        Boolean(
          speechWindow.SpeechRecognition ??
          speechWindow.webkitSpeechRecognition,
        ),
      );
      setSpeechOutputAvailable('speechSynthesis' in window);

      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const restored = safeStoredMessages(JSON.parse(stored));
          if (restored) setMessages(restored);
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      } finally {
        setHistoryReady(true);
      }
    }, 0);

    return () => window.clearTimeout(featureTimer);
  }, [checkStatus]);

  useEffect(() => {
    if (!historyReady) return;
    try {
      const stored = messages
        .filter((message) => !message.streaming)
        .slice(-MAX_STORED_MESSAGES);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      // Conversation persistence is an enhancement, not a requirement.
    }
  }, [historyReady, messages]);

  useEffect(() => {
    if (!open || minimized) return;
    messageEndRef.current?.scrollIntoView({ block: 'nearest' });
  }, [messages, minimized, open]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    if (mobileQuery.matches) document.body.style.overflow = 'hidden';

    const timer = window.setTimeout(() => {
      (minimized ? panelRef.current : inputRef.current)?.focus();
    }, 80);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, [minimized, open]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
    };
  }, []);

  function showAssistant() {
    previousFocusRef.current = document.activeElement as HTMLElement;
    setOpen(true);
    setMinimized(false);
    void checkStatus();
  }

  function closeAssistant() {
    abortRef.current?.abort();
    recognitionRef.current?.stop();
    window.speechSynthesis?.cancel();
    setOpen(false);
    setMinimized(false);
    setExpanded(false);
    window.setTimeout(() => {
      (previousFocusRef.current ?? triggerRef.current)?.focus();
    }, 0);
  }

  function handlePanelKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeAssistant();
      return;
    }

    if (event.key !== 'Tab' || minimized) return;
    const focusable = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    ).filter((element) => !element.hasAttribute('hidden'));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function replaceMessage(id: string, update: Partial<ConversationMessage>) {
    setMessages((current) =>
      current.map((message) =>
        message.id === id ? { ...message, ...update } : message,
      ),
    );
  }

  function applyGuidedFallback(question: string, assistantId: string) {
    const guided = guidedPresenceAnswer(question);
    replaceMessage(assistantId, {
      content: guided.answer,
      source: 'guided',
      action: { label: guided.section, href: guided.href },
      streaming: false,
    });
  }

  async function sendPrompt(rawQuestion?: string) {
    const question = (rawQuestion ?? input).trim().slice(0, MAX_INPUT_LENGTH);
    if (!question || pending) return;

    const createdAt = new Date().toISOString();
    const userMessage: ConversationMessage = {
      id: makeId('user'),
      role: 'user',
      content: question,
      createdAt,
    };
    const assistantId = makeId('assistant');
    const assistantMessage: ConversationMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      createdAt,
      source: status === 'live' ? 'live' : 'guided',
      streaming: true,
    };
    const priorMessages = messages
      .filter((message) => message.id !== 'welcome' && message.content)
      .slice(-8)
      .map(({ role, content }) => ({ role, content }));

    setMessages((current) =>
      [...current, userMessage, assistantMessage].slice(
        -(MAX_STORED_MESSAGES + 1),
      ),
    );
    setInput('');
    setPending(true);

    const controller = new AbortController();
    abortRef.current = controller;
    let received = '';

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: {
          Accept: 'application/x-ndjson, application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...priorMessages, { role: 'user', content: question }],
        }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        const result = (await response.json().catch(() => ({}))) as {
          guided?: boolean;
        };
        if (response.status === 503 && result.guided) setStatus('guided');
        applyGuidedFallback(question, assistantId);
        return;
      }

      setStatus('live');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let upstreamError = false;
      let incomplete = false;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line) as {
            type?: 'delta' | 'done' | 'incomplete' | 'error';
            delta?: string;
          };
          if (event.type === 'delta' && typeof event.delta === 'string') {
            received += event.delta;
            replaceMessage(assistantId, {
              content: received,
              source: 'live',
              streaming: true,
            });
          }
          if (event.type === 'incomplete') incomplete = true;
          if (event.type === 'error') upstreamError = true;
        }
      }

      if (!received.trim()) {
        applyGuidedFallback(question, assistantId);
      } else {
        replaceMessage(assistantId, {
          content: `${received.trim()}${
            incomplete
              ? '\n\nThis answer reached its response limit. Ask a narrower follow-up to continue.'
              : upstreamError
                ? '\n\nThe live connection ended early. You can retry or use the project brief.'
                : ''
          }`,
          source: 'live',
          streaming: false,
        });
      }
    } catch {
      if (controller.signal.aborted) {
        replaceMessage(assistantId, {
          content: received.trim() || 'Generation stopped.',
          source: received ? 'live' : 'system',
          streaming: false,
          stopped: true,
        });
      } else {
        applyGuidedFallback(question, assistantId);
      }
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setPending(false);
      window.setTimeout(() => inputRef.current?.focus(), 0);
    }
  }

  function submitPrompt(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendPrompt();
  }

  function resetConversation() {
    abortRef.current?.abort();
    setMessages([{ ...welcomeMessage }]);
    setInput('');
    setPending(false);
    setCopiedId('');
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // A private browser may block local storage.
    }
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  async function copyText(text: string, feedbackId: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(feedbackId);
      window.setTimeout(() => setCopiedId(''), 1_600);
    } catch {
      setCopiedId('');
    }
  }

  function transcriptText() {
    return messages
      .map(
        (message) =>
          `${message.role === 'user' ? 'Visitor' : 'N°11'} — ${formatTime(message.createdAt)}\n${message.content}`,
      )
      .join('\n\n');
  }

  function downloadTranscript() {
    const blob = new Blob([transcriptText()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `nexteleven-conversation-${new Date().toISOString().slice(0, 10)}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function beginDictation() {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const speechWindow = window as Window & {
      SpeechRecognition?: RecognitionConstructor;
      webkitSpeechRecognition?: RecognitionConstructor;
    };
    const Recognition =
      speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!Recognition) return;

    const recognition = new Recognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim();
      if (transcript) {
        setInput((current) =>
          `${current}${current ? ' ' : ''}${transcript}`.slice(
            0,
            MAX_INPUT_LENGTH,
          ),
        );
      }
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    try {
      recognition.start();
    } catch {
      setListening(false);
    }
  }

  function speakMessage(message: ConversationMessage) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message.content);
    utterance.rate = 0.96;
    utterance.pitch = 0.92;
    window.speechSynthesis.speak(utterance);
  }

  function routeTo(href: string) {
    closeAssistant();
    window.setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
        block: 'start',
      });
    }, 80);
  }

  const statusLabel =
    status === 'live'
      ? 'OpenAI live'
      : status === 'guided'
        ? 'Guided knowledge mode'
        : 'Checking connection';

  return (
    <div className={styles.root} data-open={open || undefined}>
      {!open && (
        <button
          ref={triggerRef}
          className={styles.trigger}
          type="button"
          onClick={showAssistant}
          aria-haspopup="dialog"
          aria-expanded="false"
          aria-controls="presence-assistant"
        >
          <span className={styles.triggerSignal} aria-hidden="true">
            <i />
            <MessageCircle />
          </span>
          <span className={styles.triggerCopy}>
            <small>Interactive demo</small>
            <strong>ASK N°11</strong>
          </span>
          <ArrowUpRight aria-hidden="true" />
        </button>
      )}

      {open && (
        <dialog
          open
          id="presence-assistant"
          ref={panelRef}
          className={`${styles.panel} ${expanded ? styles.expanded : ''} ${minimized ? styles.minimized : ''}`}
          aria-modal="true"
          aria-labelledby="presence-assistant-title"
          aria-describedby="presence-assistant-disclosure"
          tabIndex={-1}
          onKeyDown={handlePanelKeyDown}
        >
          <div className={styles.ambient} aria-hidden="true">
            <i />
            <i />
            <i />
          </div>

          <header className={styles.header}>
            <div className={styles.identity}>
              <span className={styles.avatar} aria-hidden="true">
                <Bot />
                <i />
              </span>
              <span>
                <small>NextEleven presence intelligence</small>
                <strong id="presence-assistant-title">N°11 / Assistant</strong>
              </span>
            </div>
            <div className={styles.windowControls}>
              <button
                type="button"
                onClick={() => setMinimized((value) => !value)}
                aria-label={
                  minimized ? 'Restore assistant' : 'Minimize assistant'
                }
                title={minimized ? 'Restore' : 'Minimize'}
              >
                <Minimize2 aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setExpanded((value) => !value)}
                aria-label={expanded ? 'Restore panel size' : 'Expand panel'}
                aria-pressed={expanded}
                title={expanded ? 'Restore size' : 'Expand'}
              >
                <Maximize2 aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={closeAssistant}
                aria-label="Close assistant"
                title="Close"
              >
                <X aria-hidden="true" />
              </button>
            </div>
          </header>

          {!minimized && (
            <>
              <div className={styles.statusRail}>
                <span className={styles.status} data-mode={status}>
                  <i aria-hidden="true" /> {statusLabel}
                </span>
                <div
                  className={styles.capabilities}
                  aria-label="Demo capabilities"
                >
                  <span>Context</span>
                  <span>Voice</span>
                  <span>Export</span>
                  <span>Handoff</span>
                </div>
              </div>

              <div className={styles.toolbar}>
                <button
                  type="button"
                  onClick={resetConversation}
                  title="Start a new conversation"
                >
                  <RotateCcw aria-hidden="true" />
                  New
                </button>
                <button
                  type="button"
                  onClick={() => void copyText(transcriptText(), 'transcript')}
                  title="Copy conversation"
                >
                  {copiedId === 'transcript' ? (
                    <Check aria-hidden="true" />
                  ) : (
                    <Copy aria-hidden="true" />
                  )}
                  {copiedId === 'transcript' ? 'Copied' : 'Copy'}
                </button>
                <button
                  type="button"
                  onClick={downloadTranscript}
                  title="Download conversation"
                >
                  <Download aria-hidden="true" />
                  Export
                </button>
                <button
                  type="button"
                  className={styles.handoffButton}
                  onClick={() => routeTo('#contact')}
                >
                  Human handoff <ArrowUpRight aria-hidden="true" />
                </button>
              </div>

              <div
                className={styles.messages}
                role="log"
                aria-live="polite"
                aria-relevant="additions text"
              >
                {messages.map((message) => (
                  <article
                    key={message.id}
                    className={styles.message}
                    data-role={message.role}
                  >
                    <div className={styles.messageMeta}>
                      <span>
                        {message.role === 'assistant' ? 'N°11' : 'You'}
                        {message.source === 'live' && ' / AI'}
                        {message.source === 'guided' && ' / Guided'}
                      </span>
                      <time>{formatTime(message.createdAt)}</time>
                    </div>
                    <div className={styles.bubble}>
                      {message.streaming && !message.content ? (
                        <span
                          className={styles.thinking}
                          aria-label="N°11 is thinking"
                        >
                          <i />
                          <i />
                          <i />
                        </span>
                      ) : (
                        <p>{message.content}</p>
                      )}
                      {message.stopped && (
                        <small className={styles.stopped}>
                          Stopped by visitor
                        </small>
                      )}
                    </div>
                    {message.role === 'assistant' && message.content && (
                      <div className={styles.messageActions}>
                        <button
                          type="button"
                          onClick={() =>
                            void copyText(message.content, message.id)
                          }
                          aria-label="Copy this answer"
                        >
                          {copiedId === message.id ? (
                            <Check aria-hidden="true" />
                          ) : (
                            <Copy aria-hidden="true" />
                          )}
                          {copiedId === message.id ? 'Copied' : 'Copy'}
                        </button>
                        {speechOutputAvailable && (
                          <button
                            type="button"
                            onClick={() => speakMessage(message)}
                            aria-label="Listen to this answer"
                          >
                            <Volume2 aria-hidden="true" /> Listen
                          </button>
                        )}
                        {message.action && (
                          <button
                            type="button"
                            className={styles.messageLink}
                            onClick={() =>
                              routeTo(message.action?.href ?? '#contact')
                            }
                          >
                            {message.action.label}
                            <ArrowUpRight aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    )}
                  </article>
                ))}
                <div ref={messageEndRef} />
              </div>

              {messages.length <= 2 && (
                <div
                  className={styles.promptField}
                  aria-label="Suggested questions"
                >
                  <span>
                    <Sparkles aria-hidden="true" /> Explore the build
                  </span>
                  <div>
                    {quickPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        disabled={pending}
                        onClick={() => void sendPrompt(prompt)}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <form className={styles.composer} onSubmit={submitPrompt}>
                <label htmlFor="presence-assistant-input">
                  Ask about scope, pricing, ownership, or connected capability
                </label>
                <div>
                  <textarea
                    id="presence-assistant-input"
                    ref={inputRef}
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault();
                        if (!pending) void sendPrompt();
                      }
                    }}
                    placeholder="What should this site do for the business?"
                    rows={1}
                    maxLength={MAX_INPUT_LENGTH}
                    disabled={pending}
                  />
                  {voiceAvailable && (
                    <button
                      type="button"
                      className={styles.voiceButton}
                      data-listening={listening || undefined}
                      onClick={beginDictation}
                      disabled={pending}
                      aria-label={
                        listening ? 'Stop voice input' : 'Start voice input'
                      }
                      title={listening ? 'Stop listening' : 'Voice input'}
                    >
                      <Mic aria-hidden="true" />
                    </button>
                  )}
                  {pending ? (
                    <button
                      type="button"
                      className={styles.sendButton}
                      onClick={() => abortRef.current?.abort()}
                      aria-label="Stop generating"
                    >
                      <Square aria-hidden="true" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className={styles.sendButton}
                      disabled={!input.trim()}
                      aria-label="Send question"
                    >
                      <Send aria-hidden="true" />
                    </button>
                  )}
                </div>
                <small id="presence-assistant-disclosure">
                  {status === 'live'
                    ? 'AI-generated guidance grounded in NextEleven’s approved service information. Verify scope in writing.'
                    : 'Guided answers use approved NextEleven service information. Live AI is not connected on this host.'}{' '}
                  Share ordinary project context only—never secrets or payment
                  data.
                </small>
              </form>

              <output className={styles.srStatus} aria-live="polite">
                {pending ? 'N°11 is preparing an answer.' : ''}
              </output>
            </>
          )}
        </dialog>
      )}
    </div>
  );
}
