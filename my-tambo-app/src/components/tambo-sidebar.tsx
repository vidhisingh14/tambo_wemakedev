"use client";

import {
  MessageInput,
  MessageInputSubmitButton,
  MessageInputTextarea,
  MessageInputToolbar,
} from "@/components/tambo/message-input";
import { ScrollableMessageContainer } from "@/components/tambo/scrollable-message-container";
import {
  ThreadContent,
  ThreadContentMessages,
} from "@/components/tambo/thread-content";
import { ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { useState } from "react";

export function TamboSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Overlay backdrop when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-screen bg-white dark:bg-[#101413] border-l border-gray-200 dark:border-[#22493c]/50 transition-all duration-300 z-50 flex flex-col ${
          isOpen ? "w-full sm:w-96" : "w-0"
        }`}
      >
        {isOpen && (
          <>
            <div className="p-4 border-b border-gray-200 dark:border-[#22493c]/50 flex items-center justify-between bg-gradient-to-r from-[#1c2624] to-[#131a18]">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#0df2a6]" />
                <h2 className="text-lg font-semibold text-white">
                  Tambo Assistant
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-[#22493c]/30 rounded transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <ScrollableMessageContainer className="flex-1 p-4">
              <ThreadContent variant="default">
                <ThreadContentMessages />
              </ThreadContent>
            </ScrollableMessageContainer>

            <div className="p-4 border-t border-gray-200 dark:border-[#22493c]/50 bg-[#1c2624]">
              <MessageInput variant="bordered">
                <MessageInputTextarea placeholder="Ask Tambo anything..." />
                <MessageInputToolbar>
                  <MessageInputSubmitButton />
                </MessageInputToolbar>
              </MessageInput>
            </div>
          </>
        )}
      </div>

      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed right-4 bottom-4 bg-[#0df2a6] hover:bg-[#0bbd82] text-[#101413] p-4 rounded-full shadow-lg transition-all z-40 flex items-center gap-2 group"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-semibold">
            Ask Tambo
          </span>
        </button>
      )}
    </>
  );
}
