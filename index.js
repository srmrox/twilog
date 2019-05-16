// TWILOG
// This application logs a user into Twitter and outputs their Twitter name in the console

var express = require('express');           // express server
var bodyParser = require('body-parser');    // help with templating using ejs
var request = require('request');           // handles HTTP requests
var qs = require('querystring');            // parse and build query strings

var oauth = {                               // the oauth object
    callback : process.env.CALLBACK_URL,
    consumer_key  : process.env.CONSUMER_KEY,
    consumer_secret : process.env.CONSUMER_SECRET
}

var oauthToken = "";
var oauthTokenSecret = "";

var app = express();                                        // declare our app using Express
const PORT = 8080;                                          // assign port number, could be any unused port
app.set('view engine', 'ejs');                              // use ejs as the template engine for the app
app.use(bodyParser.urlencoded({ extended: true }));         // setup bodyparse to work with our app

app.get('/', (req, res) => {                                                            // main entry to the app
    var requestTokenUrl = "https://api.twitter.com/oauth/request_token";
    request.post({url : requestTokenUrl, oauth : oauth}, (e, r, body) => {              // send a POST request to the RequestToken URL with the OAuth object
        var reqData = qs.parse(body);                                                   // read the result received and set
        oauthToken = reqData.oauth_token;                                               // oauthToken
        oauthTokenSecret = reqData.oauth_token_secret;                                  // and oauthTokenSecret
        var uri = 'https://api.twitter.com/oauth/authenticate?' + qs.stringify({oauth_token: oauthToken})   // create the signin link for the user
        res.render('index', {url : uri});
    });
});

app.get('/signin', (req, res) => {                  // call back entry after approving application
    console.log("Processing auth");
    var authReqData = req.query;                    // read query
    oauth.token = authReqData.oauth_token;          // update oauth token
    oauth.token_secret = oauthTokenSecret;          // use the same oauth secret
    oauth.verifier = authReqData.oauth_verifier;    // add in the oauth verifier
  
    var accessTokenUrl = "https://api.twitter.com/oauth/access_token";
    request.post({url : accessTokenUrl , oauth : oauth}, (e, r, body) => {              // send a POST request to get access tokens
        var authenticatedData = qs.parse(body);                                         // parse the response received
        console.log(authenticatedData);                                                 // log auth data to console
        res.render('tweets', {name: authenticatedData.screen_name});
    });
});

app.listen(PORT, function(){
    console.log(`Server up: http://localhost:${PORT}`);
});