const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const { json } = require("express");

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
        answer3: String,
        avatar: String
    });

let User = mongoose.model("User_Collection", userSchema);

let visited = 0;

exports.index = (req, res) => {
    User.find((err, user) => {
        if(err) return console.error(err);
        res.render('index', {
            title: 'User List',
            users: user
        });
    });
};

answerCount = (usersArray, questionNumber, answerSearch) => {
    let answerNumber = 0;
    switch (questionNumber)
    {
        case 0:
            for (i = 0; i < usersArray.length; i++)
            {
                if (usersArray[i].answer1 === answerSearch) answerNumber++;
            }
            break;
        case 1:
            for (i = 0; i < usersArray.length; i++)
            {
                if (usersArray[i].answer2 === answerSearch) answerNumber++;
            }
            break;
        case 2:
            for (i = 0; i < usersArray.length; i++)
            {
                if (usersArray[i].answer3 === answerSearch) answerNumber++;
            }
            break;
        default:
            console.log("Bruh, wrong question number");
            return -1;
    };

    return answerNumber;
};
// Math, Science, Language Arts, History
// Dog, Cat, Bird, Fish
// Facebook, Instagram, Snapchat, Other Or None

exports.api = (req, res) => {
    User.find((err, user) => {
        if(err) return console.error(err);
        
        let questionJSON = [
            {
                question: "What is your favorite school subject?",
                option1: "Math",
                option1Count: answerCount(user, 0, "Math"),
                option2: "Science",
                option2Count: answerCount(user, 0, "Science"),
                option3: "Language Arts",
                option3Count: answerCount(user, 0, "Language Arts"),
                option4: "History",
                option4Count: answerCount(user, 0, "History")
            },
            {
                question: "What's your preferred pet?",
                option1: "Dog",
                option1Count: answerCount(user, 1, "Dog"),
                option2: "Cat",
                option2Count: answerCount(user, 1, "Cat"),
                option3: "Bird",
                option3Count: answerCount(user, 1, "Bird"),
                option4: "Fish",
                option4Count: answerCount(user, 1, "Fish")
            },
            {
                question: "What social media do you use most?",
                option1: "Facebook",
                option1Count: answerCount(user, 2, "Facebook"),
                option2: "Instagram",
                option2Count: answerCount(user, 2, "Instagram"),
                option3: "Snapchat",
                option3Count: answerCount(user, 2, "Snapchat"),
                option4: "Other Or None",
                option4Count: answerCount(user, 2, "Other Or None")
            }
        ];
        
        // This will output all data for all users
        //console.log(user);
        //res.json(user);

        // This will output only how many chose each answer for each question
        console.log(questionJSON);
        res.json(questionJSON);
    })
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
    let id = makeid(5);
    let user = new User({
        username: req.body.username,
        password: postHashPassword,
        email: req.body.email,
        age: req.body.age,
        answer1: req.body.answer1,
        answer2: req.body.answer2,
        answer3: req.body.answer3,
        avatar: 'https://avatars.dicebear.com/api/avataaars/:' + id + '.svg'
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
                    _id: user[0]._id,
                    username: user[0].username,
                    password: user[0].password,
                    email: user[0].email,
                    age: user[0].age,
                    answer1: user[0].answer1,
                    answer2: user[0].answer2,
                    answer3: user[0].answer3,
                    avatar: user[0].avatar
                };

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
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getFullYear();
    let hour = date.getHours();
    let minute = date.getMinutes();

    let lastDate = req.cookies.lastDateVisited;
    let lastTime = req.cookies.lastTimeVisited;

    res.cookie("lastDateVisited", `${month}/${day}/${year}`, { maxAge: 9999999999999999999999999 });
    res.cookie("lastTimeVisited", `${hour}:${minute}`, { maxAge: 9999999999999999999999999 });

    res.render('authenticated', {
        title: `Welcome, ${req.session.user.username}!`,
        user: req.session.user,
        lastVisited: (lastDate !== undefined) ? `Last Visited: ${lastDate}, ${lastTime}` : "Never Visited Before"
    });
};

exports.edit = (req, res) => {
    res.render('edit', {
        title: 'Edit Account',
        user: req.session.user
    });
};

exports.editAccount = (req, res) => {
    User.findById(req.session.user._id, (err, user) => {
        if (err) return console.error(err);

        // Do Hashing for Password
        let preHashPassword = req.body.password;
        let salt = bcrypt.genSaltSync(10);
        let postHashPassword = bcrypt.hashSync(preHashPassword, salt);

        user.username = req.body.username;
        user.password = postHashPassword;
        // Email cannot be updated because it is what's used to login
        user.email = user.email;
        user.age = req.body.age;
        user.answer1 = req.body.answer1;
        user.answer2 = req.body.answer2;
        user.answer3 = req.body.answer3;

        user.save((err, user) => {
            if (err) return console.error(err);
            console.log(`${req.body.username}'s account information updated`);
        });

        req.session.user = {
            isAuthenticated: true,
            _id: user._id,
            username: user.username,
            password: user.password,
            email: user.email,
            age: user.age,
            answer1: user.answer1,
            answer2: user.answer2,
            answer3: user.answer3,
            avatar: user.avatar
        };

        res.redirect('/authenticated');
    });
};

exports.changeAvatar = (req, res) => {
    User.findById(req.session.user._id, (err, user) => {
        if(err) return console.error(err);

        let id = makeid(5);
        user.avatar = 'https://avatars.dicebear.com/api/avataaars/:' + id + '.svg';

        user.save((err, user) => {
            if (err) return console.error(err);
            console.log(`${req.body.username}'s avatar updated`);
        });

        req.session.user = {
            isAuthenticated: true,
            _id: user._id,
            username: user.username,
            password: user.password,
            email: user.email,
            age: user.age,
            answer1: user.answer1,
            answer2: user.answer2,
            answer3: user.answer3,
            avatar: user.avatar
        }

        res.redirect('/authenticated');
    });
};

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
        charactersLength));
   }
   return result;
}