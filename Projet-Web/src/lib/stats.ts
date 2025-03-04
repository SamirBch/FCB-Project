import { db } from "./db"; 

export default async function GetStats(season: string) {
    const topScorers = await db.video.groupBy({
        by: ['scorer'],
        where: {
            season: season, // Filtrer par saison
        },
        _count: {
            scorer: true,
        },
        orderBy: {
            _count: {
                scorer: 'desc',
            },
        },
        take: 5,
    });

    const topAssists = await db.video.groupBy({
        by: ['assist'],
        where: {
            season: season, // Filtrer par saison
        },
        _count: {
          assist: true,
        },
        orderBy: {
          _count: {
            assist: 'desc',
          },
        },
        take: 5,
    });

    return {
        body: {
            topScorers,
            topAssists,
        },
    };
}
