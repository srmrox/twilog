// TWILOG
// This application logs a user into Twitter and outputs their Twitter name in the console

var express = require('express');           // express server
var bodyParser = require('body-parser');    // help with templating using ejs
var request = require('request');           // handles HTTP requests
var qs = require('querystring');            // parse and build query strings

var twitterAuth = require('./config.js');   // this helps keep the Twitter secret keys in a separate file that does not get
                                            // shared onto the public repo. this is done by commiting and pushing a template
                                            // of the config file and then adding it to gitignore so further updates are not
                                            // synced

const requestTokenUrl = "https://api.twitter.com/oauth/request_token";

var oauth = {                                               // the oauth object
    callback : twitterAuth.callbackURL,
    consumer_key  : twitterAuth.consumerKey,
    consumer_secret : twitterAuth.consumerSecret
  }
var oauthToken = "";
var oauthTokenSecret = "";
var name = 'name';                                          // varible to store the name of the Twitter user

var app = express();                                        // declare our app using Express
const PORT = 3000;                                          // assign port number, could be any unused port
app.set('view engine', 'ejs');                              // use ejs as the template engine for the app
app.use(bodyParser.urlencoded({ extended: true }));         // setup bodyparse to work with our app

app.get('/', (req, res) => {
        request.post({url : requestTokenUrl, oauth : oauth}, function (e, r, body){     // send a POST request to the RequestToken URL with the OAuth object
        var reqData = qs.parse(body);                                                   // read the result received and set
        oauthToken = reqData.oauth_token;                                               // oauthToken
        oauthTokenSecret = reqData.oauth_token_secret;                                  // and oauthTokenSecret
        var uri = 'https://api.twitter.com/oauth/authenticate?' + qs.stringify({oauth_token: oauthToken})   // create the signin link for the user
        res.render('index', {url : uri});
    });
});

// this code will run when we open our application
// this is a GET request to localhost:port
app.get('/', function (req, res) {
    console.log(`Twitter name: ${name}`);       // log retrieved name to console
                                                // note the use of ` (backtick) and ${varname} to include variable value
                                                // within the string
  });

app.listen(PORT, function(){
    console.log(`Server up: http://localhost:${PORT}`);
});