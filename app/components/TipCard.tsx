'use client';

import { useState } from 'react';
import { CheckCircle2, Clock, Target, ChevronDown, ChevronUp } from 'lucide-react';
import { DailyTip } from '@/lib/types';

interface TipCardProps {
  tip: DailyTip;
  isCompleted?: boolean;
  onComplete?: () => void;
  variant?: 'base' | 'collapsed';
}

export function TipCard({ tip, isCompleted = false, onComplete, variant = 'base' }: TipCardProps) {
  const [isExpanded, setIsExpanded] = useState(variant !== 'collapsed');

  if (variant === 'collapsed' && !isExpanded) {
    return (
      <div className="tip-card cursor-pointer" onClick={() => setIsExpanded(true)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-medium text-text-primary">Today's Wisdom</h3>
              <p className="text-sm text-text-secondary capitalize">{tip.niche.replace('-', ' ')}</p>
            </div>
          </div>
          <ChevronDown className="w-5 h-5 text-text-secondary" />
        </div>
      </div>
    );
  }

  return (
    <div className="tip-card animate-slide-up">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
            <Target className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Today's Wisdom</h3>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <span className="capitalize">{tip.niche.replace('-', ' ')}</span>
              <span>•</span>
              <span className="capitalize">{tip.difficulty}</span>
            </div>
          </div>
        </div>
        
        {variant === 'collapsed' && (
          <button
            onClick={() => setIsExpanded(false)}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors duration-200"
          >
            <ChevronUp className="w-5 h-5 text-text-secondary" />
          </button>
        )}
      </div>

      <div className="mb-6">
        <p className="text-text-primary leading-relaxed">{tip.content}</p>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Action Items
        </h4>
        <ul className="space-y-2">
          {tip.actionItems.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-6 h-6 bg-surface rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-text-secondary">{index + 1}</span>
              </div>
              <span className="text-sm text-text-primary">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onComplete}
          disabled={isCompleted}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
            isCompleted
              ? 'bg-green-600/20 text-green-400 cursor-not-allowed'
              : 'btn-primary hover:scale-105'
          }`}
        >
          <CheckCircle2 className="w-5 h-5" />
          {isCompleted ? 'Completed!' : 'Mark as Done'}
        </button>
      </div>
    </div>
  );
}
