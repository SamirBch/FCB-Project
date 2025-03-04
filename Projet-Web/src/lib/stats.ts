import { db } from "./db";

export default async function GetStats(season: string) {
    'use server';
    const topScorers = await db.video.groupBy({
        by: ['scorer'],
        where: { season },
        _count: { scorer: true },
        orderBy: { _count: { scorer: 'desc' } },
        take: 5,
    });

    const topAssists = await db.video.groupBy({
        by: ['assist'],
        where: { season },
        _count: { assist: true },
        orderBy: { _count: { assist: 'desc' } },
        take: 5,
    });

    // Récupérer le nombre de buts par match
    const goalsPerMatch = await db.video.groupBy({
        by: ['matchDate', 'opponent'],
        where: { season },
        _count: { id: true }, // Compte le nombre de vidéos (buts) par match
        orderBy: { matchDate: 'asc' },
    });

    return {
        body: {
            topScorers,
            topAssists,
            goalsPerMatch, // Ajout des buts par match
        },
    };
}
