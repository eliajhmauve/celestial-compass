// 十二地支
export const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;
export type EarthlyBranch = typeof EARTHLY_BRANCHES[number];

// 十二宮位（固定順序）
export const PALACE_NAMES = [
  '命宮', '兄弟宮', '夫妻宮', '子女宮', '財帛宮', '疾厄宮',
  '遷移宮', '奴僕宮', '官祿宮', '田宅宮', '福德宮', '父母宮'
] as const;
export type PalaceName = typeof PALACE_NAMES[number];

// 十四主星
export const MAIN_STARS = [
  '紫微', '天機', '太陽', '武曲', '天同', '廉貞', '天府',
  '太陰', '貪狼', '巨門', '天相', '天梁', '七殺', '破軍'
] as const;
export type MainStar = typeof MAIN_STARS[number];

// 吉星
export const LUCKY_STARS = ['左輔', '右弼', '文昌', '文曲', '天魁', '天鉞'] as const;
export type LuckyStar = typeof LUCKY_STARS[number];

// 煞星
export const EVIL_STARS = ['擎羊', '陀羅', '火星', '鈴星', '地空', '地劫'] as const;
export type EvilStar = typeof EVIL_STARS[number];

// 四化
export const HUA_TYPES = ['化祿', '化權', '化科', '化忌'] as const;
export type HuaType = typeof HUA_TYPES[number];

// 單個宮位的資料
export interface PalaceData {
  branch: EarthlyBranch;
  palace: PalaceName;
  mainStars: MainStar[];
  luckyStars: LuckyStar[];
  evilStars: EvilStar[];
  huaStars: { star: MainStar; hua: HuaType }[];
}

// 完整命盤
export interface ChartData {
  id: string;
  date: string;
  mingGongBranch: EarthlyBranch;
  shenGongBranch: EarthlyBranch;
  palaces: PalaceData[];
  situation: string;
  report?: string;
}

// 地支在盤面上的座標位置（4x4 grid, 外圈）
// Layout:  巳  午  未  申
//          辰          酉
//          卯          戌
//          寅  丑  子  亥
export const BRANCH_GRID_POSITIONS: Record<EarthlyBranch, [number, number]> = {
  '巳': [0, 0], '午': [1, 0], '未': [2, 0], '申': [3, 0],
  '辰': [0, 1],                              '酉': [3, 1],
  '卯': [0, 2],                              '戌': [3, 2],
  '寅': [0, 3], '丑': [1, 3], '子': [2, 3], '亥': [3, 3],
};

// Get palace assignments based on ming gong branch
export function getPalaceAssignments(mingGongBranch: EarthlyBranch): Record<EarthlyBranch, PalaceName> {
  const startIdx = EARTHLY_BRANCHES.indexOf(mingGongBranch);
  const assignments: Record<string, PalaceName> = {};
  for (let i = 0; i < 12; i++) {
    const branchIdx = (startIdx + i) % 12;
    assignments[EARTHLY_BRANCHES[branchIdx]] = PALACE_NAMES[i];
  }
  return assignments as Record<EarthlyBranch, PalaceName>;
}

// Random chart generation
export function generateRandomChart(): Omit<ChartData, 'id' | 'date' | 'situation' | 'report'> {
  const mingIdx = Math.floor(Math.random() * 12);
  const mingGongBranch = EARTHLY_BRANCHES[mingIdx];
  
  // Random shen gong (身宮)
  const shenIdx = Math.floor(Math.random() * 12);
  const shenGongBranch = EARTHLY_BRANCHES[shenIdx];

  const assignments = getPalaceAssignments(mingGongBranch);

  // Distribute 14 main stars randomly
  const availableMainStars = [...MAIN_STARS];
  const palaceMainStars: Record<string, MainStar[]> = {};
  EARTHLY_BRANCHES.forEach(b => palaceMainStars[b] = []);

  // Shuffle and distribute
  for (const star of availableMainStars) {
    if (Math.random() > 0.15) { // 85% chance to place
      const branch = EARTHLY_BRANCHES[Math.floor(Math.random() * 12)];
      palaceMainStars[branch].push(star);
    }
  }

  // Distribute lucky stars
  const palaceLuckyStars: Record<string, LuckyStar[]> = {};
  EARTHLY_BRANCHES.forEach(b => palaceLuckyStars[b] = []);
  for (const star of LUCKY_STARS) {
    if (Math.random() > 0.4) {
      const branch = EARTHLY_BRANCHES[Math.floor(Math.random() * 12)];
      palaceLuckyStars[branch].push(star);
    }
  }

  // Distribute evil stars
  const palaceEvilStars: Record<string, EvilStar[]> = {};
  EARTHLY_BRANCHES.forEach(b => palaceEvilStars[b] = []);
  for (const star of EVIL_STARS) {
    if (Math.random() > 0.4) {
      const branch = EARTHLY_BRANCHES[Math.floor(Math.random() * 12)];
      palaceEvilStars[branch].push(star);
    }
  }

  // Generate 四化
  const huaAssignments: Record<string, { star: MainStar; hua: HuaType }[]> = {};
  EARTHLY_BRANCHES.forEach(b => huaAssignments[b] = []);
  const usedStarsForHua = new Set<string>();
  for (const hua of HUA_TYPES) {
    // Find a placed main star for this hua
    const placedStars = EARTHLY_BRANCHES.flatMap(b => 
      palaceMainStars[b].map(s => ({ star: s, branch: b }))
    ).filter(x => !usedStarsForHua.has(x.star));
    
    if (placedStars.length > 0) {
      const pick = placedStars[Math.floor(Math.random() * placedStars.length)];
      huaAssignments[pick.branch].push({ star: pick.star, hua });
      usedStarsForHua.add(pick.star);
    }
  }

  const palaces: PalaceData[] = EARTHLY_BRANCHES.map(branch => ({
    branch,
    palace: assignments[branch],
    mainStars: palaceMainStars[branch],
    luckyStars: palaceLuckyStars[branch],
    evilStars: palaceEvilStars[branch],
    huaStars: huaAssignments[branch],
  }));

  return { mingGongBranch, shenGongBranch, palaces };
}
