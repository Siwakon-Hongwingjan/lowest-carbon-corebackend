import "dotenv/config"
import type { Message, WebhookEvent } from "@line/bot-sdk"
import { Client } from "@line/bot-sdk"

const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN || ""
const channelSecret = process.env.LINE_CHANNEL_SECRET || ""

console.log(channelAccessToken)
console.log(channelSecret)
if (!channelAccessToken || !channelSecret) {
  // eslint-disable-next-line no-console
  console.warn("LINE credentials missing. Set LINE_CHANNEL_ACCESS_TOKEN and LINE_CHANNEL_SECRET.")
}

const lineConfig = {
  channelAccessToken,
  channelSecret,
}

export function createLineClient() {
  return new Client(lineConfig)
}

export async function replyMessage(replyToken: string, messages: Message | Message[]) {
  const client = createLineClient()
  return client.replyMessage(replyToken, messages)
}

export type LineTextEvent = WebhookEvent & {
  type: "message"
  message: {
    type: "text"
    text: string
  }
  source: {
    userId?: string
  }
}
