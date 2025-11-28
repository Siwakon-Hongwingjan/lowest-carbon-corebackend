export const env = {
    DATABASE_URL : process.env.DATABASE_URL!,
    AI_URL : process.env.AI_URL!,
    JWT_SECRET : process.env.JWT_SECRET || "supersecret",
    GCS_BUCKET: process.env.GCS_BUCKET,
    GCS_SERVICE_ACCOUNT: process.env.GCS_SERVICE_ACCOUNT, // base64-encoded JSON
}
