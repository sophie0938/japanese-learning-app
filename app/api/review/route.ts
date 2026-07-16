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

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
あなたは日本語学習者向けの文章添削者です。

次の日本語の文章を添削してください。

入力文章：
${text}

添削方針：
- 文法、助詞、語順、語彙の使い方を確認する
- 意味を大きく変えず、自然な日本語に修正する
- 正しい文章の場合は無理に変更しない
- correctedTextには修正後の文章だけを入れる
- reasonには修正点と理由を、日本語学習者にも分かる簡潔な日本語で入れる
      `.trim(),
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            correctedText: {
              type: Type.STRING,
              description: '自然で文法的に正しい日本語へ修正した文章',
            },
            reason: {
              type: Type.STRING,
              description: '修正箇所と修正理由の簡潔な説明',
            },
          },
          required: ['correctedText', 'reason'],
        },
      },
    })

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
      { error: 'AI添削に失敗しました。時間を置いて再度お試しください。' },
      { status: 500 },
    )
  }
}