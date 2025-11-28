import { Elysia, t } from "elysia"
import { getCarbonSummary } from "./carbon.service"

export const carbonController = new Elysia({ prefix: "/carbon" })
  .get(
    "/summary",
    async ({ query, user }: { query: { date: string }, user: any }) => {
      return await getCarbonSummary(query.date, user!)
    },
    {
      query: t.Object({
        date: t.String()
      })
    }
  )
