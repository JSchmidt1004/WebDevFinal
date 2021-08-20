const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;

mongoose.connect("mongodb+srv://GKilpack:Kilpack1@cluster0.99tyg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
{
    useUnifiedTopology:true,
    useNewUrlParser:true
});

mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

let mdb = mongoose.connection;
mdb.on("error", console.error.bind(console, "connection error"));
mdb.once("open",  callback => {});

let userSchema = mongoose.Schema(
    {
        username: String,
        password: String,
        email: String,
        age: String,
        answer1: String,
        answer2: String,
        answer3: String
    });

let User = mongoose.model("User_Collection", userSchema);


let visited = 0;
let lastDateVisited = "";
let lastTimeVisited = "";


exports.index = (req, res) => {
    User.find((err, user) => {
        if(err) return console.error(err);
        res.render('index', {
            title: 'User List',
            users: user
        });
    });
};

exports.create = (req, res) => {
    res.render('create', {
        title: 'Create Account'
    });
};

exports.createAccount = (req, res) => {
    let preHashPassword = req.body.password;

    // Do Hashing for Password
    let salt = bcrypt.genSaltSync(10);
    let postHashPassword = bcrypt.hashSync(preHashPassword, salt);

    let user = new User({
        username: req.body.username,
        password: postHashPassword,
        email: req.body.email,
        age: req.body.age,
        answer1: req.body.answer1,
        answer2: req.body.answer2,
        answer3: req.body.answer3
    });

    user.save((err, user) => {
        if (err) return console.error(err);
        console.log(`${user.username}'s account added`);
    });

    res.redirect('/');
};

exports.login = (req, res) => {
    res.render('login', {
        title: 'Login'
    });
};

exports.tryLogin = (req, res) => {
    console.log("Login attempt");

    User.find({email: req.body.email}, (err, user) => {
        if (err) return console.error(err);
        console.log(user);
        
        if (user.length > 0)
        {
            if (bcrypt.compareSync(req.body.password, user[0].password))
            {
                // Authenticate
                console.log("Password Is Correct");

                req.session.user = {
                    isAuthenticated: true,
                    username: user[0].username,
                    password: user[0].password,
                    email: user[0].email,
                    age: user[0].age,
                    answer1: user[0].answer1,
                    answer2: user[0].answer2,
                    answer3: user[0].answer3
                }

                res.redirect('/authenticated');
            }
            else 
            {
                res.render('login', {
                    title: 'Login',
                    failedLogin: 'Email or Password was incorrect'
                });
            }
        }
        else 
        {
            res.render('login', {
                title: 'Login',
                failedLogin: 'Email or Password was incorrect'
            });
        }
    });
};

exports.logout = ((req, res) => {
    req.session.destroy(err => {
        if (err) return console.error(err);

        res.redirect('/');
    });
});

exports.authenticated = (req, res) => {
    if (req.cookies.visited > 0)
    {
        visited = req.cookies.visited;
    }
    visited++;
    res.cookie("visited", visited, { maxAge: 9999999999999999999999999 });

    let date = new Date();
    let month = date.getMonth();
    let day = date.getDate();
    let year = date.getFullYear();
    let hour = date.getHours();
    let minute = date.getMinutes();

    lastDate = lastDateVisited;
    lastTime = lastTimeVisited;

    lastDateVisited = `${month}/${day}/${year}`;
    lastTimeVisited = `${hour}:${minute}`;

    res.cookie("lastDateVisited", lastDateVisited, { maxAge: 9999999999999999999999999 });
    res.cookie("lastTimeVisited", lastTimeVisited, { maxAge: 9999999999999999999999999 });

    res.render('authenticated', {
        title: `Welcome, ${req.session.user.username}!`,
        user: req.session.user,
        date: lastDate,
        time: lastTime
    });
};

exports.edit = (req, res) => {
    res.render('edit', {
        title: 'Edit Account',
        user: req.session.user
    });
};

exports.editAccount = (req, res) => {

};