/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useTransform, animate } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Wallet, 
  TrendingDown, 
  AlertCircle,
  Download,
  RefreshCcw,
  DollarSign,
  Share2,
  Trophy,
  Star,
  Zap,
  ShieldCheck,
  Target
} from 'lucide-react';
import { MONEY_LEAKS, type MoneyLeak } from './data/leaks';

type Screen = 'intro' | 'quiz' | 'results';

function CountUp({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(Math.floor(latest))
    });
    return () => controls.stop();
  }, [value]);

  return <span>{displayValue.toLocaleString()}</span>;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [currentLeakIndex, setCurrentLeakIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});

  const [showCopied, setShowCopied] = useState(false);

  const handleStart = () => {
    setScreen('quiz');
    setCurrentLeakIndex(0);
    setAnswers({});
  };

  const handleAnswer = (hasLeak: boolean) => {
    const currentLeak = MONEY_LEAKS[currentLeakIndex];
    setAnswers(prev => ({ ...prev, [currentLeak.id]: hasLeak }));

    if (currentLeakIndex < MONEY_LEAKS.length - 1) {
      setCurrentLeakIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setScreen('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const score = useMemo(() => {
    return Object.values(answers).filter(Boolean).length;
  }, [answers]);

  const rank = useMemo(() => {
    if (score === 0) return { title: "Financial Fortress", icon: ShieldCheck, color: "text-blue-600", bg: "bg-blue-50" };
    if (score <= 4) return { title: "Budget Guardian", icon: Target, color: "text-emerald-600", bg: "bg-emerald-50" };
    if (score <= 9) return { title: "Leak Detective", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" };
    if (score <= 14) return { title: "Savings Hunter", icon: Star, color: "text-purple-600", bg: "bg-purple-50" };
    return { title: "Money Magnet", icon: Trophy, color: "text-rose-600", bg: "bg-rose-50" };
  }, [score]);

  useEffect(() => {
    if (screen === 'results') {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']
      });
    }
  }, [screen]);

  const totalPossibleSavings = useMemo(() => {
    return Object.entries(answers)
      .filter(([_, hasLeak]) => hasLeak)
      .reduce((sum, [id, _]) => {
        const leak = MONEY_LEAKS.find(l => l.id === Number(id));
        if (!leak) return sum;
        // Use average of range for estimation
        const avg = (leak.costRange[0] + leak.costRange[1]) / 2;
        return sum + avg;
      }, 0);
  }, [answers]);

  const handleShare = async () => {
    const shareText = `I just found ${score} money leaks with the Money Leak Finder! I could be saving $${totalPossibleSavings.toLocaleString()} a year. Find your leaks here: ${window.location.href}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Money Leak Finder',
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 3000);
      } catch (err) {
        console.error('Error copying to clipboard:', err);
      }
    }
  };

  const progress = ((currentLeakIndex) / MONEY_LEAKS.length) * 100;

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Header */}
      <header className="pt-12 pb-8 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#111827]">
            Money Leak Finder
          </h1>
          <p className="text-sm font-medium text-emerald-600 mt-1 uppercase tracking-widest">
            by KeepyCash
          </p>
        </motion.div>
      </header>

      <main className="max-w-2xl mx-auto px-6 pb-20">
        <AnimatePresence mode="wait">
          {screen === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 text-center"
            >
              <div className="mb-6 flex justify-center">
                <img 
                  src="./logo.png"
                  alt="KeepyCash Logo"
                  className="w-24 h-24 object-contain"
                />
              </div>
              <h2 className="text-2xl font-bold mb-4">It's time to keep some money!</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Most people have "money leaks"—small, sneaky expenses that drain your bank account without you even noticing. 
                This quick tool helps you find them so you can start keeping more of what you earn.
              </p>
              <div className="space-y-4 mb-10 text-left bg-gray-50 p-6 rounded-2xl">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">17 quick yes/no questions</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">No sensitive data required</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">Instant savings estimate</p>
                </div>
              </div>
              <button
                onClick={handleStart}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-emerald-100"
              >
                Find my leaks
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {screen === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Progress Bar */}
              <div className="bg-white rounded-full h-2 w-full overflow-hidden border border-gray-100">
                <motion.div 
                  className="bg-emerald-500 h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="flex justify-between text-xs font-medium text-gray-400 uppercase tracking-wider px-1">
                <span>Leak {currentLeakIndex + 1} of {MONEY_LEAKS.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>

              {/* Question Card */}
              <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-2xl font-bold leading-tight pr-4">
                    {MONEY_LEAKS[currentLeakIndex].title}
                  </h2>
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full shrink-0">
                    ${MONEY_LEAKS[currentLeakIndex].costRange[0]}-${MONEY_LEAKS[currentLeakIndex].costRange[1]}/yr
                  </span>
                </div>

                <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                  {MONEY_LEAKS[currentLeakIndex].description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                  <div className="bg-gray-50 p-5 rounded-2xl">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <AlertCircle className="w-3 h-3" /> Where to look
                    </h4>
                    <p className="text-sm text-gray-700">{MONEY_LEAKS[currentLeakIndex].whereToLook}</p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-2xl">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <TrendingDown className="w-3 h-3" /> Typical cost
                    </h4>
                    <p className="text-sm text-gray-700">Around ${Math.round((MONEY_LEAKS[currentLeakIndex].costRange[0] + MONEY_LEAKS[currentLeakIndex].costRange[1]) / 2)} every year</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-center text-sm font-medium text-gray-500 mb-2">Do you think you have this leak?</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => handleAnswer(true)}
                      className="flex-1 bg-white hover:bg-emerald-50 border-2 border-gray-100 hover:border-emerald-200 text-gray-700 font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-3 group"
                    >
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      Yes, I might
                    </button>
                    <button
                      onClick={() => handleAnswer(false)}
                      className="flex-1 bg-white hover:bg-gray-50 border-2 border-gray-100 hover:border-gray-200 text-gray-700 font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-3"
                    >
                      <XCircle className="w-6 h-6 text-gray-300" />
                      No, I'm good
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {screen === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 text-center relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
                
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`w-24 h-24 ${rank.bg} rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg`}
                >
                  <rank.icon className={`w-12 h-12 ${rank.color}`} />
                </motion.div>

                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className={`text-sm font-black uppercase tracking-[0.2em] ${rank.color} mb-2`}>
                    Rank: {rank.title}
                  </p>
                  <h2 className="text-3xl font-bold mb-4">
                    You found {score} money leaks!
                  </h2>
                </motion.div>
                
                <p className="text-gray-600 mb-8 leading-relaxed max-w-md mx-auto">
                  Believe it or not, this is a <span className="font-bold text-emerald-600">GOOD</span> thing! 
                  It means there’s plenty of money that you can keep. 
                  <span className="block mt-2 italic">However...you can’t keep what you don’t track...</span>
                </p>

                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="bg-emerald-50 rounded-3xl p-8 mb-10 border border-emerald-100"
                >
                  <p className="text-emerald-700 font-bold uppercase tracking-widest text-xs mb-2">Total Savings Potential</p>
                  <div className="text-5xl md:text-6xl font-black text-emerald-600 flex items-center justify-center">
                    <DollarSign className="w-8 h-8 md:w-12 md:h-12" />
                    <CountUp value={totalPossibleSavings} />
                  </div>
                  <p className="text-emerald-600/70 text-sm mt-2">Every single year</p>
                </motion.div>

                {/* Achievement Badges */}
                <div className="flex justify-center gap-3 mb-10">
                  {score >= 1 && (
                    <div className="group relative">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 cursor-help transition-transform hover:scale-110">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">First Leak Found</span>
                    </div>
                  )}
                  {score >= 5 && (
                    <div className="group relative">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 cursor-help transition-transform hover:scale-110">
                        <Zap className="w-5 h-5" />
                      </div>
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Leak Detective</span>
                    </div>
                  )}
                  {score >= 10 && (
                    <div className="group relative">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 cursor-help transition-transform hover:scale-110">
                        <Star className="w-5 h-5" />
                      </div>
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Savings Pro</span>
                    </div>
                  )}
                  {totalPossibleSavings >= 5000 && (
                    <div className="group relative">
                      <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 cursor-help transition-transform hover:scale-110">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">High Potential</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-10">
                  {Object.entries(answers)
                    .filter(([_, hasLeak]) => hasLeak)
                    .slice(0, 4)
                    .map(([id, _]) => {
                      const leak = MONEY_LEAKS.find(l => l.id === Number(id));
                      return (
                        <div key={id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <p className="font-bold text-sm mb-1">{leak?.title}</p>
                          <p className="text-xs text-gray-500">{leak?.action}</p>
                        </div>
                      );
                    })}
                  {score > 4 && (
                    <div className="md:col-span-2 text-center text-xs text-gray-400">
                      + {score - 4} more leaks identified
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <button
                    onClick={handleShare}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-100"
                  >
                    <Share2 className="w-5 h-5" />
                    Share my results
                  </button>
                  <button
                    onClick={handleStart}
                    className="flex-1 bg-white hover:bg-gray-50 border-2 border-gray-100 hover:border-gray-200 text-gray-700 font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-3"
                  >
                    <RefreshCcw className="w-5 h-5" />
                    Start over
                  </button>
                </div>

                <AnimatePresence>
                  {showCopied && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold py-2 px-4 rounded-full shadow-lg"
                    >
                      Copied to clipboard!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* KeepyCash CTA */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-emerald-600 rounded-3xl p-8 md:p-10 text-white shadow-xl shadow-emerald-200 relative overflow-hidden"
              >
                {/* Abstract shapes */}
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-black/10 rounded-full blur-3xl" />

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-3">Finally! There's an Easy & Fun Way to Keep More of Your Cash...</h3>
                    <p className="text-emerald-50 mb-6 leading-relaxed">
                      Simply tracking your spending can reduce it by 5-15%... that could be an extra $1000 back in your pocket!
                      <br /><br />
                      That's why we created KeepyCash - A simple way to track your money without being bored by budgeting. Try it today (currently at 50% off because we're still in "launch phase!")
                    </p>
                    <div className="flex flex-col gap-4">
                      <a 
                        href="https://apps.apple.com/redeem?ctx=offercodes&id=6760102114&code=FOUNDER" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-white text-emerald-600 font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all shadow-lg"
                      >
                        <Download className="w-5 h-5" />
                        Download KeepyCash
                      </a>
                    </div>
                  </div>
                  <div className="w-32 h-32 md:w-48 md:h-48 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/30 shrink-0 overflow-hidden p-2">
                    <img 
                      src="./logo.png"
                      alt="KeepyCash Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </motion.div>

              <p className="text-center text-gray-400 text-xs px-6">
                This tool is for informational purposes only and does not constitute financial advice. 
                KeepyCash does not store your answers or personal information.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
