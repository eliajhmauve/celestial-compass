import { ChartData } from '@/lib/ziwei-types';
import ChartGrid from './ChartGrid';

interface ReportViewProps {
  chart: ChartData;
  onBack: () => void;
}

const ReportView = ({ chart, onBack }: ReportViewProps) => {
  // Simple markdown to JSX renderer
  const renderMarkdown = (md: string) => {
    const lines = md.split('\n');
    const elements: JSX.Element[] = [];

    lines.forEach((line, i) => {
      if (line.startsWith('# ')) {
        elements.push(<h1 key={i} className="font-display text-2xl text-primary text-glow-gold mt-8 mb-4">{line.slice(2)}</h1>);
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={i} className="font-display text-xl text-primary mt-6 mb-3">{line.slice(3)}</h2>);
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={i} className="font-display text-lg text-accent mt-4 mb-2">{line.slice(4)}</h3>);
      } else if (line.startsWith('---')) {
        elements.push(<hr key={i} className="border-border my-6" />);
      } else if (line.startsWith('- **')) {
        const content = line.slice(2);
        elements.push(
          <li key={i} className="ml-4 text-foreground/80 text-sm mb-1" dangerouslySetInnerHTML={{
            __html: content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary">$1</strong>')
          }} />
        );
      } else if (line.startsWith('**')) {
        elements.push(
          <p key={i} className="text-foreground/90 text-sm mb-2" dangerouslySetInnerHTML={{
            __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary">$1</strong>')
          }} />
        );
      } else if (line.startsWith('*') && line.endsWith('*')) {
        elements.push(<p key={i} className="text-muted-foreground text-xs italic mt-4">{line.replace(/\*/g, '')}</p>);
      } else if (line.trim()) {
        elements.push(<p key={i} className="text-foreground/80 text-sm leading-relaxed mb-2">{line}</p>);
      }
    });

    return elements;
  };

  return (
    <div className="space-y-8">
      <button
        onClick={onBack}
        className="text-primary text-sm font-display hover:text-primary/80 transition-colors"
      >
        ← 返回首頁
      </button>

      <ChartGrid palaces={chart.palaces} shenGongBranch={chart.shenGongBranch} />

      {/* Summary */}
      <div className="bg-card border border-border rounded-lg p-4 md:p-6 space-y-3">
        <h2 className="font-display text-lg text-primary text-glow-gold">命盤摘要</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground text-xs">命宮主星</span>
            <p className="text-foreground font-display">
              {chart.palaces.find(p => p.palace === '命宮')?.mainStars.join('、') || '空宮'}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">身宮位置</span>
            <p className="text-foreground font-display">{chart.shenGongBranch}宮</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">四化落宮</span>
            <p className="text-foreground text-xs">
              {chart.palaces.flatMap(p => p.huaStars.map(h => `${h.hua}→${p.palace}`)).join('、') || '—'}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">解盤日期</span>
            <p className="text-foreground font-display">{chart.date}</p>
          </div>
        </div>
      </div>

      {/* Report */}
      {chart.report && (
        <div className="bg-card border border-border rounded-lg p-4 md:p-8">
          {renderMarkdown(chart.report)}
        </div>
      )}
    </div>
  );
};

export default ReportView;
