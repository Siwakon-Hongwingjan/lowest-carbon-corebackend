import { prisma } from "../modules/db/prisma"

export type UserProfile = {
  id: string
  lineUserId: string
  points: number
}

export async function findOrCreateUserByLineId(lineUserId: string): Promise<UserProfile> {
  const existing = await prisma.user.findUnique({
    where: { lineUserId },
    select: { id: true, lineUserId: true },
  })

  const user = existing
    ? existing
    : await prisma.user.create({
        data: {
          lineUserId,
        },
        select: { id: true, lineUserId: true },
      })

  // aggregate points
  const pointsAggregate = await prisma.pointsTransaction.aggregate({
    _sum: { points: true },
    where: { userId: user.id },
  })

  const points = pointsAggregate._sum.points ?? 0

  return {
    ...user,
    points,
  }
}
