import { prisma } from '../../../../lib/prisma';
import cron from 'node-cron';

cron.schedule('0 * * * *', async () => {
    try {
        const result = await prisma.passwordResetToken.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date()
                }
            }
        });

        console.log(`[CRON] Tokens expirados removidos: ${result.count}`);
    } catch (error) {
        console.error('[CRON] Erro ao limpar tokens expirados:', error);
    }
});