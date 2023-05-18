const { Console } = require('console');
var express = require('express')
const mysql = require('mysql2');
const db = mysql.createConnection({
    host: "sql7.freesqldatabase.com",
      port: 3306,
      user: "sql7619301",
      password: "2kM3dH4h7x",
      database: 'sql7619301',
      multipleStatements: true,
      debug: false,
})
var app = express()

app.use(express.json());           //accept data in JSON format
app.use(express.urlencoded({ extended: true }));
var sqlquery = [`SELECT pl.username,
max(CASE WHEN l.levelID=6 THEN p.score ELSE NULL END) AS Level_3,
max(CASE WHEN l.levelID=7 THEN p.score ELSE NULL END) AS Level_4,
max(CASE WHEN l.levelID=8 THEN p.score ELSE NULL END) AS Level_5,
max(CASE WHEN l.levelID=9 THEN p.score ELSE NULL END) AS Level_6,
max(CASE WHEN l.levelID=10 THEN p.score ELSE NULL END) AS Level_7,
max(CASE WHEN l.levelID=11 THEN p.score ELSE NULL END) AS Level_8,
max(CASE WHEN l.levelID=12 THEN p.score ELSE NULL END) AS Level_9
FROM Progress p INNER JOIN Level l ON p.levelID = l.levelID, Player pl
WHERE p.playerID = pl.playerID
GROUP BY pl.username;`,
`SELECT l.levelName,
l.levelID,
COUNT(p.progressID) AS no_player, -- need count for item only
MAX(p.score) AS Best_Score,
(SELECT pl.username FROM Progress p, Player pl 
 WHERE p.playerID = pl.playerID AND p.score = 
   (SELECT MAX(score) FROM Progress p2 WHERE p2.levelID = l.levelID LIMIT 1)) AS Best_score,
MIN(CASE WHEN l.levelID BETWEEN 6 AND 12 THEN p.time ELSE 100000 END) AS Best_Time,
(SELECT pl.username FROM Progress p, Player pl 
 WHERE p.playerID = pl.playerID AND p.time = 
   (SELECT MIN(time) FROM Progress p2 WHERE p2.levelID = l.levelID LIMIT 1)) AS Best_time,
AVG(p.score) AS AVG_Score,
AVG(p.time) AS AVG_Time
FROM Player pl,Progress p,Level l
WHERE p.levelID = l.levelID AND p.playerID = pl.playerID
GROUP BY l.levelName
ORDER BY l.levelID;

  `]
  
app.use('/js',express.static(__dirname+'/web'));
app.get('/',(req,res)=>{
  res.redirect('/pivot')  
})
app.get('/register',(req,res)=>{
  generateHash("hi")
  res.sendFile(__dirname+"/web/register.html")
})
app.get('/pivot',async(req,res)=>{
  res.sendFile(__dirname+"/web/pivot.html")
  generateHash("Ss12354678")
})
app.get('/cross',async(req,res)=>{
  res.sendFile(__dirname+"/web/cross.html")
})
app.post('/registerData',async(req,res)=>{
  var pass = generateHash(req.body.pass);
  var sql = `INSERT INTO Player(email, hash, salt, username) VALUES ('${req.body.email}','${pass.hash}',${pass.salt},'${req.body.user}');`;
try {
  await db.promise().query(sql);
  res.send("0")
} catch (error) {console.log(error)
  res.send("1")
}
  
  // "SELECT password FROM Player WHERE username = '"+req.body.username+"' AND password = '"+req.body.password
})

app.post('/getData',async(req, res)=> {
  console.log(typeof(req.body.detail))
    const result = await db.promise().query(sqlquery[req.body.detail])
      res.send(result[0])
})
app.listen(3000);

function generateHash(password) {
  var hash = 0, count =10;
  const salt = Math.floor(Math.random() * 1000000);
for (let index = 0; index < password.length; index++) {
  const element = password[index];
    hash += element.charCodeAt(0)* Math.pow(10,count-index) + salt;
}
  return {"hash":hash.toString(16),"salt": salt};
}
