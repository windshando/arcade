"use client";

import React, { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { User, Send, CircleDot, MessageCircle } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';

export default function AdminChatPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [agentName, setAgentName] = useState("Customer Support");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectedSessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    selectedSessionIdRef.current = selectedSessionId;
  }, [selectedSessionId]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/admin/chat/sessions`, {
      headers: { Authorization: `Bearer ${document.cookie.split('admin_token=')[1]?.split(';')[0] || ''}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setSessions(Array.isArray(data) ? data : []);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const newSocket = io(WS_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("joinAdmin", {});
    });

    newSocket.on("newSession", (session: any) => {
      if (Notification.permission === "granted") {
        new Notification("New Live Chat Started!", { body: session.email || session.ipAddress });
      }
      setSessions((prev) => {
        const exists = prev.find(s => s.id === session.id);
        if (exists) return prev.map(s => s.id === session.id ? session : s);
        return [session, ...prev];
      });
    });

    newSocket.on("sessionUpdated", (session: any) => {
      setSessions((prev) => prev.map(s => s.id === session.id ? session : s));
    });

    newSocket.on("newMessage", (msg: any) => {
      setMessages((prev) => {
        return [...prev, msg];
      });

      setSessions((prev) => prev.map(s => {
        if (s.id === msg.sessionId) {
          return { ...s, messages: [msg] };
        }
        return s;
      }));
      
      if (msg.senderType === 'VISITOR' && Notification.permission === "granted") {
        if (msg.sessionId !== selectedSessionIdRef.current) {
          new Notification("New Chat Message", { body: msg.content });
        }
      }
    });

    if (Notification.permission !== "denied") {
      Notification.requestPermission();
    }

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!selectedSessionId) return;
    
    fetch(`${API_BASE_URL}/admin/chat/sessions/${selectedSessionId}/messages`, {
      headers: { Authorization: `Bearer ${document.cookie.split('admin_token=')[1]?.split(';')[0] || ''}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages(data || []);
      })
      .catch(console.error);
      
    if (socket) {
       socket.emit("joinAdmin", { sessionId: selectedSessionId });
    }
  }, [selectedSessionId, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !socket || !selectedSessionId) return;
    socket.emit("sendMessage", {
      sessionId: selectedSessionId,
      senderType: "ADMIN",
      senderName: agentName,
      content: inputValue,
    });
    setInputValue("");
  };

  const selectedSession = sessions.find(s => s.id === selectedSessionId);

  return (
    <div className="flex h-full bg-slate-50 font-sans">
      <div className="w-1/3 border-r border-slate-200 bg-white flex flex-col">
        <div className="p-5 border-b border-slate-100 flex flex-col bg-white z-10 gap-3">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-800">Shared Inbox</h2>
            <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full font-semibold">
              {sessions.length} Active
            </span>
          </div>
          <div>
             <input type="text" value={agentName} onChange={e => setAgentName(e.target.value)} className="w-full text-xs font-medium px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Agent Name" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-2">
          {sessions.map((sess) => {
            const isSelected = sess.id === selectedSessionId;
            const lastMsg = sess.messages && sess.messages.length > 0 ? sess.messages[0].content : "No messages yet";
            return (
              <div 
                key={sess.id} 
                onClick={() => setSelectedSessionId(sess.id)}
                className={`p-4 rounded-xl cursor-pointer transition-all border ${isSelected ? 'border-blue-200 bg-blue-50 shadow-sm' : 'border-transparent hover:bg-slate-50'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                      <User size={18} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">{sess.visitorName || sess.email || "Anonymous Visitor"}</h4>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mt-0.5 uppercase tracking-wider font-medium">
                        <CircleDot size={8} className={sess.status === 'ACTIVE' ? "text-green-500" : "text-slate-300"} />
                        <span>{sess.deviceInfo || sess.ipAddress}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-500 truncate mt-2 w-full">{lastMsg}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedSessionId && selectedSession ? (
          <>
            <div className="h-20 border-b border-slate-200 bg-white flex items-center px-8 justify-between shadow-sm z-10">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200">
                  <User size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{selectedSession.visitorName || selectedSession.email || "Anonymous Visitor"}</h3>
                  <p className="text-xs text-slate-500 font-medium">Session Tracker: {selectedSession.id}</p>
                </div>
              </div>
              <div className="flex gap-2">
                 <button className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors">
                   Resolve Ticket
                 </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50">
              {messages.map((msg, idx) => {
                const isAdmin = msg.senderType === 'ADMIN';
                return (
                  <div key={idx} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'} mb-3`}>
                    {msg.senderName && (
                       <span className="text-[11px] text-slate-400 font-medium mb-1 px-2">{msg.senderName}</span>
                    )}
                    <div className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'} max-w-[65%]`}>
                      <div className={`px-6 py-3.5 rounded-2xl shadow-sm text-[15px] leading-relaxed ${isAdmin ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'}`}>
                        {msg.content}
                      </div>
                      <span className="text-[10px] font-medium text-slate-400 mt-1.5 px-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-6 bg-white border-t border-slate-200">
              <form onSubmit={handleSend} className="relative flex items-center shadow-sm rounded-2xl border border-slate-300 bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all overflow-hidden">
                <input
                  type="text"
                  placeholder="Type your reply to the customer..."
                  className="w-full bg-transparent border-none py-4 pl-5 pr-16 text-[15px] focus:outline-none"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <button type="submit" disabled={!inputValue.trim()} className="absolute right-2 p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors flex items-center justify-center shadow-sm">
                  <Send size={18} className="translate-x-[1px]" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
            <MessageCircle size={80} className="mb-6 text-slate-200" />
            <h3 className="text-2xl font-bold text-slate-700">No Chat Selected</h3>
            <p className="text-base mt-2 text-slate-500 font-medium">Select a session from the inbox to start responding.</p>
          </div>
        )}
      </div>
    </div>
  );
}
