import type { FlexMessage } from "@line/bot-sdk"

type PointsPayload = {
  points: number
  description?: string
}

export function buildPointsFlex({ points, description }: PointsPayload): FlexMessage {
  return {
    type: "flex",
    altText: "Green Points ของคุณ",
    contents: {
      type: "bubble",
      size: "mega",
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        paddingAll: "20px",
        contents: [
          {
            type: "text",
            text: "🌿 Green Points ของคุณ",
            weight: "bold",
            size: "lg",
            color: "#2E7D32",
          },
          {
            type: "separator",
            margin: "md",
            color: "#A5D6A7",
          },
          {
            type: "box",
            layout: "vertical",
            paddingAll: "16px",
            backgroundColor: "#E8F5E9",
            cornerRadius: "12px",
            contents: [
              {
                type: "text",
                text: "คุณมี",
                size: "sm",
                color: "#1B5E20",
              },
              {
                type: "text",
                text: `${points.toLocaleString()} คะแนน ✨`,
                weight: "bold",
                size: "xxl",
                color: "#1B5E20",
                margin: "sm",
              },
            ],
          },
          {
            type: "text",
            text: description ?? "ขอบคุณที่ช่วยลดคาร์บอนต่อไปนะ!",
            size: "sm",
            color: "#4CAF50",
            wrap: true,
            margin: "md",
          },
        ],
      },
    },
  }
}
