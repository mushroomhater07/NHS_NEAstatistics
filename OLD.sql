SELECT 
    l.levelName,
    l.levelID,
    COUNT(p.progressID) AS no_player, -- need count for item only
    MAX(p.score) AS Best_Score,
    (
      SELECT pl.username 
      FROM Progress p, Player pl 
      WHERE p.playerID = pl.playerID AND p.score = 
     (SELECT MAX(score) FROM Progress p2 WHERE p2.levelID = l.levelID LIMIT 1)) AS Best_score,
    MIN(CASE WHEN l.levelID BETWEEN 6 AND 12 THEN p.time ELSE 100000 END) AS Best_Time,
    (
      SELECT pl.username 
      FROM Progress p, Player pl 
    WHERE p.playerID = pl.playerID AND p.time = 
     (SELECT MIN(time) FROM Progress p2 WHERE p2.levelID = l.levelID LIMIT 1)) AS Best_time,
  AVG(p.score) AS AVG_Score,
  AVG(p.time) AS AVG_Time
  FROM Player pl,Progress p,Level l
  WHERE p.levelID = l.levelID AND p.playerID = pl.playerID
GROUP BY l.levelName
ORDER BY l.levelID;