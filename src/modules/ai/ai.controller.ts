import { Elysia, t } from "elysia"
import { type AuthenticatedUser, unauthorizedBody } from "../../middlewares/auth"
import { calcCo2WithAI, dailyPlanner, identifyFoodImage } from "./ai.service"

type ActivityInput = {
  id: string
  category: string
  type: string
  value: number
  date: string
}

const activitySchema = t.Object({
  id: t.String(),
  category: t.String(),
  type: t.String(),
  value: t.Number(),
  date: t.String(),
})

export const aiController = new Elysia({ prefix: "/ai" }).post(
  "/calc_co2",
  async ({ body, user, set }: { body: { activities: ActivityInput[] }; user?: AuthenticatedUser; set: any }) => {
    if (!user) {
      set.status = 401
      return unauthorizedBody
    }
    return await calcCo2WithAI(body.activities, user.userId)
  },
  {
    body: t.Object({
      activities: t.Array(activitySchema),
    }),
  },
).post(
  "/identify_food_image",
  async ({ body, user, set }: { body: { imageUrl: string }; user?: AuthenticatedUser; set: any }) => {
    if (!user) {
      set.status = 401
      return unauthorizedBody
    }

    if (!body?.imageUrl) {
      set.status = 400
      return { message: "imageUrl is required" }
    }

    return await identifyFoodImage(body.imageUrl, user.userId)
  },
  {
    body: t.Object({
      imageUrl: t.String(),
    }),
  },
).post(
  "/daily_planner",
  async ({
    body,
    user,
    set,
  }: {
    body: { activities?: string[]; travel?: { origin: string; destination: string }[] }
    user?: AuthenticatedUser
    set: any
  }) => {
    if (!user) {
      set.status = 401
      return unauthorizedBody
    }
    return await dailyPlanner(body)
  },
  {
    body: t.Object({
      activities: t.Optional(t.Array(t.String())),
      travel: t.Optional(
        t.Array(
          t.Object({
            origin: t.String(),
            destination: t.String(),
          }),
        ),
      ),
    }),
  },
)
