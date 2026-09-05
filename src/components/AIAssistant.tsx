/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, ShieldAlert, BookOpen, AlertTriangle, User, Bot, HelpCircle, Loader2, Mic } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AIAssistantProps {
  currentLang: string;
}

export default function AIAssistant({ currentLang }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-init',
      role: 'assistant',
      content: "Welcome to GIRMAIC HUMANITY AI. I can explain international human-rights, help you structure documentation for an incident safely, provide general legal guidelines (not legal advice), or help you find verified support. How may I serve your dignity and justice journey today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Speech Recognition initialization
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const isSpeechSupported = !!SpeechRecognitionAPI;

  useEffect(() => {
    if (!isSpeechSupported) return;

    const rec = new SpeechRecognitionAPI();
    rec.continuous = false;
    rec.interimResults = false;
    
    // Dynamically match dialect code
    rec.lang = currentLang === 'en' ? 'en-US' : 
               currentLang === 'fr' ? 'fr-FR' : 
               currentLang === 'ar' ? 'ar-SA' : 
               currentLang === 'am' ? 'am-ET' : 'en-US';

    rec.onstart = () => {
      setIsListening(true);
    };

    rec.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        setInputValue(prev => prev ? prev + ' ' + transcript : transcript);
      }
    };

    rec.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = rec;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, [currentLang, isSpeechSupported]);

  const toggleSpeech = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const suggestedPrompts = [
    'How do I document a rights violation safely?',
    'What rights are protected under UDHR Article 7?',
    'Explain structural oppression in simple terms.',
    'Where can I find legal aid support?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: `m-user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const chatHistory = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory, language: currentLang })
      });

      const data = await res.json();
      
      const botMsg: Message = {
        id: `m-bot-${Date.now()}`,
        role: 'assistant',
        content: data.content || "Something went wrong. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: `m-err-${Date.now()}`,
        role: 'assistant',
        content: "I apologize, but my connection to the secure server appears unstable. Your data draft remains fully safe locally. Please try again in a few moments.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[550px]" id="ai-assistant">
      {/* Assistant Header */}
      <div className="bg-slate-50 dark:bg-slate-950/45 border-b border-slate-200/50 dark:border-slate-800/50 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 rounded-xl">
            <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              GIRMAIC HUMANITY AI
            </h3>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online & Secure
            </span>
          </div>
        </div>

        {/* Info banner */}
        <div className="hidden sm:flex gap-1.5 text-amber-800 dark:text-amber-305 text-[9px] bg-amber-50 dark:bg-amber-950/20 p-2 rounded-lg border border-amber-200/40 max-w-xs">
          <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" />
          <span>Non-guilt determination mode. Safe documentation assistant.</span>
        </div>
      </div>

      {/* Messages Board */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/10">
        {messages.map((msg) => (
          <div
            key={msg.id}
            id={`message-${msg.id}`}
            className={`flex gap-3 max-w-lg ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            <div className={`p-2.5 rounded-xl text-xs leading-relaxed shadow-sm ${
              msg.role === 'user'
                ? 'bg-emerald-600 text-white font-medium rounded-tr-none'
                : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800 rounded-tl-none'
            }`}>
              {/* Message header/icon */}
              <div className="flex items-center gap-1.5 border-b border-current/10 pb-1 mb-1.5 text-[9px] opacity-70">
                {msg.role === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />}
                <span className="font-bold uppercase tracking-wider">{msg.role === 'user' ? 'You' : 'Girmaic AI'}</span>
                <span className="ml-auto">{msg.timestamp}</span>
              </div>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 max-w-lg" id="message-loader">
            <div className="bg-white dark:bg-slate-900 text-slate-405 border border-slate-100 dark:border-slate-800 p-3 rounded-xl rounded-tl-none text-xs flex items-center gap-2">
              <Loader2 className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400 animate-spin" />
              <span>Girmaic AI is analyzing details securely...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested chips if no message from user */}
      {messages.length === 1 && (
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-wrap gap-1.5">
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              id={`suggested-prompt-${idx}`}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 text-[10px] font-semibold text-slate-600 dark:text-slate-350 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-emerald-500 transition-all cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Tray */}
      <div className="p-3.5 bg-white dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800/50 flex gap-2">
        <input
          type="text"
          id="assistant-chat-input"
          placeholder="Ask a human-rights question or describe an incident to translate/summarize safely..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
        />
        {isSpeechSupported && (
          <button
            type="button"
            onClick={toggleSpeech}
            className={`p-2.5 rounded-xl transition-all border shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              isListening 
                ? 'bg-rose-500 border-rose-500 text-white animate-pulse shadow-sm' 
                : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-350 shadow-xs'
            }`}
            title={isListening ? "Listening... Click to stop speaking." : "Dictate your question using voice (Speech-to-Text)"}
            aria-label={isListening ? "Stop listening to voice dictation" : "Start voice dictation for message query"}
          >
            <Mic className="h-4 w-4" />
          </button>
        )}
        <button
          id="assistant-send-btn"
          onClick={() => handleSend()}
          disabled={!inputValue.trim() || loading}
          className={`p-2.5 rounded-xl transition-all border shrink-0 cursor-pointer ${
            (!inputValue.trim() || loading)
              ? 'bg-slate-150 border-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-550 shadow-sm'
          }`}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
