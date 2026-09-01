'use client';

import { useState, useEffect, useRef } from 'react';
import UserSidebarLayout from '../../components/UserSidebarLayout';
import { useAuth } from '../../context/AuthContext';
import { Disc, Gift, History, Loader2, Sparkles, Trophy, HelpCircle, X, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../lib/api';
import HowToPlayModal from '../../components/HowToPlayModal';

export default function LuckySpinPage() {
  const { refreshUser } = useAuth();
  const [spinData, setSpinData] = useState({
    freeSpins: 0,
    costPerSpin: 0,
    prizes: [],
    recentWins: [],
  });
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [resultModal, setResultModal] = useState(null);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);

  // Toggleable Spin Sound Effects State & AudioContext
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioCtxRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('spin_sound_enabled');
    if (stored !== null) {
      setSoundEnabled(stored === 'true');
    }
  }, []);

  const toggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    localStorage.setItem('spin_sound_enabled', String(nextVal));
    toast.info(nextVal ? 'Spin sound turned ON' : 'Spin sound MUTED');
  };

  const playTickSound = () => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(750, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {
      // Audio playback fallback
    }
  };

  const playWinFanfare = () => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.25);
      });
    } catch (e) {
      // Audio playback fallback
    }
  };

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
  }, []);

  const fetchSpinInfo = async () => {
    try {
      setLoading(true);
      const res = await api.get('/user/spin-info');
      if (res.data && res.data.success) {
        setSpinData({
          freeSpins: res.data.freeSpins ?? 2,
          costPerSpin: res.data.costPerSpin ?? 5,
          prizes: res.data.prizes || [],
          recentWins: res.data.recentWins || [],
        });
      }
    } catch (err) {
      console.error('Failed to load spin info:', err);
    } finally {
      setLoading(false);
    }
  };

  const [featureEnabled, setFeatureEnabled] = useState(true);

  useEffect(() => {
    fetchSpinInfo();
    api
      .get('/public/system-features')
      .then((res) => {
        if (res.data && res.data.success && res.data.features && res.data.features.spinWheel === false) {
          setFeatureEnabled(false);
        }
      })
      .catch(() => null);
  }, []);

  const defaultPrizes = [
    { label: '$0.50', amount: 0.5, color: '#3b82f6' },
    { label: '$2.50', amount: 2.5, color: '#10b981' },
    { label: '$0.20', amount: 0.2, color: '#64748b' },
    { label: '$10.50', amount: 10.5, color: '#8b5cf6' },
    { label: '$0.77', amount: 0.77, color: '#ff0044' },
    { label: '$15.15', amount: 15.15, color: '#f59e0b' },
    { label: '$1.25', amount: 1.25, color: '#ec4899' },
    { label: '$20.20', amount: 20.2, color: '#fe780b' },
  ];

  const prizesList = spinData.prizes && spinData.prizes.length > 0 ? spinData.prizes : defaultPrizes;

  const handleSpin = async () => {
    if (!featureEnabled) {
      toast.error('Lucky Spin Wheel is currently disabled by the administration.');
      return;
    }
    if (spinning) return;

    try {
      setSpinning(true);
      const res = await api.post('/user/spin');
      if (res.data && res.data.success) {
        const winningIndex = res.data.winningIndex ?? 0;
        const totalSlices = prizesList.length;
        const sliceAngle = 360 / totalSlices;

        const extraRounds = 5 * 360;
        const targetAngle = extraRounds + (totalSlices - winningIndex) * sliceAngle - sliceAngle / 2;

        setWheelRotation((prev) => prev + targetAngle);

        // Sound Ticks Engine during 4s wheel rotation
        let tickCount = 0;
        const totalTicks = 24;
        const tickInterval = setInterval(() => {
          tickCount++;
          playTickSound();
          if (tickCount >= totalTicks) {
            clearInterval(tickInterval);
          }
        }, 150);

        setTimeout(() => {
          setResultModal({
            isWin: res.data.isWin,
            prize: res.data.prize,
            amount: res.data.amount,
            message: res.data.message,
          });

          if (res.data.isWin) {
            playWinFanfare();
            confettiRef.current?.launch(150);
          }

          setSpinning(false);
          fetchSpinInfo();
          if (refreshUser) refreshUser();
        }, 4000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to spin wheel.');
      setSpinning(false);
    }
  };

  return (
    <UserSidebarLayout>
      <div className="space-y-6 max-w-4xl mx-auto font-sans pb-20 relative">
        {/* Header Hero Banner */}
        <div className="bg-[#0a1835] border border-[#1e3463] rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden space-y-3">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#ff0044] to-[#fe780b] flex items-center justify-center text-white font-righteous text-3xl shadow-lg shadow-red-500/20">
            🎰
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-righteous tracking-wide">
            Lucky Wheel Spin
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Spin the lucky wheel to win instant cash rewards configured by the administration!
          </p>

          {/* Top Control Badges: Sound Toggle & How to Play */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
            <button
              type="button"
              onClick={toggleSound}
              className={`p-2 rounded-full border transition-all cursor-pointer shadow-md ${
                soundEnabled
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-800'
              }`}
              title={soundEnabled ? 'Spin sound is ON (Click to Mute)' : 'Spin sound is MUTED (Click to Turn ON)'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => setIsHowToPlayOpen(true)}
              className="p-2 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer shadow-md"
              title="How to Play"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full max-w-sm sm:max-w-none mx-auto">
            <span className="w-full sm:w-auto px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold whitespace-nowrap flex items-center justify-center shrink-0">
              🎉 {spinData.freeSpins} Free Spins Available
            </span>
            <span className="w-full sm:w-auto px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold whitespace-nowrap flex items-center justify-center shrink-0">
              💰 Spin Cost: ${spinData.costPerSpin}.00
            </span>
          </div>
        </div>

        {!featureEnabled ? (
          <div className="bg-[#0a1835] border border-[#1e3463] rounded-3xl p-12 text-center text-slate-400 text-sm font-semibold space-y-2">
            <div className="text-3xl">🔒</div>
            <div className="text-white font-bold text-base">Lucky Spin Module Disabled</div>
            <p className="text-xs text-slate-400">This feature is currently turned off by the platform administrator.</p>
          </div>
        ) : (
          <>
        {/* Spin Wheel Interactive Container */}
        <div className="bg-[#0a1835] border border-[#1e3463] rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col items-center justify-center relative">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
            {/* Top Pointer Needle */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-[#fe780b] z-40 drop-shadow-lg" />

            {/* Rotating Wheel Disc with Conic Gradient Pie Slices */}
            {(() => {
              const totalSlices = prizesList.length || 8;
              const sliceAngle = 360 / totalSlices;
              const conicBg = `conic-gradient(${prizesList
                .map((p, idx) => {
                  const start = idx * sliceAngle;
                  const end = (idx + 1) * sliceAngle;
                  return `${p.color || '#1e293b'} ${start}deg ${end}deg`;
                })
                .join(', ')})`;

              return (
                <div
                  className="w-full h-full rounded-full border-4 border-[#fe780b] shadow-2xl relative overflow-hidden transition-transform duration-[4000ms] ease-out"
                  style={{
                    background: conicBg,
                    transform: `rotate(${wheelRotation}deg)`,
                  }}
                >
                  {prizesList.map((p, idx) => {
                    const angle = idx * sliceAngle + sliceAngle / 2;
                    return (
                      <div
                        key={idx}
                        className="absolute top-0 left-0 w-full h-full pointer-events-none flex items-start justify-center pt-3"
                        style={{
                          transform: `rotate(${angle}deg)`,
                        }}
                      >
                        <span className="text-xs font-bold text-white font-righteous drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wider transform rotate-90 mt-5">
                          {p.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {/* Center Start Button */}
            <button
              onClick={handleSpin}
              disabled={spinning}
              className="absolute w-20 h-20 rounded-full bg-gradient-to-r from-[#ff0044] to-[#fe780b] border-4 border-white text-white font-righteous font-extrabold text-sm uppercase tracking-wider shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center z-30 cursor-pointer disabled:opacity-70"
            >
              {spinning ? <Loader2 className="w-6 h-6 animate-spin text-white" /> : 'START'}
            </button>
          </div>
        </div>

        {/* Recent Wins Audit Log */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 px-1">
            <History className="w-4 h-4 text-[#fe780b]" />
            <h3 className="font-bold text-white text-sm font-righteous">Recent Lucky Wins</h3>
          </div>

          <div className="bg-[#0a1835] border border-[#1e3463] rounded-2xl shadow-xl overflow-hidden">
            {loading ? (
              <div className="py-12 flex items-center justify-center text-slate-400 text-xs font-semibold gap-2">
                <span>Loading recent wins</span>
                <Loader2 className="w-5 h-5 animate-spin text-[#fe780b]" />
              </div>
            ) : spinData.recentWins.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs font-semibold">
                No recent spin wins recorded yet. Spin the wheel above!
              </div>
            ) : (
              <div className="divide-y divide-[#1e3463]/60">
                {spinData.recentWins.map((win) => (
                  <div key={win.id} className="p-4 flex items-center justify-between hover:bg-[#0f2147] transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{win.prize?.name || 'Lucky Slice'}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {new Date(win.created_at).toLocaleString()} • {win.spin_type === 'free' ? 'Free Spin' : 'Paid Spin'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-extrabold text-emerald-400 font-righteous">
                        +${parseFloat(win.reward_earned || 0).toFixed(2)}
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full inline-block mt-1">
                        WON
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Floating Help Button */}
        <button
          onClick={() => setIsHowToPlayOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-[#ff0044] to-[#fe780b] rounded-full shadow-2xl shadow-red-500/30 flex items-center justify-center z-40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-[#ff0044] font-bold text-lg">?</span>
          </div>
        </button>

        <HowToPlayModal isOpen={isHowToPlayOpen} setIsOpen={setIsHowToPlayOpen} />
          </>
        )}

        {/* Result Modal Dialog */}
        {resultModal && (
          <div
            onClick={() => setResultModal(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm cursor-pointer animate-fadeIn font-sans"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm bg-[#09152e] border border-[#1d335f] rounded-3xl p-6 sm:p-7 shadow-2xl text-center space-y-4 cursor-default"
            >
              {/* Close X Button */}
              <button
                onClick={() => setResultModal(null)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#ff0044] to-[#fe780b] flex items-center justify-center text-white text-3xl shadow-lg">
                {resultModal.isWin ? '🎁' : '😅'}
              </div>

              <h2 className="text-xl font-extrabold text-white font-righteous">
                {resultModal.isWin ? 'You Won!' : 'Better Luck Next Time!'}
              </h2>

              <p className="text-sm text-slate-300">{resultModal.message}</p>

              {resultModal.isWin && (
                <div className="text-3xl font-extrabold text-emerald-400 font-righteous pt-1">
                  +${parseFloat(resultModal.amount || 0).toFixed(2)}
                </div>
              )}

              <button
                onClick={() => setResultModal(null)}
                className="w-full bg-gradient-to-r from-[#ff0044] to-[#fe780b] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-500/20 transition-all cursor-pointer"
              >
                Continue
              </button>
            </div>
          </div>
        )}
        {/* Confetti Animation Canvas */}
        <canvas
          ref={confettiCanvasRef}
          className="pointer-events-none fixed inset-0 z-[100] w-full h-full"
          style={{ display: 'none' }}
        />
      </div>
    </UserSidebarLayout>
  );
}
