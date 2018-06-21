const express = require('express');
const session = require('express-session');
const request = require('supertest');
const bodyParser = require('body-parser');

const app = express();

app.use(session({
    secret: 'bob',
    resave: false,
    saveUninitialized: false
  }));

app.get('/', (req, res) => {
    res.send('Hello World')
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/login', express.static(__dirname + '/public'));

app.post('/login', (req, res) => {
    if (req.body.email==="admin@admin.com" && req.body.password ==="password123") {
    req.session.login = true
    res.redirect('secure/welcome');
    } else {
    res.send('Try again');
    }
})


app.get('/auth/login', (req, res) => {
    req.session.login = true
    res.send("You've logged in!")
});

app.get('/auth/logout', (req, res) => {
    req.session.login = false
    res.send('You have logged out')
});

app.use('/secure/welcome', (req, res) => {
    if (req.session.login === true) {
        res.sendFile(__dirname + '/public/welcome.html')
    } else {
        res.send('Error 401')
    }
});

app.get('/secure/dog', (req, res) => {
    if (req.session.login === true) {
        res.send('Dog Picture')
    } else {
        res.send('Error 401')
    }
});

app.listen(3333, () => console.log('Listening on 3333'));

request(app)
    .get('/')
    .expect(200)
    .end(function(err, res) {
        if (err) {
        throw err;
        } else {
        console.log('Pass')
        }
    })
