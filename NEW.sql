SELECT 
    l.levelName,
    l.levelID,
    COUNT(p.progressID) AS no_player, -- need count for item only
    MAX(p.score) AS Best_Score,
    (
        SELECT pl.username 
        FROM Progress p2
        JOIN Player pl ON p2.playerID = pl.playerID
        WHERE p2.levelID = l.levelID
        ORDER BY p2.score DESC
        LIMIT 1
    ) AS Best_score,
    MIN(CASE WHEN l.levelID BETWEEN 6 AND 12 THEN p.time ELSE 100000 END) AS Best_Time,
    (
        SELECT pl.username 
        FROM Progress p3
        JOIN Player pl ON p3.playerID = pl.playerID
        WHERE p3.levelID = l.levelID
        ORDER BY p3.time ASC
        LIMIT 1
    ) AS Best_time,
    AVG(p.score) AS AVG_Score,
    AVG(p.time) AS AVG_Time
FROM 
    Player pl
JOIN Progress p ON p.playerID = pl.playerID
JOIN Level l ON p.levelID = l.levelID
GROUP BY l.levelName
ORDER BY l.levelID;