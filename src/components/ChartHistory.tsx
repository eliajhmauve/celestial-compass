import { ChartData } from '@/lib/ziwei-types';
import { Button } from '@/components/ui/button';

interface ChartHistoryProps {
  charts: ChartData[];
  onSelect: (chart: ChartData) => void;
  onClose: () => void;
}

const ChartHistory = ({ charts, onSelect, onClose }: ChartHistoryProps) => {
  if (charts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground font-display">尚無復盤記錄</p>
        <p className="text-muted-foreground/60 text-sm mt-2">開始生成或輸入命盤以建立案例資料庫</p>
        <Button variant="outline" onClick={onClose} className="mt-4">返回</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-lg text-primary text-glow-gold">復盤資料庫</h2>
        <Button variant="outline" size="sm" onClick={onClose}>返回</Button>
      </div>
      <div className="grid gap-3">
        {charts.map(chart => {
          const mingStars = chart.palaces.find(p => p.palace === '命宮')?.mainStars.join('、') || '空宮';
          return (
            <button
              key={chart.id}
              onClick={() => onSelect(chart)}
              className="bg-card border border-border rounded-lg p-4 text-left hover:border-primary/40 transition-all group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-display text-primary group-hover:text-glow-gold transition-all">
                    命宮 {chart.mingGongBranch}宮 — {mingStars}
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">
                    {chart.situation ? chart.situation.slice(0, 50) + (chart.situation.length > 50 ? '…' : '') : '無現況描述'}
                  </p>
                </div>
                <span className="text-muted-foreground text-xs">{chart.date}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChartHistory;
