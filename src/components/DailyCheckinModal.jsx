'use client';

import { useState, useEffect, useRef } from 'react';
import { Gift, Lock, Check, Coins, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function DailyCheckinModal() {
  const { refreshUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [statusData, setStatusData] = useState({
    currentStreak: 1,
    claimedToday: false,
    rewards: [],
  });

  const confettiCanvasRef = useRef(null);
  const confettiRef = useRef(null);

  // Confetti Particle Engine
  useEffect(() => {
    if (!confettiCanvasRef.current) return;
    class Confetti {
      constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.running = false;
      }
      launch(count = 120) {
        this.canvas.style.display = 'block';
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.particles = [];
        const colors = ['#ff0044', '#fe780b', '#10b981', '#3b82f6', '#f59e0b', '#ec4899'];

        for (let i = 0; i < count; i++) {
          this.particles.push({
            x: Math.random() * this.canvas.width,
            y: Math.random() * (this.canvas.height * 0.4),
            size: Math.random() * 8 + 4,
            speedX: (Math.random() - 0.5) * 6,
            speedY: Math.random() * 5 + 3,
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 12,
            color: colors[Math.floor(Math.random() * colors.length)],
            shape: Math.random() > 0.5 ? 'rect' : 'circle',
          });
        }
        this.running = true;
        this.animate();
      }
      animate() {
        if (!this.running) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let active = 0;
        this.particles.forEach((p) => {
          if (p.y < this.canvas.height + 50) {
            active++;
            p.y += p.speedY;
            p.x += p.speedX;
            p.rotation += p.rotSpeed;
            p.speedY += 0.15;
            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);
            this.ctx.fillStyle = p.color;
            if (p.shape === 'rect') {
              this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            } else {
              this.ctx.beginPath();
              this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
              this.ctx.fill();
            }
            this.ctx.restore();
          }
        });
        if (active > 0) {
          requestAnimationFrame(() => this.animate());
        } else {
          this.running = false;
          this.canvas.style.display = 'none';
        }
      }
    }
    confettiRef.current = new Confetti(confettiCanvasRef.current);
  }, [isOpen]);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await api.get('/user/daily-checkin-status');
      if (res.data && res.data.success) {
        setStatusData({
          currentStreak: res.data.currentStreak || 1,
          claimedToday: !!res.data.claimedToday,
          rewards: res.data.rewards || [],
        });
      }
    } catch (err) {
      console.error('Failed to load checkin status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    const handleOpen = () => {
      fetchStatus();
      setIsOpen(true);
    };

    window.addEventListener('open-daily-checkin', handleOpen);
    return () => window.removeEventListener('open-daily-checkin', handleOpen);
  }, []);

  // Countdown timer for next daily claim
  const [timeLeft, setTimeLeft] = useState('00:00:00');
  useEffect(() => {
    if (!statusData.claimedToday) return;

    const updateTimer = () => {
      const now = new Date();
      const nextReset = new Date(now);
      nextReset.setHours(24, 0, 0, 0);
      const diff = nextReset - now;

      if (diff <= 0) {
        fetchStatus();
        return '00:00:00';
      }
      const h = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
      const m = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0');
      const s = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
      return `${h}:${m}:${s}`;
    };

    setTimeLeft(updateTimer());
    const timer = setInterval(() => setTimeLeft(updateTimer()), 1000);
    return () => clearInterval(timer);
  }, [statusData.claimedToday]);

  const handleClaim = async () => {
    try {
      setClaiming(true);
      const res = await api.post('/user/claim-daily-checkin');
      if (res.data && res.data.success) {
        toast.success(res.data.message || 'Daily reward claimed!');
        confettiRef.current?.launch(140);
        await fetchStatus();
        if (refreshUser) refreshUser();
        setTimeout(() => {
          setIsOpen(false);
        }, 3000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to claim daily reward.');
    } finally {
      setClaiming(false);
    }
  };

  if (!isOpen) return null;

  const displayDay = statusData.claimedToday ? statusData.currentStreak || 1 : (statusData.currentStreak || 0) + 1;
  const rewardsList = statusData.rewards.length > 0 ? statusData.rewards : [
    { day: 1, amount: 0.1, status: 'available' },
    { day: 2, amount: 0.2, status: 'locked' },
    { day: 3, amount: 0.02, status: 'locked' },
    { day: 4, amount: 0.1, status: 'locked' },
    { day: 5, amount: 0.3, status: 'locked' },
    { day: 6, amount: 0.4, status: 'locked' },
    { day: 7, amount: 0.5, status: 'locked' },
  ];

  return (
    <div
      onClick={() => setIsOpen(false)}
      className="fixed inset-0 z-[100] w-full h-full min-h-screen flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer animate-fadeIn overflow-y-auto"
    >
      {/* Modal Dialog Box */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm bg-[#09152e] border border-[#1d335f] rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden font-sans text-center space-y-5 cursor-default"
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner relative">
          <Gift className="w-8 h-8 drop-shadow-md" />
          <span className="absolute top-1 right-2 text-xs">✨</span>
        </div>

        {/* Title & Description */}
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-white font-righteous tracking-wide">
            Daily Rewards
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
            Check in for 7 consecutive days to get maximum rewards. Missing a day resets your streak!
          </p>
        </div>

        {/* 7 Days Reward Cards Grid */}
        {loading ? (
          <div className="py-8 flex items-center justify-center text-slate-400 text-xs gap-2">
            <span>Loading rewards</span>
            <Loader2 className="w-5 h-5 animate-spin text-[#fe780b]" />
          </div>
        ) : (
          <div className="space-y-3">
            {/* Top 4 Days */}
            <div className="grid grid-cols-4 gap-2.5">
              {rewardsList.slice(0, 4).map((r) => (
                <RewardCard key={r.day} reward={r} currentStreak={statusData.currentStreak} claimedToday={statusData.claimedToday} />
              ))}
            </div>
            {/* Bottom 3 Days */}
            <div className="grid grid-cols-3 gap-2.5 max-w-[280px] mx-auto">
              {rewardsList.slice(4, 7).map((r) => (
                <RewardCard key={r.day} reward={r} currentStreak={statusData.currentStreak} claimedToday={statusData.claimedToday} />
              ))}
            </div>
          </div>
        )}

        {/* Claim / Countdown Action Button */}
        {statusData.claimedToday ? (
          <div className="w-full bg-[#060e20] border border-[#1d335f] text-slate-400 rounded-2xl py-3.5 font-mono font-bold text-center tracking-widest text-base shadow-inner">
            NEXT: <span className="text-[#fe780b]">{timeLeft}</span>
          </div>
        ) : (
          <button
            onClick={handleClaim}
            disabled={claiming || loading}
            className="w-full bg-gradient-to-r from-[#ff0044] to-[#fe780b] hover:opacity-90 text-white py-3.5 rounded-2xl font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {claiming ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              `Claim Day ${displayDay}`
            )}
          </button>
        )}
      </div>

      {/* Confetti Animation Canvas */}
      <canvas
        ref={confettiCanvasRef}
        className="pointer-events-none fixed inset-0 z-[100] w-full h-full"
        style={{ display: 'none' }}
      />
    </div>
  );
}

function RewardCard({ reward, currentStreak, claimedToday }) {
  const isCurrentDay = reward.day === currentStreak;
  const isClaimed = reward.day < currentStreak || (isCurrentDay && claimedToday);
  const isAvailable = isCurrentDay && !claimedToday;

  return (
    <div
      className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border-2 transition-all ${
        isClaimed
          ? 'border-emerald-500/80 bg-emerald-500/10 text-emerald-400'
          : isAvailable
          ? 'border-[#fe780b] bg-amber-500/15 text-[#fe780b] scale-105 shadow-md shadow-amber-500/10 ring-2 ring-[#fe780b]/30'
          : 'border-slate-800 bg-slate-900/50 text-slate-500'
      }`}
    >
      <span
        className={`text-[10px] font-bold tracking-wider uppercase mb-1.5 ${
          isClaimed ? 'text-emerald-400' : isAvailable ? 'text-[#fe780b]' : 'text-slate-400'
        }`}
      >
        Day {reward.day}
      </span>

      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center mb-1.5 shadow-sm ${
          isClaimed
            ? 'bg-emerald-500 text-white'
            : isAvailable
            ? 'bg-gradient-to-tr from-[#ff0044] to-[#fe780b] text-white shadow-md'
            : 'bg-slate-800 text-slate-500'
        }`}
      >
        {isClaimed ? (
          <Check className="w-4 h-4" strokeWidth={3} />
        ) : isAvailable ? (
          <Coins className="w-3.5 h-3.5" />
        ) : (
          <Lock className="w-3.5 h-3.5" />
        )}
      </div>

      <span
        className={`text-[11px] font-extrabold ${
          isClaimed ? 'text-emerald-400' : isAvailable ? 'text-white' : 'text-slate-400'
        }`}
      >
        +${parseFloat(reward.amount).toFixed(2)}
      </span>
    </div>
  );
}
