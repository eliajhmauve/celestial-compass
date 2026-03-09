import { PalaceData, EARTHLY_BRANCHES, BRANCH_GRID_POSITIONS, EarthlyBranch } from '@/lib/ziwei-types';

interface ChartGridProps {
  palaces: PalaceData[];
  shenGongBranch: EarthlyBranch;
}

const GRID_ORDER: EarthlyBranch[] = [
  '巳', '午', '未', '申',
  '辰', '酉',
  '卯', '戌',
  '寅', '丑', '子', '亥',
];

const ChartGrid = ({ palaces, shenGongBranch }: ChartGridProps) => {
  const palaceMap = new Map(palaces.map(p => [p.branch, p]));

  const renderCell = (branch: EarthlyBranch) => {
    const p = palaceMap.get(branch);
    if (!p) return null;
    const isShen = branch === shenGongBranch;
    const isMing = p.palace === '命宮';

    return (
      <div
        key={branch}
        className={`palace-cell flex flex-col gap-0.5 text-[10px] md:text-xs transition-all hover:bg-muted/30 ${
          isMing ? 'border-primary/50 border-glow' : ''
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-0.5">
          <span className="text-primary font-display text-xs md:text-sm font-bold">
            {p.palace}
            {isShen && <span className="text-accent ml-0.5">（身）</span>}
          </span>
          <span className="text-muted-foreground font-display">{branch}</span>
        </div>

        {/* Main stars */}
        {p.mainStars.length > 0 ? (
          <div className="flex flex-wrap gap-0.5">
            {p.mainStars.map(s => (
              <span key={s} className="star-tag-main font-bold">{s}</span>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground/40 text-[9px]">空宮</span>
        )}

        {/* Lucky stars */}
        {p.luckyStars.length > 0 && (
          <div className="flex flex-wrap gap-0.5">
            {p.luckyStars.map(s => (
              <span key={s} className="star-tag-lucky">{s}</span>
            ))}
          </div>
        )}

        {/* Evil stars */}
        {p.evilStars.length > 0 && (
          <div className="flex flex-wrap gap-0.5">
            {p.evilStars.map(s => (
              <span key={s} className="star-tag-evil">{s}</span>
            ))}
          </div>
        )}

        {/* Hua stars */}
        {p.huaStars.length > 0 && (
          <div className="flex flex-wrap gap-0.5">
            {p.huaStars.map((h, i) => (
              <span key={i} className="star-tag-hua">{h.star}{h.hua}</span>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-4 gap-px bg-border/30 border border-border rounded-lg overflow-hidden">
        {/* Row 0: 巳午未申 */}
        {renderCell('巳')}
        {renderCell('午')}
        {renderCell('未')}
        {renderCell('申')}

        {/* Row 1: 辰 [center] [center] 酉 */}
        {renderCell('辰')}
        <div className="col-span-2 row-span-2 flex items-center justify-center bg-background/50 p-4">
          <div className="text-center">
            <p className="font-display text-primary text-lg md:text-xl text-glow-gold">紫微斗數</p>
            <p className="text-muted-foreground text-xs mt-1">天象命盤</p>
            <p className="text-accent text-[10px] mt-2 font-display">福星何大師</p>
          </div>
        </div>
        {renderCell('酉')}

        {/* Row 2: 卯 [center cont.] [center cont.] 戌 */}
        {renderCell('卯')}
        {renderCell('戌')}

        {/* Row 3: 寅丑子亥 */}
        {renderCell('寅')}
        {renderCell('丑')}
        {renderCell('子')}
        {renderCell('亥')}
      </div>
    </div>
  );
};

export default ChartGrid;
