'use client';

import { useState } from 'react';
import { X, CreditCard, Zap, Crown, CheckCircle } from 'lucide-react';
import { processPayment, checkPaymentStatus, PAYMENT_AMOUNTS, TIP_COSTS, formatEthAmount, calculateUsdValue } from '@/lib/payments';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (txHash: string) => void;
  tipDifficulty?: 'beginner' | 'intermediate' | 'advanced';
  type: 'single' | 'subscription';
  subscriptionType?: 'weekly' | 'monthly';
}

export function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  tipDifficulty,
  type,
  subscriptionType
}: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'select' | 'processing' | 'success' | 'error'>('select');
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const getAmount = () => {
    if (type === 'single' && tipDifficulty) {
      return TIP_COSTS[tipDifficulty];
    }
    if (type === 'subscription' && subscriptionType) {
      return subscriptionType === 'weekly' ? PAYMENT_AMOUNTS.weeklySubscription : PAYMENT_AMOUNTS.monthlySubscription;
    }
    return '0';
  };

  const getDescription = () => {
    if (type === 'single') {
      return `Unlock today's personalized ${tipDifficulty} tip`;
    }
    if (type === 'subscription') {
      return `Get unlimited access for ${subscriptionType === 'weekly' ? '7 days' : '30 days'}`;
    }
    return '';
  };

  const handlePayment = async () => {
    setLoading(true);
    setStep('processing');
    setError('');

    try {
      // Simulate getting user wallet address
      const mockAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';

      const amount = getAmount();
      const result = await processPayment(mockAddress, amount, tipDifficulty ? `tip_${Date.now()}` : undefined);

      if (result.success && result.txHash) {
        // Check payment status
        const status = await checkPaymentStatus(result.txHash);
        if (status.status === 'confirmed') {
          setStep('success');
          setTimeout(() => {
            onSuccess(result.txHash!);
            onClose();
          }, 2000);
        } else {
          setStep('error');
          setError('Payment confirmation failed. Please try again.');
        }
      } else {
        setStep('error');
        setError(result.error || 'Payment failed');
      }
    } catch (err) {
      setStep('error');
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (step) {
      case 'select':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                {type === 'single' ? (
                  <Zap className="w-8 h-8 text-accent" />
                ) : (
                  <Crown className="w-8 h-8 text-accent" />
                )}
              </div>
              <h2 className="text-xl font-bold text-text-primary mb-2">
                {type === 'single' ? 'Unlock Today\'s Tip' : 'Premium Access'}
              </h2>
              <p className="text-text-secondary">{getDescription()}</p>
            </div>

            <div className="glass-card p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Amount</p>
                  <p className="text-lg font-semibold text-text-primary">
                    {formatEthAmount(getAmount())}
                  </p>
                  <p className="text-xs text-text-secondary">
                    ≈ {calculateUsdValue(getAmount())}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-text-secondary">Network</p>
                  <p className="text-sm font-medium text-text-primary">Base</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                Pay with Wallet
              </button>

              <button
                onClick={onClose}
                className="w-full btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        );

      case 'processing':
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto"></div>
            <h3 className="text-lg font-semibold text-text-primary">Processing Payment</h3>
            <p className="text-text-secondary">Please confirm the transaction in your wallet...</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary">Payment Successful!</h3>
            <p className="text-text-secondary">Your access has been unlocked. Enjoy your wisdom! 🎉</p>
          </div>
        );

      case 'error':
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
              <X className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary">Payment Failed</h3>
            <p className="text-text-secondary">{error}</p>
            <div className="space-y-2">
              <button
                onClick={() => setStep('select')}
                className="w-full btn-primary"
              >
                Try Again
              </button>
              <button
                onClick={onClose}
                className="w-full btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-bg border border-white/10 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-lg font-semibold text-text-primary">Payment</h1>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  );
}

