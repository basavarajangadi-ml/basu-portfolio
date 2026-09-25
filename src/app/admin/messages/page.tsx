"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { Mail, MailOpen, Trash2, Reply, Calendar, CheckCircle2, Loader2, Inbox } from "lucide-react";
import { portfolioService } from "@/lib/data/portfolioService";
import { ContactMessage } from "@/lib/supabase/types";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadMessages = async () => {
    setLoading(true);
    const data = await portfolioService.getContactMessages();
    setMessages(data);
    setLoading(false);
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    await portfolioService.markMessageAsRead(id);
    await loadMessages();
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setSaving(true);
    try {
      await portfolioService.deleteContactMessage(deletingId);
      setDeletingId(null);
      await loadMessages();
    } catch (err) {
      console.error("Delete message error", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <AdminHeader
        title="Contact Inquiries Inbox"
        subtitle="Review recruiter messages, technical inquiries, and collaboration requests submitted from the portfolio."
      />

      {loading ? (
        <div className="p-8 text-center text-cyan-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          <span className="text-xs">Loading contact messages...</span>
        </div>
      ) : messages.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl border border-white/10 text-center space-y-3">
          <Inbox className="w-12 h-12 mx-auto text-gray-600" />
          <h4 className="text-base font-bold text-white">Your Inbox is Empty</h4>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Messages sent through the contact form on your public portfolio will appear here in real time.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`glass-panel p-6 rounded-2xl border transition-all ${
                msg.is_read 
                  ? "border-white/10 bg-gray-900/30" 
                  : "border-cyan-500/40 bg-cyan-950/20 shadow-glow"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${msg.is_read ? "bg-gray-800 text-gray-400" : "bg-cyan-500/20 text-cyan-400"}`}>
                    {msg.is_read ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{msg.name}</span>
                      {!msg.is_read && (
                        <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          NEW
                        </span>
                      )}
                    </h3>
                    <a href={`mailto:${msg.email}`} className="text-xs text-cyan-400 hover:underline">
                      {msg.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-200">
                  Subject: <span className="font-normal text-white">{msg.subject}</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed bg-black/40 p-4 rounded-xl border border-white/5 whitespace-pre-wrap">
                  {msg.message}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-3 border-t border-white/10">
                <div>
                  {!msg.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(msg.id)}
                      className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark as Read</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600/20 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-600/30 transition-colors"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>Reply via Email</span>
                  </a>

                  <button
                    onClick={() => setDeletingId(msg.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Message"
        message="Are you sure you want to delete this inquiry from your inbox?"
        confirmText="Yes, Delete Message"
        isDanger={true}
        isLoading={saving}
      />
    </div>
  );
}
