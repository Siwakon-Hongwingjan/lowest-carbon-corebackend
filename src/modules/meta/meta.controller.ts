import { Elysia } from "elysia"

export const metaController = new Elysia({ prefix: "/meta" })
  .get("/activity-types", () => ({
    success: true,
    transport: ["BTS", "MRT", "Bus", "Walk", "Motorbike", "Taxi", "Bike"],
    // FOOD and OTHER are free-text; frontend should allow typing anything.
    food: [],
    other: []
  }))
