'use client';

import { useState } from 'react';
import { ChevronRight, Target, Clock, TrendingUp } from 'lucide-react';
import { NICHES, EXPERIENCE_LEVELS, TIME_COMMITMENTS } from '@/lib/constants';
import { OnboardingData } from '@/lib/types';

interface OnboardingFormProps {
  onComplete: (data: OnboardingData) => void;
  variant?: 'goalInput' | 'nicheSelect';
}

export function OnboardingForm({ onComplete, variant = 'goalInput' }: OnboardingFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<OnboardingData>>({});

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete(formData as OnboardingData);
    }
  };

  const isStepComplete = () => {
    switch (step) {
      case 1: return formData.goal && formData.goal.length > 10;
      case 2: return formData.niche;
      case 3: return formData.experience;
      case 4: return formData.timeCommitment;
      default: return false;
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((num) => (
          <div key={num} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              num <= step ? 'bg-accent text-white' : 'bg-surface text-text-secondary'
            }`}>
              {num}
            </div>
            {num < 4 && (
              <div className={`w-8 h-0.5 mx-2 ${
                num < step ? 'bg-accent' : 'bg-surface'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Goal Input */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">What's your main goal?</h2>
            <p className="text-text-secondary">Tell us what you want to achieve so we can provide personalized advice.</p>
          </div>

          <div className="space-y-4">
            <textarea
              value={formData.goal || ''}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              placeholder="e.g., I want to learn web development with Base blockchain, improve my public speaking skills, or build a successful startup..."
              className="w-full p-4 bg-surface border border-white/10 rounded-lg text-text-primary placeholder-text-secondary resize-none focus:outline-none focus:ring-2 focus:ring-accent/50"
              rows={4}
            />
            <p className="text-xs text-text-secondary">
              {formData.goal?.length || 0}/200 characters (minimum 10)
            </p>
          </div>
        </div>
      )}

      {/* Step 2: Niche Selection */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-text-primary mb-2">Choose your niche</h2>
            <p className="text-text-secondary">Select the area that best matches your goal.</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {NICHES.map((niche) => (
              <button
                key={niche.id}
                onClick={() => setFormData({ ...formData, niche: niche.id })}
                className={`p-4 rounded-lg border text-left transition-all duration-200 ${
                  formData.niche === niche.id
                    ? 'border-accent bg-accent/10 text-text-primary'
                    : 'border-white/10 bg-surface hover:bg-white/5 text-text-primary'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{niche.icon}</span>
                  <span className="font-medium">{niche.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Experience Level */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">What's your experience level?</h2>
            <p className="text-text-secondary">This helps us tailor the difficulty of your daily tips.</p>
          </div>

          <div className="space-y-3">
            {EXPERIENCE_LEVELS.map((level) => (
              <button
                key={level.id}
                onClick={() => setFormData({ ...formData, experience: level.id })}
                className={`w-full p-4 rounded-lg border text-left transition-all duration-200 ${
                  formData.experience === level.id
                    ? 'border-accent bg-accent/10 text-text-primary'
                    : 'border-white/10 bg-surface hover:bg-white/5 text-text-primary'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{level.label}</h3>
                    <p className="text-sm text-text-secondary">{level.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-text-secondary" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Time Commitment */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Daily time commitment</h2>
            <p className="text-text-secondary">How much time can you dedicate to your goal each day?</p>
          </div>

          <div className="space-y-3">
            {TIME_COMMITMENTS.map((time) => (
              <button
                key={time.id}
                onClick={() => setFormData({ ...formData, timeCommitment: time.id })}
                className={`w-full p-4 rounded-lg border text-left transition-all duration-200 ${
                  formData.timeCommitment === time.id
                    ? 'border-accent bg-accent/10 text-text-primary'
                    : 'border-white/10 bg-surface hover:bg-white/5 text-text-primary'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{time.label}</h3>
                    <p className="text-sm text-text-secondary">{time.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-text-secondary" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 pt-6">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="btn-secondary flex-1"
          >
            Back
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!isStepComplete()}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            isStepComplete()
              ? 'btn-primary'
              : 'bg-surface text-text-secondary cursor-not-allowed'
          }`}
        >
          {step === 4 ? 'Get Started' : 'Next'}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
