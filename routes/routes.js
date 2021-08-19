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

/*
exports.index = (request, response) =>
{
    response.send("This is index");
}
*/

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
    let email = req.body.email;
    let password = req.body.password;
    console.log("Login attempt");
    User.find((err, users) => {
        if (err) return console.log(err);
        for (user in users) {
            if (user.email === email)
            {
                console.log("Email found");
                console.log(`Hashed password: ${user.password}`);
                console.log(`Entered password: ${password}`);
                console.log(`Password correct: ${bcrypt.compareSync(password, user.password)}`);
                if (bcrypt.compareSync(password, user.password))
                {
                    // Authenticate
                }
            }
        }
    });
};

exports.edit = (req, res) => {
    res.render('edit', {
        title: 'Edit Account'
    });
};