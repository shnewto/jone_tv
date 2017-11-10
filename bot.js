console.log("The bot is starting")
var Twit = require('twit');
var config = require('./config');
var T = new Twit(config);
var erratic = require('erratic'), fs = require('fs');
var g = fs.readFileSync('poem-grammar.bnf', 'utf8');

var stream = T.stream('user');
stream.on('follow', followed);
stream.on('tweet', tweetEvent);

function tweetEvent(ev) {
    var json = JSON.stringify(ev, null, 2);
    fs.writeFile("tweet.json", json);
    var text = ev.text;
    var from = ev.user.screen_name;

    if (text.indexOf("@jone_tv") != -1) {
        var rules = erratic.parse(g);
        var newtweet = erratic.generate(rules, 'poem') +
            '\n' + '@' + from + '\n#RIP RGriz (1934-2006)';
        tweet_(newtweet);
    }
}

function followed(ev) {
    var from = ev.source.screen_name;

    var newtweet = '@' + from + ' i see u. u ' +
        Array(Math.floor(Math.random() * 20)).join('a') + 're okaay.';
    tweet_(newtweet);

}

function tweet_(dat) {
    var tweet = {
        status: dat
    }

    T.post('statuses/update', tweet, tweeted);

    function tweeted(err, data, response) {
        if (err) {
            console.log(err);
        }
    }
}