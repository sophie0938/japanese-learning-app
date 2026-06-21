import type { Word } from '@/types/word'

/**
 * プロトタイプ用の単語データ。
 * 後で Supabase の words テーブルから取得する処理に差し替えます。
 */
export const WORDS: Word[] = [
  {
    id: '1',
    word: '曖昧',
    meaning: 'はっきりせず、どちらとも決められない様子。',
    example: '彼の返事は曖昧で、結局どうしたいのか分からなかった。',
    level: 'N2',
  },
  {
    id: '2',
    word: '工夫',
    meaning: 'うまくいくように、あれこれ考えて手段をめぐらすこと。',
    example: '限られた時間で勉強するために、いろいろな工夫をしている。',
    level: 'N3',
  },
  {
    id: '3',
    word: '相変わらず',
    meaning: '以前と同じで、変化がない様子。',
    example: '久しぶりに会ったが、彼女は相変わらず元気そうだった。',
    level: 'N3',
  },
  {
    id: '4',
    word: '画期的',
    meaning: 'これまでにない新しい時代を開くほど、すばらしい様子。',
    example: 'その発明は、医療の世界に画期的な変化をもたらした。',
    level: 'N1',
  },
  {
    id: '5',
    word: '心がける',
    meaning: 'いつも忘れずに、そうしようと気をつけること。',
    example: '毎日少しずつでも日本語を書くように心がけている。',
    level: 'N2',
  },
  {
    id: '6',
    word: '手応え',
    meaning: '働きかけに対して返ってくる、確かな反応や感触。',
    example: '今日のプレゼンは、いつもより手応えを感じた。',
    level: 'N2',
  },
  {
    id: '7',
    word: 'おそらく',
    meaning: 'たぶん。きっとそうだろうと推測する様子。',
    example: 'この空模様だと、おそらく午後から雨になるだろう。',
    level: 'N4',
  },
  {
    id: '8',
    word: '納得',
    meaning: '他人の考えや行動を、もっともだと理解して受け入れること。',
    example: '丁寧に説明してもらって、ようやく納得できた。',
    level: 'N3',
  },
  {
    id: '9',
    word: '思い切って',
    meaning: 'ためらう気持ちを捨てて、大胆に行動する様子。',
    example: '思い切って苦手な人に話しかけてみたら、仲良くなれた。',
    level: 'N3',
  },
  {
    id: '10',
    word: '地道',
    meaning: '派手さはないが、まじめでこつこつと努力する様子。',
    example: '地道な練習を続けたおかげで、絵がうまくなった。',
    level: 'N2',
  },
  {
    id: '11',
    word: '見直す',
    meaning: '改めて確認すること。また、評価をよい方に改めること。',
    example: '提出する前に、もう一度文章を見直したほうがいい。',
    level: 'N4',
  },
  {
    id: '12',
    word: '充実',
    meaning: '必要なものが十分に備わり、内容が満ち足りていること。',
    example: '新しい仕事を始めてから、毎日が充実している。',
    level: 'N2',
  },
]

export function getWordById(id: string): Word | undefined {
  return WORDS.find((w) => w.id === id)
}
