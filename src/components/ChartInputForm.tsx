import { useState } from 'react';
import {
  EARTHLY_BRANCHES, MAIN_STARS, LUCKY_STARS, EVIL_STARS, HUA_TYPES,
  PalaceData, EarthlyBranch, MainStar, LuckyStar, EvilStar, HuaType,
  getPalaceAssignments, ChartData,
} from '@/lib/ziwei-types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ChartInputFormProps {
  onSubmit: (chart: Omit<ChartData, 'id' | 'date' | 'report'>) => void;
  situation: string;
}

interface PalaceInput {
  mainStars: MainStar[];
  luckyStars: LuckyStar[];
  evilStars: EvilStar[];
  huaStars: { star: MainStar; hua: HuaType }[];
}

const emptyPalaceInput = (): PalaceInput => ({
  mainStars: [], luckyStars: [], evilStars: [], huaStars: [],
});

const ChartInputForm = ({ onSubmit, situation }: ChartInputFormProps) => {
  const [mingGong, setMingGong] = useState<EarthlyBranch>('寅');
  const [shenGong, setShenGong] = useState<EarthlyBranch>('午');
  const [palaceInputs, setPalaceInputs] = useState<Record<string, PalaceInput>>(
    () => Object.fromEntries(EARTHLY_BRANCHES.map(b => [b, emptyPalaceInput()]))
  );
  const [activeBranch, setActiveBranch] = useState<EarthlyBranch>('寅');

  const assignments = getPalaceAssignments(mingGong);

  const toggleStar = <T extends string>(arr: T[], star: T): T[] =>
    arr.includes(star) ? arr.filter(s => s !== star) : [...arr, star];

  const updatePalace = (branch: EarthlyBranch, update: Partial<PalaceInput>) => {
    setPalaceInputs(prev => ({ ...prev, [branch]: { ...prev[branch], ...update } }));
  };

  const addHua = (branch: EarthlyBranch, star: MainStar, hua: HuaType) => {
    setPalaceInputs(prev => ({
      ...prev,
      [branch]: {
        ...prev[branch],
        huaStars: [...prev[branch].huaStars.filter(h => h.hua !== hua), { star, hua }],
      },
    }));
  };

  const removeHua = (branch: EarthlyBranch, hua: HuaType) => {
    setPalaceInputs(prev => ({
      ...prev,
      [branch]: {
        ...prev[branch],
        huaStars: prev[branch].huaStars.filter(h => h.hua !== hua),
      },
    }));
  };

  const handleSubmit = () => {
    const palaces: PalaceData[] = EARTHLY_BRANCHES.map(branch => ({
      branch,
      palace: assignments[branch],
      ...palaceInputs[branch],
    }));
    onSubmit({ mingGongBranch: mingGong, shenGongBranch: shenGong, palaces, situation });
  };

  const current = palaceInputs[activeBranch];

  return (
    <div className="space-y-6">
      {/* Ming Gong & Shen Gong Selection */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-primary font-display">命宮地支</Label>
          <Select value={mingGong} onValueChange={(v) => setMingGong(v as EarthlyBranch)}>
            <SelectTrigger className="bg-muted border-border"><SelectValue /></SelectTrigger>
            <SelectContent>
              {EARTHLY_BRANCHES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-primary font-display">身宮地支</Label>
          <Select value={shenGong} onValueChange={(v) => setShenGong(v as EarthlyBranch)}>
            <SelectTrigger className="bg-muted border-border"><SelectValue /></SelectTrigger>
            <SelectContent>
              {EARTHLY_BRANCHES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Palace selector tabs */}
      <div>
        <Label className="text-primary font-display mb-2 block">選擇宮位配置星曜</Label>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-1">
          {EARTHLY_BRANCHES.map(b => (
            <button
              key={b}
              onClick={() => setActiveBranch(b)}
              className={`px-2 py-1.5 rounded text-xs font-display transition-all ${
                activeBranch === b
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {b}（{assignments[b]}）
            </button>
          ))}
        </div>
      </div>

      {/* Star input for active palace */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-4">
        <h3 className="font-display text-primary text-sm">
          {activeBranch}宮 — {assignments[activeBranch]} 星曜配置
        </h3>

        {/* Main stars */}
        <div>
          <Label className="text-xs text-muted-foreground">主星（可選 0-2 顆）</Label>
          <div className="flex flex-wrap gap-1 mt-1">
            {MAIN_STARS.map(s => (
              <button
                key={s}
                onClick={() => {
                  if (current.mainStars.includes(s)) {
                    updatePalace(activeBranch, { mainStars: current.mainStars.filter(x => x !== s) });
                  } else if (current.mainStars.length < 2) {
                    updatePalace(activeBranch, { mainStars: [...current.mainStars, s] });
                  }
                }}
                className={`px-2 py-1 rounded text-xs transition-all ${
                  current.mainStars.includes(s)
                    ? 'bg-primary/20 text-primary border border-primary/40'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Lucky stars */}
        <div>
          <Label className="text-xs text-muted-foreground">吉星</Label>
          <div className="flex flex-wrap gap-1 mt-1">
            {LUCKY_STARS.map(s => (
              <button
                key={s}
                onClick={() => updatePalace(activeBranch, { luckyStars: toggleStar(current.luckyStars, s) })}
                className={`px-2 py-1 rounded text-xs transition-all ${
                  current.luckyStars.includes(s)
                    ? 'bg-celestial/20 text-celestial border border-celestial/40'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Evil stars */}
        <div>
          <Label className="text-xs text-muted-foreground">煞星</Label>
          <div className="flex flex-wrap gap-1 mt-1">
            {EVIL_STARS.map(s => (
              <button
                key={s}
                onClick={() => updatePalace(activeBranch, { evilStars: toggleStar(current.evilStars, s) })}
                className={`px-2 py-1 rounded text-xs transition-all ${
                  current.evilStars.includes(s)
                    ? 'bg-crimson/20 text-crimson border border-crimson/40'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Hua stars */}
        <div>
          <Label className="text-xs text-muted-foreground">四化星（需先選擇主星）</Label>
          {current.mainStars.length > 0 ? (
            <div className="space-y-2 mt-1">
              {HUA_TYPES.map(hua => {
                const existing = current.huaStars.find(h => h.hua === hua);
                return (
                  <div key={hua} className="flex items-center gap-2">
                    <span className="text-xs text-accent w-12">{hua}</span>
                    <Select
                      value={existing?.star || '__none__'}
                      onValueChange={(v) => {
                        if (v === '__none__') removeHua(activeBranch, hua);
                        else addHua(activeBranch, v as MainStar, hua);
                      }}
                    >
                      <SelectTrigger className="bg-muted border-border h-7 text-xs w-28">
                        <SelectValue placeholder="—" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">—</SelectItem>
                        {current.mainStars.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground/50 mt-1">請先選擇主星</p>
          )}
        </div>
      </div>

      <Button onClick={handleSubmit} className="w-full font-display text-base bg-primary text-primary-foreground hover:bg-primary/90">
        生成命盤與解析報告
      </Button>
    </div>
  );
};

export default ChartInputForm;
