'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';

interface Activity {
  id: number;
  name: string;
  description: string;
  displayType: 'daily' | 'weekly' | 'monthly' | 'yearly';
  color: string;
  backgroundColor: string;
  position: { x: number; y: number };
  createdAt: string;
}

interface ActivityPostItsProps {
  activities: Activity[];
  draggedActivity: number | null;
  handleActivityMouseDown: (e: React.MouseEvent, activity: Activity) => void;
  removeActivity: (id: number) => void;
}

export default function ActivityPostIts({ 
  activities, 
  draggedActivity, 
  handleActivityMouseDown, 
  removeActivity 
}: ActivityPostItsProps) {
  return (
    <>
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="absolute z-40 select-none post-it-container"
          style={{
            left: `${activity.position.x}px`,
            top: `${activity.position.y}px`,
            cursor: draggedActivity === activity.id ? 'grabbing' : 'grab'
          }}
        >
          <div 
            className="group p-4 rounded-lg shadow-lg transform rotate-1 hover:rotate-0 transition-all duration-200 hover:shadow-xl min-w-[200px] max-w-[250px] border-l-4 relative"
            style={{ 
              backgroundColor: activity.backgroundColor || '#FEF3C7',
              borderLeftColor: activity.color 
            }}
            onMouseDown={(e) => handleActivityMouseDown(e, activity)}
          >
            {/* Tape pieces */}
            {/* Top left tape */}
            <div className="absolute -top-2 left-4 w-9 h-5 bg-gray-200/80 dark:bg-gray-300/80 rounded-sm transform -rotate-12 shadow-md z-10 transition-all duration-200 group-hover:shadow-lg border border-gray-300/50">
              <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-black/10 rounded-sm"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-sm"></div>
              <div className="absolute top-0.5 left-1 w-6 h-0.5 bg-white/40 rounded-full"></div>
              <div className="absolute bottom-0.5 right-1 w-4 h-0.5 bg-gray-400/30 rounded-full"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJ0YXBlIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiPgogICAgICA8Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCN0YXBlKSIvPgo8L3N2Zz4=')] opacity-30 rounded-sm"></div>
            </div>
            
            {/* Top right tape */}
            <div className="absolute -top-2 right-4 w-9 h-5 bg-gray-200/80 dark:bg-gray-300/80 rounded-sm transform rotate-12 shadow-md z-10 transition-all duration-200 group-hover:shadow-lg border border-gray-300/50">
              <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-black/10 rounded-sm"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-sm"></div>
              <div className="absolute top-0.5 left-1 w-6 h-0.5 bg-white/40 rounded-full"></div>
              <div className="absolute bottom-0.5 right-1 w-4 h-0.5 bg-gray-400/30 rounded-full"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJ0YXBlIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiPgogICAgICA8Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCN0YXBlKSIvPgo8L3N2Zz4=')] opacity-30 rounded-sm"></div>
            </div>

            {/* Bottom corner tape (randomly appears on some notes) */}
            {activity.id % 3 === 0 && (
              <div className="absolute -bottom-1 right-2 w-7 h-4 bg-gray-200/80 dark:bg-gray-300/80 rounded-sm transform rotate-45 shadow-md z-10 transition-all duration-200 group-hover:shadow-lg border border-gray-300/50">
                <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-black/10 rounded-sm"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-sm"></div>
                <div className="absolute top-0.5 left-0.5 w-4 h-0.5 bg-white/40 rounded-full"></div>
              </div>
            )}

            {/* Left side tape (for some notes) */}
            {activity.id % 4 === 1 && (
              <div className="absolute -left-1 top-8 w-4 h-7 bg-gray-200/80 dark:bg-gray-300/80 rounded-sm transform rotate-90 shadow-md z-10 transition-all duration-200 group-hover:shadow-lg border border-gray-300/50">
                <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-black/10 rounded-sm"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-sm"></div>
                <div className="absolute top-1 left-0.5 w-5 h-0.5 bg-white/40 rounded-full"></div>
              </div>
            )}
            {/* Post-it header */}
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-gray-800 text-sm leading-tight pr-2">{activity.name}</h4>
              <button
                onClick={() => removeActivity(activity.id)}
                className="text-gray-500 hover:text-red-500 transition-colors flex-shrink-0"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>

            {/* Post-it description */}
            {activity.description && (
              <p className="text-gray-700 text-xs mb-2 leading-relaxed">{activity.description}</p>
            )}

            {/* Post-it frequency */}
            <div className="flex items-center justify-between text-xs">
              <span 
                className="px-2 py-1 rounded-full text-white font-medium"
                style={{ backgroundColor: activity.color }}
              >
                {activity.displayType === 'daily' ? 'ทุกวัน' :
                 activity.displayType === 'weekly' ? 'ทุกสัปดาห์' :
                 activity.displayType === 'monthly' ? 'ทุกเดือน' : 'ทุกปี'}
              </span>
            </div>

            {/* Post-it shadow effect - moved behind tapes */}
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