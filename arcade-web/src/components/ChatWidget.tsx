"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { MessageCircle, X, Send, User } from "lucide-react";

export default function ChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isAgentOnline, setIsAgentOnline] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';
    const newSocket = io(wsUrl);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      let deviceId = localStorage.getItem("deviceId");
      if (!deviceId) {
        deviceId = Math.random().toString(36).substring(7);
        localStorage.setItem("deviceId", deviceId);
      }
      newSocket.emit("startSession", { deviceInfo: "Browser-" + deviceId }, (response: any) => {
        if (response?.data) {
          setSession(response.data);
          if (response.data.messages) {
            setMessages(response.data.messages);
          }
        }
      });
    });

    newSocket.on("sessionStarted", (data: any) => {
       setSession(data);
    });
    
    newSocket.on("agentStatus", (data: { isOnline: boolean }) => {
       setIsAgentOnline(data.isOnline);
    });
    
    newSocket.on("emailSet", (data: any) => {
       setSession(data);
    });

    newSocket.on("newMessage", (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !socket || !session) return;
    socket.emit("sendMessage", {
      sessionId: session.id,
      senderType: "VISITOR",
      senderName: name || "Visitor",
      content: inputValue,
    });
    setInputValue("");
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim() || !socket || !session) return;
    socket.emit("setEmail", { sessionId: session.id, email, name });
  };

  if (pathname.includes('/admin')) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {isOpen ? (
        <div className="w-80 h-[26rem] bg-surface-elevated/70 backdrop-blur-xl border border-border-subtle shadow-xl rounded-2xl flex flex-col overflow-hidden text-foreground transition-all animate-slide-up">
          {/* Header */}
          <div className="bg-primary text-on-dark px-4 py-3 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm tracking-wide">Customer Support</h3>
              {isAgentOnline && (
                <span className="text-[10px] font-bold bg-success text-white px-1.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse flex items-center gap-1.5">
                  Available Now
                </span>
              )}
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:opacity-70 transition-opacity">
              <X size={18} />
            </button>
          </div>

          {!session?.email ? (
            /* Email Capture State */
            <div className="flex-1 flex flex-col p-6 items-center justify-center text-center">
              <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-full flex items-center text-primary justify-center mb-4">
                <User size={24} />
              </div>
              <h4 className="font-medium text-foreground mb-2">Welcome!</h4>
              <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                {isAgentOnline 
                  ? "Before we start, please enter your details so we can follow up."
                  : "All agents are offline. Leave a message and we'll email you back."}
              </p>
              <form onSubmit={handleDetailsSubmit} className="w-full flex flex-col space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  className="w-full px-4 py-2 border border-border-subtle bg-background shadow-inner rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 border border-border-subtle bg-background shadow-inner rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className="w-full btn-primary text-sm shadow-sm">
                  Start Chat
                </button>
              </form>
            </div>
          ) : (
            /* Chatting State */
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background/50">
                <p className="text-center text-xs text-text-tertiary mt-2 mb-4">
                  {isAgentOnline 
                    ? "Chat Started. We usually reply in a few minutes."
                    : "Message Sent. An agent will follow up via email."}
                </p>
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex flex-col ${msg.senderType === 'VISITOR' ? 'items-end' : 'items-start'} mb-2`}>
                    {msg.senderName && (
                      <span className="text-[10px] text-text-tertiary mb-1 px-1">{msg.senderName}</span>
                    )}
                    <div className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm shadow-sm ${msg.senderType === 'VISITOR' ? 'bg-primary text-on-dark rounded-br-sm' : 'bg-surface-elevated border border-border-subtle text-foreground rounded-bl-sm'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSend} className="p-3 border-t border-border-subtle bg-surface-elevated/90 backdrop-blur-md">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full pl-4 pr-12 py-2.5 bg-background border border-border-subtle rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <button type="submit" className="absolute right-1.5 p-2 bg-primary text-on-dark rounded-full hover:bg-primary-hover transition flex items-center justify-center">
                    <Send size={14} className="ml-0.5" />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 border relative
            ${isAgentOnline ? 'bg-primary hover:bg-primary-hover text-on-dark border-primary' : 'bg-surface-elevated hover:bg-border-subtle text-foreground border-border-subtle'}
          `}
        >
          <MessageCircle size={26} />
          {isAgentOnline && (
            <div className="absolute top-0 right-0 w-4 h-4 bg-success border-2 border-white rounded-full" />
          )}
        </button>
      )}
    </div>
  );
}
