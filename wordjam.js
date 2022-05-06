
const express = require("express");
const session = require("express-session");
const app = express();
const fs = require("fs");
const { JSDOM } = require('jsdom');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "COMP2800"
});

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set('view engine', 'jade');

// static path mappings
app.use("/js", express.static("./public/js"));
app.use("/css", express.static("./public/css"));
app.use("/img", express.static("./public/img"));
app.use("/fonts", express.static("./public/fonts"));
app.use("/media", express.static("./public/media"));
app.use("/html", express.static("./app"));

app.use(session(
    {
        secret: "extra text that no one will guess",
        name: "wazaSessionID",
        resave: false,
        // create a unique identifier for that client
        saveUninitialized: true
    })
);

app.get("/", function (req, res) {

    if (req.session.loggedIn) {
        res.redirect("/login");
    } else {

        let doc = fs.readFileSync("./app/login.html", "utf8");

        res.set("Server", "Wazubi Engine");
        res.set("X-Powered-By", "Wazubi");
        res.send(doc);
    }
});

app.post('/submit', urlencodedParser, function (req, res) {
    console.log("Im here");
    console.log(req.body.name);
    console.log(req.body.message);
    connection.connect(function (err) {
        if (err) throw err;
        console.log("connected");
        var sql = "INSERT INTO `user` (`email`, `pass`, `firstName`,`lastName`) VALUES ('" + req.body.email + "', '" + req.body.password + "' , '" + req.body.firstName + "' , '" + req.body.lastName + "')";
        connection.query(sql, function (err, result) {
            if (err) throw err;
            console.log("table created");
        });
    });
    res.redirect("/");
});

app.get("/profile", function (req, res) {

    // check for a session first!
    if (req.session.loggedIn && req.session.adminRights == 'YES') {

        let profile = fs.readFileSync("./app/dashboard.html", "utf8");
        let profileDOM = new JSDOM(profile);
        res.set("Server", "Wazubi Engine");
        res.set("X-Powered-By", "Wazubi");
        res.send(profileDOM.serialize());
    } else if (req.session.loggedIn && req.session.adminRights == 'NO') {

            let profile = fs.readFileSync("./app/profile.html", "utf8");
            let profileDOM = new JSDOM(profile);

            // great time to get the user's data and put it into the page!
            profileDOM.window.document.getElementsByTagName("title")[0].innerHTML
                = req.session.name + "'s Profile";
            profileDOM.window.document.getElementById("profile_name").innerHTML
                = "Welcome back " + req.session.name;

            res.set("Server", "Wazubi Engine");
            res.set("X-Powered-By", "Wazubi");
            res.send(profileDOM.serialize());
        } else {
        // not logged in - no session and no access, redirect to home!
        res.redirect("/");
    }

});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Notice that this is a "POST"
app.post("/login", function(req, res) {
    res.setHeader("Content-Type", "application/json");

    console.log("What was sent", req.body.email, req.body.password);

    let results = authenticate(req.body.email, req.body.password,
        function(userRecord) {
            //console.log(rows);
            if(userRecord == null) {
                // server couldn't find that, so use AJAX response and inform
                // the user. when we get success, we will do a complete page
                // change. Ask why we would do this in lecture/lab 🙂
                res.send({ status: "fail", msg: "User account not found." });
            } else {
                // authenticate the user, create a session
                req.session.loggedIn = true;
                req.session.email = userRecord.email;
                req.session.name = userRecord.name;
                req.session.adminRights = userRecord.adminRights;
                req.session.save(function(err) {
                    // session saved, for analytics, we could record this in a DB
                });
                // all we are doing as a server is telling the client that they
                // are logged in, it is up to them to switch to the profile page
                res.send({ status: "success", msg: "Logged in." });
            }
    });
});

function authenticate(email, pwd, callback) {

    const mysql = require("mysql2");
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "COMP2800"
    });
    connection.connect();
    connection.query(
      //'SELECT * FROM user',
      "SELECT * FROM user WHERE email = ? AND pass = ?", [email, pwd],
      function(error, results, fields) {
          // results is an array of records, in JSON format
          // fields contains extra meta data about results
          console.log("Results from DB", results, "and the # of records returned", results.length);

          if (error) {
              // in production, you'd really want to send an email to admin but for now, just console
              console.log(error);
          }
          if(results.length > 0) {
              // email and password found
              return callback(results[0]);
          } else {
              // user not found
              return callback(null);
          }

      }
    );
}

app.get("/logout", function (req, res) {

    if (req.session) {
        req.session.destroy(function (error) {
            if (error) {
                res.status(400).send("Unable to log out")
            } else {
                // session deleted, redirect to home
                res.redirect("/");
            }
        });
    }
});

app.get("/homepage", function (req,res) {

    let doc = fs.readFileSync("./app/homepage.html", "utf8");

    res.set("Server", "Wazubi Engine");
    res.set("X-Powered-By", "Wazubi");
    res.send(doc);

})

async function init() {
    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        multipleStatements: true
    });
    const [rows, fields] = await connection.query("SELECT * FROM user");
    connection.end();
}

// RUN SERVER
let port = 8000;
app.listen(port, function () {
    console.log("Listening on port " + port + "!");
});
