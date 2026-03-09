import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { EARTHLY_BRANCHES, MAIN_STARS } from '@/lib/ziwei-types';

const OpeningAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 1000);
    const t3 = setTimeout(() => onComplete(), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-cosmic overflow-hidden"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Stars background */}
        {Array.from({ length: 60 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0.3, 1, 0.5] }}
            transition={{ duration: 2, delay: Math.random() * 0.5, repeat: Infinity }}
          />
        ))}

        {/* Rotating star chart ring */}
        <motion.div
          className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full border border-primary/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, ease: 'linear', repeat: Infinity }}
        >
          {EARTHLY_BRANCHES.map((branch, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const r = 140;
            return (
              <motion.span
                key={branch}
                className="absolute font-display text-primary text-sm md:text-base"
                style={{
                  left: `calc(50% + ${Math.cos(angle) * r}px - 8px)`,
                  top: `calc(50% + ${Math.sin(angle) * r}px - 8px)`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={phase >= 1 ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                {branch}
              </motion.span>
            );
          })}
        </motion.div>

        {/* Inner rotating ring */}
        <motion.div
          className="absolute w-[180px] h-[180px] md:w-[240px] md:h-[240px] rounded-full border border-accent/20"
          animate={{ rotate: -360 }}
          transition={{ duration: 12, ease: 'linear', repeat: Infinity }}
        />

        {/* Stars falling in */}
        {phase >= 2 && MAIN_STARS.slice(0, 8).map((star, i) => {
          const angle = (i * 45 - 90) * (Math.PI / 180);
          const r = 70;
          return (
            <motion.span
              key={star}
              className="absolute text-xs text-accent font-display"
              initial={{ opacity: 0, y: -50, scale: 0.5 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                x: Math.cos(angle) * r,
              }}
              style={{ top: `calc(50% + ${Math.sin(angle) * r}px)` }}
              transition={{ delay: i * 0.06, duration: 0.4, type: 'spring' }}
            >
              {star}
            </motion.span>
          );
        })}

        {/* Center text */}
        <motion.div
          className="absolute text-center z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="font-display text-2xl md:text-4xl text-primary text-glow-gold tracking-widest">
            紫微斗數
          </h1>
          <motion.p
            className="font-display text-sm md:text-base text-foreground/60 mt-2 tracking-[0.3em]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            復盤學習系統
          </motion.p>
        </motion.div>

        {/* Nebula glow */}
        <div className="absolute w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-primary/5 blur-3xl translate-x-20 -translate-y-10" />
      </motion.div>
    </AnimatePresence>
  );
};

export default OpeningAnimation;
