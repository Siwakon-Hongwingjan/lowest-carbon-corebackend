import type { Message } from "@line/bot-sdk"
import { replyMessage, type LineTextEvent } from "../../services/lineService"
import { findOrCreateUserByLineId } from "../../services/userService"
import { getPointsBalance } from "../point/point.service"
import { buildPointsFlex } from "../../utils/flexTemplates"

const POINT_KEYWORDS = ["แต้ม", "คะแนน", "point"]

export async function handleLineEvents(events: any[]) {
  await Promise.all(
    events.map(async (event: any) => {
      if (event.type !== "message" || event.message?.type !== "text") return
      await handleTextEvent(event as LineTextEvent)
    }),
  )
}

async function handleTextEvent(event: LineTextEvent) {
  const userId = event.source?.userId
  if (!userId) return

  const text = event.message?.text?.trim().toLowerCase() ?? ""
  const replyToken = event.replyToken

  try {
    const wantsPoints = POINT_KEYWORDS.includes(text)

    if (!wantsPoints) {
      await replyMessage(replyToken, defaultHelpMessage())
      return
    }

    const user = await findOrCreateUserByLineId(userId)
    const balanceResult = await getPointsBalance({ userId: user.id })
    const balance = balanceResult.balance ?? 0

    await replyMessage(replyToken, buildPointsMessage(balance))
  } catch (error) {
    console.error("LINE webhook error:", error)
    await replyMessage(replyToken, errorMessage())
  }
}

function buildPointsMessage(balance: number): Message {
  return buildPointsFlex({
    points: balance,
    description: "ขอบคุณที่ช่วยลดคาร์บอนต่อไปนะ! ✨",
  })
}

function defaultHelpMessage(): Message {
  return {
    type: "text",
    text: 'สวัสดี! พิมพ์ "แต้ม" หรือ "คะแนน" หรือ "point" เพื่อเช็คคะแนนสะสม 🌱',
  }
}

function errorMessage(): Message {
  return {
    type: "text",
    text: "ขออภัย ระบบขัดข้องชั่วคราว ลองใหม่อีกครั้งนะ",
  }
}
