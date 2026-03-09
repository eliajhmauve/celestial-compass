import { ChartData, PalaceData, PALACE_NAMES } from './ziwei-types';

function getPalace(chart: ChartData, name: string): PalaceData | undefined {
  return chart.palaces.find(p => p.palace === name);
}

function starsText(p: PalaceData): string {
  const parts: string[] = [];
  if (p.mainStars.length > 0) parts.push(`主星：${p.mainStars.join('、')}`);
  else parts.push('主星：空宮');
  if (p.luckyStars.length > 0) parts.push(`吉星：${p.luckyStars.join('、')}`);
  if (p.evilStars.length > 0) parts.push(`煞星：${p.evilStars.join('、')}`);
  if (p.huaStars.length > 0) parts.push(`四化：${p.huaStars.map(h => `${h.star}${h.hua}`).join('、')}`);
  return parts.join('；');
}

function analyzePalace(p: PalaceData, situation: string): string {
  const name = p.palace;
  const hasMain = p.mainStars.length > 0;
  const hasLucky = p.luckyStars.length > 0;
  const hasEvil = p.evilStars.length > 0;
  const hasHua = p.huaStars.length > 0;

  let text = `\n### ${name}（${p.branch}宮）\n\n`;
  text += `星曜配置：${starsText(p)}\n\n`;

  if (!hasMain) {
    text += `此宮為空宮，缺少主星坐鎮，主事氣場較弱，容易受對宮與三方四正的星曜影響。空宮並非無力，而是更需借助外力與環境機遇。命主在此領域需要更多自主意識與積極經營。\n\n`;
  } else {
    const starNames = p.mainStars.join('、');
    if (p.mainStars.length >= 2) {
      text += `${starNames}雙星同宮，形成獨特的雙星格局。兩顆主星的能量在此交匯，既有互補之勢，亦存相剋之機。命主在${name.replace('宮', '')}領域中，需在兩種力量間取得平衡，方能發揮最大優勢。\n\n`;
    } else {
      text += `${starNames}獨坐此宮，星曜能量集中而純粹。此星性質直接影響命主在${name.replace('宮', '')}領域的核心表現與發展方向。\n\n`;
    }
  }

  if (hasLucky) {
    text += `吉星${p.luckyStars.join('、')}入宮，為此宮帶來貴人相助、才華展現的機會。吉星的存在如同春風化雨，能夠柔化困難、增添順遂之氣。\n\n`;
  }

  if (hasEvil) {
    text += `煞星${p.evilStars.join('、')}同宮，帶來挑戰與考驗。煞星並非全然不吉，有時反而激發命主的鬥志與潛能，在逆境中鍛造出更強的意志力。然而仍需注意衝動、阻礙與人際摩擦。\n\n`;
  }

  if (hasHua) {
    for (const h of p.huaStars) {
      switch (h.hua) {
        case '化祿':
          text += `${h.star}化祿入此宮，帶來豐盛與順遂的能量。化祿象徵財富、機遇與圓滿，命主在此領域容易獲得物質與精神的雙重收穫。\n\n`;
          break;
        case '化權':
          text += `${h.star}化權入此宮，賦予命主強大的掌控力與領導氣場。化權象徵權力、決斷與主導，命主在此領域傾向主動出擊、掌握主導權。\n\n`;
          break;
        case '化科':
          text += `${h.star}化科入此宮，帶來聲名、學識與貴人的助力。化科象徵智慧、名聲與文雅，命主在此領域容易獲得認可與尊重。\n\n`;
          break;
        case '化忌':
          text += `${h.star}化忌入此宮，帶來執著、糾結與阻礙的能量。化忌象徵困擾、牽絆與不順，命主在此領域需格外謹慎，避免過度執著而陷入困境。\n\n`;
          break;
      }
    }
  }

  return text;
}

export function generateReport(chart: ChartData): string {
  const ming = getPalace(chart, '命宮')!;
  const cai = getPalace(chart, '財帛宮')!;
  const guan = getPalace(chart, '官祿宮')!;
  const qian = getPalace(chart, '遷移宮')!;

  let report = `# 紫微斗數命盤解析報告\n\n`;
  report += `**解盤日期：** ${new Date().toLocaleDateString('zh-TW')}\n\n`;
  report += `**命宮地支：** ${chart.mingGongBranch}宮\n\n`;
  report += `**身宮位置：** ${chart.shenGongBranch}宮\n\n`;
  report += `---\n\n`;

  // 命宮格局
  report += `## 一、命宮格局——人格與人生核心\n\n`;
  report += `命宮為紫微斗數的核心，是命主一生的根本所在。命宮坐落${ming.branch}宮，`;
  if (ming.mainStars.length > 0) {
    report += `${ming.mainStars.join('、')}坐鎮命宮，奠定了命主的基本性格與人生基調。`;
  } else {
    report += `命宮為空宮，借對宮星曜之力，命主性格較為靈活多變，易受環境影響。`;
  }
  report += `\n\n${starsText(ming)}\n\n`;

  if (ming.mainStars.includes('紫微')) {
    report += `紫微星為帝星，坐命之人天生具有領袖氣質，行事果斷、氣度恢宏。然帝星亦需輔佐之星相伴，方能真正發揮其至尊格局。若無吉星相扶，則易有孤高之嫌。\n\n`;
  }
  if (ming.mainStars.includes('天機')) {
    report += `天機星為智慧之星，主思維敏捷、善於策劃。命主心思細膩，具有優秀的分析能力與應變能力，但有時過於算計反而失去直覺的力量。\n\n`;
  }
  if (ming.mainStars.includes('太陽')) {
    report += `太陽星為光明之星，主博愛、熱情、積極。命主性格開朗大方，樂於助人，具有強烈的正義感與使命感。然太陽過於耀眼，有時忽略自身需求。\n\n`;
  }

  // 三方四正
  report += `## 二、三方四正——命運的四維結構\n\n`;
  report += `三方四正是紫微斗數中判斷命格的核心框架，由命宮、財帛宮、官祿宮、遷移宮四者構成命運的四維結構。\n\n`;
  report += `- **命宮（${ming.branch}）：** ${ming.mainStars.length > 0 ? ming.mainStars.join('、') : '空宮'}\n`;
  report += `- **財帛宮（${cai.branch}）：** ${cai.mainStars.length > 0 ? cai.mainStars.join('、') : '空宮'}\n`;
  report += `- **官祿宮（${guan.branch}）：** ${guan.mainStars.length > 0 ? guan.mainStars.join('、') : '空宮'}\n`;
  report += `- **遷移宮（${qian.branch}）：** ${qian.mainStars.length > 0 ? qian.mainStars.join('、') : '空宮'}\n\n`;

  const totalLucky = [ming, cai, guan, qian].reduce((s, p) => s + p.luckyStars.length, 0);
  const totalEvil = [ming, cai, guan, qian].reduce((s, p) => s + p.evilStars.length, 0);

  if (totalLucky > totalEvil) {
    report += `三方四正整體吉星力量強於煞星，命格根基穩固，人生發展順遂，具備成就大事的潛力。吉星的護持讓命主在事業、財運與社交各方面都能獲得較多助力。\n\n`;
  } else if (totalEvil > totalLucky) {
    report += `三方四正煞星力量較為集中，命格中帶有較多挑戰。然而「煞星鍛造英雄」，歷經考驗的命主往往能夠淬煉出更強的意志與能力。關鍵在於如何化煞為用，轉危為機。\n\n`;
  } else {
    report += `三方四正吉煞平衡，命格中順逆交織。命主人生如同太極之道，陰陽互補、動靜相宜。在每一次挑戰中都蘊含機遇，在每一次順境中也需居安思危。\n\n`;
  }

  // 逐宮解析
  report += `## 三、十二宮位逐宮解析\n\n`;
  report += `以下依據十二宮位逐一解析命主在各人生領域的星曜配置與運勢走向：\n\n`;

  for (const palace of chart.palaces) {
    report += analyzePalace(palace, chart.situation);
  }

  // 結合現況
  if (chart.situation && chart.situation.trim().length > 0) {
    report += `## 四、結合現況分析\n\n`;
    report += `根據命主所述現況：「${chart.situation}」\n\n`;
    
    report += `從命盤結構來看，命主目前所面臨的處境與命盤中的星曜配置有著深刻的呼應關係。`;
    
    if (getPalace(chart, '官祿宮')!.mainStars.length > 0) {
      report += `官祿宮有${getPalace(chart, '官祿宮')!.mainStars.join('、')}坐鎮，在事業方面具有明確的方向感與發展潛力。`;
    }
    if (getPalace(chart, '財帛宮')!.mainStars.length > 0) {
      report += `財帛宮見${getPalace(chart, '財帛宮')!.mainStars.join('、')}，財運方面有其獨特的運作模式與機遇窗口。`;
    }
    
    report += `\n\n命主當前的人生階段，正是命盤能量展現的關鍵時期。建議命主順應星曜的指引，在自身優勢領域持續深耕，同時留意命盤中煞星所示的潛在風險，做好防範與應對準備。\n\n`;
    
    report += `紫微斗數所揭示的並非不可改變的宿命，而是一張人生的星象地圖。了解自身的命盤格局，就是掌握了人生導航的羅盤。命主當以此為參照，在順境中不驕不躁，在逆境中不屈不撓，方能活出命盤中最璀璨的星光。\n\n`;
  }

  report += `## 五、總結與建議\n\n`;
  report += `綜觀全盤，命宮坐${ming.branch}宮，`;
  if (ming.mainStars.length > 0) {
    report += `${ming.mainStars.join('、')}為命主之根本。`;
  } else {
    report += `空宮借力，靈活應變。`;
  }
  report += `身宮落${chart.shenGongBranch}宮，後天努力的方向與先天命格相互輝映。\n\n`;
  
  const allHua = chart.palaces.flatMap(p => p.huaStars.map(h => `${h.star}${h.hua}落${p.palace}`));
  if (allHua.length > 0) {
    report += `四化流轉：${allHua.join('、')}。四化星的分布揭示了命主此生能量流動的方向與重點領域。\n\n`;
  }

  report += `命盤如鏡，映照天地之間的因緣際會。星曜的排列並非枷鎖，而是指引。願命主以智慧觀照命盤，以行動創造未來，在星辰的指引下，走出屬於自己的璀璨人生。\n\n`;
  report += `---\n\n*此報告由「福星何大師」紫微斗數復盤學習系統生成。命理分析僅供參考，人生的選擇始終掌握在自己手中。*\n`;

  return report;
}
