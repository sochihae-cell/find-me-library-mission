export const hangulRuleConsonants = ['ㅇ','ㅁ','ㅎ','ㅍ','ㅅ','ㅈ'] as const;
export type HangulRuleConsonant = typeof hangulRuleConsonants[number];

export const hangulRuleExamples:Record<HangulRuleConsonant,[string,number][]>= {
  'ㅇ':[['강',1],['공원',2],['강낭콩',3]],
  'ㅁ':[['모자',1],['마음',2],['마음만',3]],
  'ㅎ':[['하늘',1],['하늘과 호수',2],['하늘과 호수와 해변',3]],
  'ㅍ':[['포도',1],['포도와 피자',2],['포도와 피자와 풍선',3]],
  'ㅅ':[['사과',1],['사슴',2],['수선화',3]],
  'ㅈ':[['지도',1],['자전거',2],['자전거와 종',3]],
};

const zeroWords:Record<HangulRuleConsonant,string[]>= {
  'ㅇ':['책','기차','토끼','모자','바다'],
  'ㅁ':['책','기차','토끼','사과','바다'],
  'ㅎ':['책','기차','토끼','사과','바다'],
  'ㅍ':['책','기차','토끼','사과','바다'],
  'ㅅ':['바다','토끼','기차','구름','연필'],
  'ㅈ':['바다','토끼','나무','구름','연필'],
};

const oneWords:Record<HangulRuleConsonant,string[]>= {
  'ㅇ':['강','방','창','공','콩'],
  'ㅁ':['모자','미소','나무','문','섬'],
  'ㅎ':['하늘','학교','호수','해변','화분'],
  'ㅍ':['포도','피자','피아노','펭귄','풍선'],
  'ㅅ':['사과','수박','사진','산책','소풍'],
  'ㅈ':['지도','종이','장갑','사진','시장'],
};

export function countKoreanConsonant(text:string,target:HangulRuleConsonant){
  const jamo:Record<HangulRuleConsonant,string[]>= {
    'ㅇ':['ᄋ','ᆼ'],'ㅁ':['ᄆ','ᆷ'],'ㅎ':['ᄒ','ᇂ'],
    'ㅍ':['ᄑ','ᇁ'],'ㅅ':['ᄉ','ᆺ'],'ㅈ':['ᄌ','ᆽ'],
  };
  return [...text.normalize('NFD')].filter(ch=>jamo[target].includes(ch)).length;
}

function makeCandidate(consonant:HangulRuleConsonant,count:number,variant:number){
  if(count===0)return zeroWords[consonant][variant];
  const words=oneWords[consonant];
  return `${Array.from({length:count},(_,i)=>words[(variant+i)%words.length]).join(', ')} — 차례대로 쓴다.`;
}

export const hangulRuleBank:Record<HangulRuleConsonant,Record<number,string[]>>=Object.fromEntries(
  hangulRuleConsonants.map(consonant=>[consonant,Object.fromEntries(
    Array.from({length:10},(_,count)=>[count,Array.from({length:5},(_,variant)=>makeCandidate(consonant,count,variant))])
  )])
) as Record<HangulRuleConsonant,Record<number,string[]>>;

export const hangulRuleBankIsValid=hangulRuleConsonants.every(consonant=>
  Array.from({length:10},(_,count)=>hangulRuleBank[consonant][count].every(text=>countKoreanConsonant(text,consonant)===count)).every(Boolean)
);
