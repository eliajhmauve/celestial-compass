import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OpeningAnimation from '@/components/OpeningAnimation';
import ChartGrid from '@/components/ChartGrid';
import ChartInputForm from '@/components/ChartInputForm';
import ReportView from '@/components/ReportView';
import ChartHistory from '@/components/ChartHistory';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChartData, generateRandomChart } from '@/lib/ziwei-types';
import { generateReport } from '@/lib/ziwei-report';

type View = 'intro' | 'home' | 'random' | 'manual' | 'report' | 'history';

const STORAGE_KEY = 'ziwei-charts';

function loadCharts(): ChartData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveCharts(charts: ChartData[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(charts));
}

const Index = () => {
  const [view, setView] = useState<View>('intro');
  const [situation, setSituation] = useState('');
  const [currentChart, setCurrentChart] = useState<ChartData | null>(null);
  const [savedCharts, setSavedCharts] = useState<ChartData[]>(loadCharts);

  useEffect(() => { saveCharts(savedCharts); }, [savedCharts]);

  const handleAnimationComplete = useCallback(() => setView('home'), []);

  const handleRandomChart = () => {
    const random = generateRandomChart();
    const chart: ChartData = {
      ...random,
      id: crypto.randomUUID(),
      date: new Date().toLocaleDateString('zh-TW'),
      situation,
    };
    chart.report = generateReport(chart);
    setCurrentChart(chart);
    setSavedCharts(prev => [chart, ...prev]);
    setView('report');
  };

  const handleManualSubmit = (data: Omit<ChartData, 'id' | 'date' | 'report'>) => {
    const chart: ChartData = {
      ...data,
      id: crypto.randomUUID(),
      date: new Date().toLocaleDateString('zh-TW'),
    };
    chart.report = generateReport(chart);
    setCurrentChart(chart);
    setSavedCharts(prev => [chart, ...prev]);
    setView('report');
  };

  if (view === 'intro') {
    return <OpeningAnimation onComplete={handleAnimationComplete} />;
  }

  return (
    <div className="min-h-screen bg-cosmic">
      {/* Header */}
      <header className="border-b border-border/30 backdrop-blur-sm bg-background/30 sticky top-0 z-40">
        <div className="container max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <button onClick={() => { setView('home'); setCurrentChart(null); }} className="flex items-center gap-2">
            <span className="font-display text-primary text-lg text-glow-gold">紫微斗數</span>
            <span className="text-muted-foreground text-xs hidden md:inline">復盤學習系統</span>
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView('history')}
              className="text-xs text-muted-foreground hover:text-primary transition-colors font-display"
            >
              復盤資料庫 ({savedCharts.length})
            </button>
            <span className="text-muted-foreground/40 text-xs">福星何大師</span>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 py-6 md:py-10">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              {/* Hero */}
              <div className="text-center space-y-4 py-8">
                <h1 className="font-display text-3xl md:text-5xl text-primary text-glow-gold tracking-wider">
                  星曜中的命運格局
                </h1>
                <p className="text-foreground/60 font-display text-sm md:text-base max-w-lg mx-auto">
                  紫微命盤的天象結構，十二宮位的人生藍圖，星辰運行的訊息，天地星象的命理智慧
                </p>
              </div>

              {/* Situation input */}
              <div className="max-w-2xl mx-auto space-y-3">
                <h2 className="font-display text-lg text-primary">現況描述</h2>
                <p className="text-muted-foreground text-xs">
                  請描述您目前的人生狀況——職業與事業、家庭人際、財務狀況、健康節奏、近期重要抉擇等。此資訊將作為命盤解析的背景參考。
                </p>
                <Textarea
                  value={situation}
                  onChange={e => setSituation(e.target.value)}
                  placeholder="例如：目前從事科技業管理職，面臨職涯轉型的抉擇，家庭關係和睦但財務壓力較大⋯⋯"
                  className="bg-muted border-border min-h-[120px] text-foreground placeholder:text-muted-foreground/40 font-body"
                />
              </div>

              {/* Mode selection */}
              <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleRandomChart}
                  className="bg-card border border-border rounded-lg p-6 text-left hover:border-primary/50 hover:shadow-[var(--shadow-glow-gold)] transition-all group"
                >
                  <div className="text-2xl mb-3">🎲</div>
                  <h3 className="font-display text-primary group-hover:text-glow-gold text-lg">隨機命盤生成</h3>
                  <p className="text-muted-foreground text-xs mt-2">
                    系統隨機生成一張紫微斗數命盤，適合練習解盤與學習星曜組合
                  </p>
                </button>
                <button
                  onClick={() => setView('manual')}
                  className="bg-card border border-border rounded-lg p-6 text-left hover:border-accent/50 hover:shadow-[var(--shadow-glow-purple)] transition-all group"
                >
                  <div className="text-2xl mb-3">✍️</div>
                  <h3 className="font-display text-accent group-hover:text-glow-purple text-lg">手動復盤模式</h3>
                  <p className="text-muted-foreground text-xs mt-2">
                    輸入真實命盤或案例，進行命盤復盤與深度分析
                  </p>
                </button>
              </div>

              {/* Decorative quotes */}
              <div className="text-center space-y-2 py-6">
                {['星曜排列非枷鎖，而是指引', '命盤如鏡，映照天地因緣', '以智慧觀照星辰，以行動創造未來'].map((q, i) => (
                  <p key={i} className="text-muted-foreground/40 font-display text-xs tracking-widest">
                    「{q}」
                  </p>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'manual' && (
            <motion.div
              key="manual"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              <button
                onClick={() => setView('home')}
                className="text-primary text-sm font-display hover:text-primary/80 transition-colors"
              >
                ← 返回首頁
              </button>
              <h2 className="font-display text-2xl text-primary text-glow-gold">手動復盤模式</h2>
              <p className="text-muted-foreground text-sm">
                選擇命宮地支、身宮位置，並為每個宮位配置星曜。十二宮位將依命宮位置自動排列。
              </p>
              <ChartInputForm onSubmit={handleManualSubmit} situation={situation} />
            </motion.div>
          )}

          {view === 'report' && currentChart && (
            <motion.div
              key="report"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ReportView chart={currentChart} onBack={() => { setView('home'); setCurrentChart(null); }} />
            </motion.div>
          )}

          {view === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ChartHistory
                charts={savedCharts}
                onSelect={(chart) => { setCurrentChart(chart); setView('report'); }}
                onClose={() => setView('home')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/20 mt-16 py-6">
        <p className="text-center text-muted-foreground/30 text-xs font-display">
          紫微斗數復盤學習系統 — 福星何大師 © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};

export default Index;
