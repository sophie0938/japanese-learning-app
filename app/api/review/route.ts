import { GoogleGenAI, Type } from '@google/genai'
import { NextResponse } from 'next/server'
import type { FeedbackResult } from '@/types/feedback'

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      text?: string
    } | null

    const text = body?.text?.trim()

    if (!text) {
      return NextResponse.json(
        { error: '文章を入力してください。' },
        { status: 400 },
      )
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured')

      return NextResponse.json(
        { error: 'AI添削機能の設定が完了していません。' },
        { status: 500 },
      )
    }

    // AI応答時間を計測
    console.time('Gemini generation')

    const response = await ai.models.generateContent({
      // 速度重視モデル
      model: 'gemini-3.1-flash-lite',

      contents: `
あなたは日本語学習者向けの添削AIです。

以下の文章を添削してください。

入力文章：
${text}

ルール
- 文法・助詞・語順・語彙を確認する
- 意味は変えない
- 自然な日本語へ修正する
- 正しい文章なら変更しない
- correctedTextには修正文のみ
- reasonは100文字以内で簡潔に説明する
`.trim(),

      config: {
        // 出力を短く制限
        maxOutputTokens: 300,

        responseMimeType: 'application/json',

        responseSchema: {
          type: Type.OBJECT,
          properties: {
            correctedText: {
              type: Type.STRING,
              description: '修正後の文章',
            },
            reason: {
              type: Type.STRING,
              description: '修正理由（100文字以内）',
            },
          },
          required: ['correctedText', 'reason'],
        },
      },
    })

    console.timeEnd('Gemini generation')

    if (!response.text) {
      throw new Error('Geminiから添削結果を取得できませんでした。')
    }

    const parsed = JSON.parse(response.text) as FeedbackResult

    if (!parsed.correctedText || !parsed.reason) {
      throw new Error('Geminiの添削結果の形式が正しくありません。')
    }

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Gemini review error:', error)

    return NextResponse.json(
      {
        error: 'AI添削に失敗しました。時間を置いて再度お試しください。',
      },
      {
        status: 500,
      },
    )
  }
}