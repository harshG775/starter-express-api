const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
export async function deleteExpiredRefreshTokens() {
    const now = new Date();
    try {
        const result = await prisma.token.deleteMany({
            where: {
                expiresAt: {
                    lt: now,
                },
            },
        });
        console.log(`Deleted ${result.count} expired refresh tokens`);
    } catch (error) {
        console.error("Error deleting expired refresh tokens:", error);
    }
}



