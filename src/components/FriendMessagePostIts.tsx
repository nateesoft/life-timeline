'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';

interface FriendMessage {
  id: number;
  message: string;
  fromName: string;
  fromAvatar: string;
  position: { x: number; y: number };
  createdAt: string;
}

interface FriendMessagePostItsProps {
  friendMessages: FriendMessage[];
  draggedMessage: number | null;
  handleMessageMouseDown: (e: React.MouseEvent, message: FriendMessage) => void;
  removeFriendMessage: (id: number) => void;
}

export default function FriendMessagePostIts({ 
  friendMessages, 
  draggedMessage, 
  handleMessageMouseDown, 
  removeFriendMessage 
}: FriendMessagePostItsProps) {
  return (
    <>
      {friendMessages.map((message) => (
        <div
          key={message.id}
          className="absolute z-40 select-none message-post-it-container"
          style={{
            left: `${message.position.x}px`,
            top: `${message.position.y}px`,
            cursor: draggedMessage === message.id ? 'grabbing' : 'grab'
          }}
        >
          <div 
            className="group p-4 rounded-lg shadow-lg transform rotate-2 hover:rotate-0 transition-all duration-200 hover:shadow-xl min-w-[220px] max-w-[280px] relative"
            style={{ backgroundColor: '#DBEAFE' }} // น้ำเงินอ่อน
            onMouseDown={(e) => handleMessageMouseDown(e, message)}
          >
            {/* Tape pieces for friend messages */}
            <div className="absolute -top-2 left-4 w-9 h-5 bg-gray-200/80 dark:bg-gray-300/80 rounded-sm transform -rotate-12 shadow-md z-10 transition-all duration-200 group-hover:shadow-lg border border-gray-300/50">
              <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-black/10 rounded-sm"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-sm"></div>
              <div className="absolute top-0.5 left-1 w-6 h-0.5 bg-white/40 rounded-full"></div>
              <div className="absolute bottom-0.5 right-1 w-4 h-0.5 bg-gray-400/30 rounded-full"></div>
            </div>
            
            <div className="absolute -top-2 right-4 w-9 h-5 bg-gray-200/80 dark:bg-gray-300/80 rounded-sm transform rotate-12 shadow-md z-10 transition-all duration-200 group-hover:shadow-lg border border-gray-300/50">
              <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-black/10 rounded-sm"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-sm"></div>
              <div className="absolute top-0.5 left-1 w-6 h-0.5 bg-white/40 rounded-full"></div>
              <div className="absolute bottom-0.5 right-1 w-4 h-0.5 bg-gray-400/30 rounded-full"></div>
            </div>

            {/* Message header with avatar and name */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="text-2xl bg-white rounded-full p-1 shadow-sm">
                  {message.fromAvatar}
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 text-sm">{message.fromName}</h4>
                  <div className="text-xs text-blue-600">แปะข้อความมา</div>
                </div>
              </div>
              <button
                onClick={() => removeFriendMessage(message.id)}
                className="text-blue-500 hover:text-red-500 transition-colors flex-shrink-0 opacity-70 hover:opacity-100"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>

            {/* Message content */}
            <div className="bg-white/50 rounded-lg p-3 mb-2">
              <p className="text-blue-900 text-sm leading-relaxed">{message.message}</p>
            </div>

            {/* Message timestamp */}
            <div className="flex justify-end text-xs text-blue-600 opacity-75">
              {new Date(message.createdAt).toLocaleDateString('th-TH', {
                day: 'numeric',
                month: 'short'
              })}
            </div>

            {/* Post-it shadow effect */}
            <div className="absolute inset-0 bg-black/10 rounded-lg transform translate-x-0.5 translate-y-0.5 -z-20"></div>
            
            {/* Tape shadows on the post-it surface */}
            <div className="absolute -top-1 left-5 w-6 h-2 bg-black/5 rounded-sm transform -rotate-12 blur-sm"></div>
            <div className="absolute -top-1 right-5 w-6 h-2 bg-black/5 rounded-sm transform rotate-12 blur-sm"></div>
          </div>
        </div>
      ))}
    </>
  );
}