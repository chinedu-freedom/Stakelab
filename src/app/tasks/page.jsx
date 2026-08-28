'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import UserSidebarLayout from '../../components/UserSidebarLayout';
import { useAuth } from '../../context/AuthContext';
import { Gift, Lock, CheckCircle2, Loader2, Users, Trophy, Award, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../lib/api';

export default function UserTasksPage() {
  const { refreshUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [todayInvites, setTodayInvites] = useState(0);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);

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

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/user/tasks');
      if (res.data && res.data.success) {
        setTasks(res.data.tasks || []);
        setTodayInvites(res.data.todayReferralsCount || 0);
      }
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleClaim = async (taskId) => {
    try {
      setClaimingId(taskId);
      const res = await api.post('/user/claim-task', { taskId });
      if (res.data && res.data.success) {
        toast.success(res.data.message || 'Task reward claimed successfully!');
        confettiRef.current?.launch(140);
        await fetchTasks();
        if (refreshUser) refreshUser();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to claim task reward.');
    } finally {
      setClaimingId(null);
    }
  };

  const totalTasks = tasks.length;
  const readyTasks = tasks.filter((t) => t.isReady).length;
  const claimedTasks = tasks.filter((t) => t.isClaimed).length;

  return (
    <UserSidebarLayout>
      <div className="space-y-6 max-w-4xl mx-auto font-sans pb-12">
        {/* Header Hero Banner */}
        <div className="bg-[#0a1835] border border-[#1e3463] rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden space-y-3">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#ff0044] to-[#fe780b] flex items-center justify-center text-white font-righteous text-3xl shadow-lg shadow-red-500/20">
            📋
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-righteous tracking-wide">
            Invitation Tasks
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Invite active members to join EverStake to unlock exclusive cash milestone rewards!
          </p>
        </div>

        {/* Overview Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#0a1835] border border-[#1e3463] rounded-2xl p-4 text-center shadow-md space-y-1">
            <div className="text-2xl font-extrabold text-white font-righteous">{totalTasks}</div>
            <div className="text-[11px] text-slate-400 font-semibold">Total Tasks</div>
          </div>

          <div className="bg-[#0a1835] border border-[#1e3463] rounded-2xl p-4 text-center shadow-md space-y-1">
            <div className="text-2xl font-extrabold text-[#fe780b] font-righteous">{readyTasks}</div>
            <div className="text-[11px] text-slate-400 font-semibold">Ready to Claim</div>
          </div>

          <div className="bg-[#0a1835] border border-[#1e3463] rounded-2xl p-4 text-center shadow-md space-y-1">
            <div className="text-2xl font-extrabold text-emerald-400 font-righteous">{claimedTasks}</div>
            <div className="text-[11px] text-slate-400 font-semibold">Claimed</div>
          </div>

          <div className="bg-[#0a1835] border border-[#1e3463] rounded-2xl p-4 text-center shadow-md space-y-1">
            <div className="text-2xl font-extrabold text-sky-400 font-righteous">{todayInvites}</div>
            <div className="text-[11px] text-slate-400 font-semibold">Your Invites</div>
          </div>
        </div>

        {/* Task Cards List */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-12 flex items-center justify-center text-slate-400 text-xs font-semibold gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-[#fe780b]" /> Loading tasks...
            </div>
          ) : tasks.length === 0 ? (
            <div className="py-12 bg-[#0a1835] border border-[#1e3463] rounded-2xl text-center text-slate-400 text-xs font-semibold">
              No active tasks available right now. Check back soon!
            </div>
          ) : (
            tasks.map((task) => {
              const reqRef = task.required_referrals || 15;
              const progressPercent = Math.min((task.progress / reqRef) * 100, 100);

              return (
                <div
                  key={task.id}
                  className="bg-[#0a1835] border border-[#1e3463] hover:border-[#2e4c88] rounded-2xl p-5 shadow-xl transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3.5 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                        <Gift className="w-6 h-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm sm:text-base font-bold text-white font-righteous whitespace-nowrap truncate">
                          {task.task_name}
                        </h3>
                        <p className="text-xs text-slate-300 mt-0.5 whitespace-nowrap truncate">
                          {task.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-1 whitespace-nowrap">
                          <span className="text-xs font-extrabold text-emerald-400 font-righteous shrink-0">
                            +${parseFloat(task.reward_amount).toFixed(2)} Cash
                          </span>
                          <span className="text-[11px] text-slate-400 shrink-0">
                            • {reqRef} invites required
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button - Placed at the bottom on mobile screens */}
                    <div className="w-full sm:w-auto shrink-0 flex items-center justify-end">
                      {task.isClaimed ? (
                        <span className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Claimed
                        </span>
                      ) : task.isReady ? (
                        <button
                          onClick={() => handleClaim(task.id)}
                          disabled={claimingId === task.id}
                          className="w-full sm:w-auto justify-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff0044] to-[#fe780b] hover:opacity-90 text-white font-bold text-xs shadow-lg shadow-red-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          {claimingId === task.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" /> Claim Reward
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 border border-slate-700 text-slate-400 flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5" /> Locked
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Live Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="w-full h-2 bg-[#061127] border border-[#1e3463] rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          task.isClaimed
                            ? 'bg-emerald-500'
                            : 'bg-gradient-to-r from-[#ff0044] to-[#fe780b]'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 font-semibold px-0.5">
                      <span>Progress: {task.progress} / {reqRef} referrals</span>
                      <span>{Math.floor(progressPercent)}%</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Confetti Animation Canvas */}
      <canvas
        ref={confettiCanvasRef}
        className="pointer-events-none fixed inset-0 z-[100] w-full h-full"
        style={{ display: 'none' }}
      />
    </UserSidebarLayout>
  );
}
