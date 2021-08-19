const express = require("express");
const pug = require("pug");
const routes = require('./routes/routes');
const path = require('path');
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();

app.set('view engine' , 'pug');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));

app.use(expressSession(
    {
        secret: "TomBreatty",
        saveUninitialized: true,
        resave: true
    }));
    

const checkAuth = (request, response, next) =>
{
    if(request.session.user && request.session.user.isAuthenticated)
    {
        next();
    }
    else
    {
        response.redirect("/");
    }
}

let urlencodedParser  = express.urlencoded({
    extended: false
});

app.get("/", routes.index);

app.get('/create', routes.create);
app.post('/create', urlencodedParser, routes.createAccount);

app.get('/login', routes.login);
app.post('/login', urlencodedParser, routes.tryLogin);

app.get('/logout', routes.logout);

app.get('/authenticated', checkAuth, routes.authenticated);

app.get('/authenticated/edit', checkAuth, routes.edit);
app.post('/authenticated/edit', urlencodedParser, routes.editAccount);

app.listen(3000);