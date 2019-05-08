var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;
var session = require('express-session');
var Twit = require('twit')
const analyzeSyntax = require('../google_api/analyzeSyntax.js')
const analyzeSentiment = require('../google_api/analyzeSentiment.js')


const T = new Twit({
  consumer_key: 'OWtFymO0oxTVnusAKrHRNOaQD',
  consumer_secret: 'VWuscL6KodRqe7GOpAahZvNZaaOieTZQNEKuWQXKxILVkoNzmd',
  access_token: '754318579-Qekh8pM1TNX6AndCQbKueC6kwCV9nek2HiZdYDnX',
  access_token_secret: 'hA5ctEfsa0OXVVN6w0OmQffuvdrdXf7KYX0cuVYZvf7CD',
  timeout_ms: 60*1000
})


passport.use(new Strategy({
    consumerKey: 'OWtFymO0oxTVnusAKrHRNOaQD',
    consumerSecret: 'VWuscL6KodRqe7GOpAahZvNZaaOieTZQNEKuWQXKxILVkoNzmd',
    callbackURL: 'http://localhost:3000/twitter/return'
}, function(token, tokenSecret, profile, callback) {
    return callback(null, profile);
}));

passport.serializeUser(function(user, callback) {
    callback(null, user);
})

passport.deserializeUser(function(obj, callback) {
    callback(null, obj);
})

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'whatever', resave: true, saveUninitialized: true}))

app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', function(req, res) {
    res.send('hi')
})

app.get('/twitter/login', passport.authenticate('twitter'))

app.get('/twitter/return', passport.authenticate('twitter', {
    failureRedirect: '/'
}), function(req, res) {
    res.redirect('/')
})

app.get('/tweets/:word', (req,res) => {
  let word = req.params.word 
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;
  var day  = date.getDate() -1;
  day = (day < 10 ? "0" : "") + day;
  //get texts
  T.get('search/tweets', { q: `${word} since:${year}-${month}-${day}`, count: 10}, function(err, data, response) {
    if (err) console.log(err)

    let texts = [];
    let statuses = data['statuses']
   
    statuses.map(async element => {
      texts.push(element['text'])

    })
    // console.log(adjectives)

    res.send(texts)
  })
})

app.post('/adjectives', async (req,res) => {
  var tweets = req.body
  
  const loop = async (tweets) => {
    var promises = tweets.tweets.map(async (element) => {
      let adj = await analyzeSyntax(element)
      return adj
    })
    let result = await Promise.all(promises);
    return result
  }
  let data = await loop(tweets)
  let adjectives = await []
  await data.map(async item => {
    item.map(a => {
      adjectives.push(a)
    })
  })
  const result = adjectives.reduce((total, value) => {
    total[value] = (total[value] || 0) + 1;
    return total;
    }, {});
  
  var arr = []
  for (i in result) {
    arr.push(`${i}: ${result[i]}`)
  }
  console.log(arr)
  await res.send(arr)
})

app.post('/sentiment', async (req,res) => {
  var tweets = req.body

  const loop = async (tweets) => {
    var promises = tweets.tweets.map(async (element) => {
      let adj = await analyzeSentiment(element)
      return adj
    })
    let result = await Promise.all(promises);
    return result
  }
  
  let data = await loop(tweets)
  console.log(data)
  // let adjectives = await []
  // await data.map(async item => {
  //   item.map(a => {
  //     adjectives.push(a)
  //   })
  // })
  // const result = adjectives.reduce((total, value) => {
  //   total[value] = (total[value] || 0) + 1;
  //   return total;
  //   }, {});
  
  // var arr = []
  // for (i in result) {
  //   arr.push(`${i}: ${result[i]}`)
  // }
  // console.log(arr)
  await res.send(data)
})

let port = 3000

app.listen(port, () => {
  console.log(`server running at: http://localhost:${port}`);
});