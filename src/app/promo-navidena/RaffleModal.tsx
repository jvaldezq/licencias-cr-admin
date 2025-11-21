'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface Winner {
  id: string;
  customerName: string;
  customerPhone: string;
  assetName: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participants: string[];
  onGenerateWinner: () => Promise<Winner>;
}

export const RaffleModal = ({
  open,
  onOpenChange,
  participants,
  onGenerateWinner,
}: Props) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentName, setCurrentName] = useState('');
  const [winner, setWinner] = useState<Winner | null>(null);
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      // Reset state when modal opens
      setIsAnimating(false);
      setWinner(null);
      setCurrentName('');
      setPhoneRevealed(false);
      setError(null);
    }
  }, [open]);

  const startRaffle = async () => {
    if (participants.length === 0) {
      setError('No hay participantes para el sorteo');
      return;
    }

    setIsAnimating(true);
    setError(null);

    // Animation phase: cycle through names for exactly 5 seconds
    const animationDuration = 5000; // 5 seconds total
    const startTime = Date.now();
    let currentSpeed = 50; // Start fast

    const animationInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / animationDuration;

      // Gradually slow down based on progress (exponential slowdown)
      if (progress < 0.7) {
        // First 70% - keep it fast
        currentSpeed = 50;
      } else if (progress < 0.85) {
        // 70-85% - start slowing down
        currentSpeed = 100;
      } else if (progress < 0.95) {
        // 85-95% - slow more
        currentSpeed = 200;
      } else {
        // Last 5% - very slow for suspense
        currentSpeed = 400;
      }

      const randomIndex = Math.floor(Math.random() * participants.length);
      setCurrentName(participants[randomIndex]);

      // Stop after 5 seconds
      if (elapsed >= animationDuration) {
        clearInterval(animationInterval);
        selectWinner();
      }
    }, currentSpeed);

    // Safety timeout to ensure animation ends at 5 seconds
    setTimeout(() => {
      clearInterval(animationInterval);
      selectWinner();
    }, animationDuration);
  };

  const selectWinner = async () => {
    try {
      const winnerData = await onGenerateWinner();
      setWinner(winnerData);
      setCurrentName(winnerData.customerName);
      setIsAnimating(false);

      // Trigger confetti
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        // Additional confetti bursts
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
          });
        }, 250);
      }, 100);
    } catch (err) {
      console.error('Error selecting winner:', err);
      setError('Error al seleccionar el ganador');
      setIsAnimating(false);
    }
  };

  const handleCopyPhone = async () => {
    if (winner?.customerPhone) {
      try {
        await navigator.clipboard.writeText(winner.customerPhone);
        toast.success('Teléfono copiado al portapapeles');
      } catch (err) {
        console.error('Error copying phone:', err);
        toast.error('Error al copiar el teléfono');
      }
    }
  };

  const maskPhone = (phone: string) => {
    if (phone.length <= 4) return phone;
    return '***-***' + phone.slice(-4);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-amber-600">
            🎁 Sorteo Promo Navideña 🎁
          </DialogTitle>
        </DialogHeader>

        <div className="py-8">
          {!winner && !isAnimating && !error && (
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Total de participantes: <span className="font-bold text-amber-600">{participants.length}</span>
              </p>
              <Button
                onClick={startRaffle}
                className="bg-amber-600 hover:bg-amber-700 text-white text-lg px-8 py-6"
                size="lg"
              >
                Iniciar Sorteo
              </Button>
            </div>
          )}

          {error && (
            <div className="text-center">
              <p className="text-error font-semibold">{error}</p>
              <Button
                onClick={() => onOpenChange(false)}
                className="mt-4"
                variant="outline"
              >
                Cerrar
              </Button>
            </div>
          )}

          {isAnimating && (
            <div className="text-center space-y-4">
              <div className="animate-pulse">
                <div className="text-4xl font-bold text-primary mb-4">
                  Sorteando...
                </div>
                <div className="text-2xl font-semibold text-amber-600 min-h-[40px] animate-bounce">
                  {currentName}
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
          )}

          {winner && !isAnimating && (
            <div className="text-center space-y-6">
              <div className="text-3xl font-bold text-success animate-bounce">
                🎉 ¡Ganador! 🎉
              </div>

              <div className="bg-amber-50 rounded-lg p-6 space-y-4">
                <div>
                  <p className="text-gray-600 text-sm">Nombre</p>
                  <p className="text-2xl font-bold text-primary">{winner.customerName}</p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-gray-600 text-sm mb-2">Teléfono</p>
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-lg font-mono font-semibold">
                      {phoneRevealed ? winner.customerPhone : maskPhone(winner.customerPhone)}
                    </p>
                    <Button
                      onClick={() => setPhoneRevealed(!phoneRevealed)}
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                    >
                      {phoneRevealed ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      onClick={handleCopyPhone}
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => onOpenChange(false)}
                className="bg-secondary hover:bg-secondary/90"
              >
                Cerrar
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
