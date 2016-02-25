
var express = require('express');
var app = express();
var sentiment = require('sentiment');
var fs = require("fs");
/*
    Sentiment Analysis
*/
var files = [
	"public/gsw_data/gsw_1.json",
	"public/gsw_data/gsw_2.json",
	"public/gsw_data/gsw_3.json",
	"public/gsw_data/gsw_4.json",
	"public/gsw_data/gsw_5.json",
	"public/gsw_data/gsw_6.json",
	"public/gsw_data/gsw_7.json",
	"public/gsw_data/gsw_8.json",
	"public/gsw_data/gsw_9.json",
	"public/gsw_data/gsw_10.json"
]
var geostuff = [];
for (var j = 0; j < files.length; j++) {
    var contents = fs.readFileSync(files[j]);
    var data = JSON.parse(contents);
    for (var i = 0; i < data.length; i++) {
        if (data[i].geo.coordinates[0] >= 25
            && data[i].geo.coordinates[0] <= 50
            && data[i].geo.coordinates[1] >= -125
            && data[i].geo.coordinates[1] <= -65) {
        var s = sentiment(data[i].text);
        var positive = false;
        if (s.score > 0) {
            positive = true;
        }
        geostuff.push(
            {
                "lat": data[i].geo.coordinates[0],
                "lon": data[i].geo.coordinates[1],
                "positive": positive,
                "days_ago": twitterDate(data[i].created_at)
            });
        }
    }
}

var games = fs.readFileSync("public/gsw_data/warriors_games.json");
var games_data = JSON.parse(games);
var gsw_games = {};
for (var k = 0; k < games_data.length; k++) {
	games_data[k].days_ago = twitterDate(games_data[k].time);
	gsw_games[games_data[k].days_ago] = games_data[k]
}

function twitterDate(tdate) {
    var system_date = new Date(Date.parse(tdate));
    var user_date = new Date();
    var diff = Math.floor((user_date - system_date) / 1000);
    return Math.round(diff / 86400);
}

app.post('/tweets', function(req, res){
   res.send(geostuff);
});

app.post('/games', function(req, res){
   res.send(gsw_games);
});

app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 3000;
console.log("Express server running on " + port);
app.listen(process.env.PORT || port);
