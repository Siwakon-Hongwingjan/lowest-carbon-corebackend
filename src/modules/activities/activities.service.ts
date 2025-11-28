import { prisma } from "../db/prisma"
import { type AuthenticatedUser } from "../../middlewares/auth"
import { type CreateActivityBody, type UpdateActivityTypeBody } from "./activities.schema"

export async function createActivity(body: CreateActivityBody, user: AuthenticatedUser) {
  const { category, type, value, date, imageUrl, slipUrl } = body

  const resolvedType = type?.trim() || "PENDING_IMAGE"

  const activity = await prisma.activity.create({
    data: {
      category,
      type: resolvedType,
      value,
      date: new Date(date),
      imageUrl,
      slipUrl,
      userId: user.userId,
    },
  })

  return {
    success: true,
    message: "Activity created",
    activity
  }
}

export async function getActivitiesByDate(date: string, user: AuthenticatedUser) {
  const targetDate = new Date(date)
  const start = new Date(targetDate)
  start.setHours(0, 0, 0, 0)

  const end = new Date(targetDate)
  end.setHours(23, 59, 59, 999)

  const activities = await prisma.activity.findMany({
    where: {
      userId: user.userId,
      date: {
        gte: start,
        lte: end
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  return {
    success: true,
    date,
    activities
  }
}

export async function updateActivity(activityId: string , co2: number, user:any){
  const existing = await prisma.activity.findUnique({
    where: {
      id: activityId
    }
  })

  if(!existing || existing.userId !== user.userId){
    return {
      success: false,
      message: "Activity not found"
    }
  }
  
  if (existing.userId !== user.userId) { 
    return {
      success: false,
      message: "Forbidden activity does not belong to this user",
      status: 404
    }
  }

  const updated = await prisma.activity.update({
    where: {
      id : activityId
    },
    data: {
      co2,
    }
  })

  return {
    success: true,
    message : "Activity updated",
    activity : updated
  }
}

export async function updateActivityType(activityId: string, body: UpdateActivityTypeBody, user: AuthenticatedUser) {
  const existing = await prisma.activity.findUnique({
    where: { id: activityId },
  })

  if (!existing || existing.userId !== user.userId) {
    return {
      success: false,
      message: "Activity not found",
      status: 404,
    }
  }

  const updated = await prisma.activity.update({
    where: { id: activityId },
    data: { type: body.type.trim() },
  })

  return {
    success: true,
    message: "Activity type updated",
    activity: updated,
  }
}
