
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

app.get("/login", function (req, res) {

        let doc = fs.readFileSync("./app/login.html", "utf8");

        res.set("Server", "Wazubi Engine");
        res.set("X-Powered-By", "Wazubi");
        res.send(doc);
    
});

app.post('/submit', urlencodedParser, function (req, res) {
    connection.connect(function (err) {
        if (err) throw err;
        var sql = "INSERT INTO `user` (`email`, `pass`, `firstName`,`lastName`) VALUES ('" + req.body.email + "', '" + req.body.password + "' , '" + req.body.firstName + "' , '" + req.body.lastName + "')";
        connection.query(sql, function (err, result) {
            if (err) throw err;
        });
    });
    res.redirect("/");
});


app.get("/profile", function (req, res) {
    if (req.session.loggedIn && req.session.adminRights == 'YES') {

        let profile = fs.readFileSync("./app/dashboard.html", "utf8");
        let profileDOM = new JSDOM(profile);
        res.set("Server", "Wazubi Engine");
        res.set("X-Powered-By", "Wazubi");
        res.send(profileDOM.serialize());
    } else if (req.session.loggedIn && req.session.adminRights == 'NO') {

            let profile = fs.readFileSync("./app/profile.html", "utf8");
            let profileDOM = new JSDOM(profile);

            res.set("Server", "Wazubi Engine");
            res.set("X-Powered-By", "Wazubi");
            res.send(profileDOM.serialize());
        } else {
        res.redirect("/");
    }

});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.post("/login", function(req, res) {
    res.setHeader("Content-Type", "application/json");

    let results = authenticate(req.body.email, req.body.password,
        function(userRecord) {
            if(userRecord == null) {
                res.send({ status: "fail", msg: "User account not found." });
            } else {
                req.session.loggedIn = true;
                req.session.email = userRecord.email;
                req.session.firstName = userRecord.firstName;
                req.session.adminRights = userRecord.adminRights;
                req.session.save(function(err) {
                  
                });
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
      "SELECT * FROM user WHERE email = ? AND pass = ?", [email, pwd],
      function(error, results, fields) {
      

          if (error) {
             
          }
          if(results.length > 0) {
              return callback(results[0]);
          } else {
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

app.get("/table-async", function (req, res) {

    const mysql = require("mysql2");
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "COMP2800"
    });
    let myResults = null;
    connection.connect();
    connection.query(
        "SELECT * FROM user",
        function (error, results, fields) {
           
            myResults = results;
            if (error) {
               
            }
            let table = "<table><tr><th>ID</th><th>Admin</th><th>Email</th><th>First Name</th><th>Last Name</th></tr>";
            for (let i = 0; i < results.length; i++) {
                table += "<tr><td>" + results[i].userID + "</td><td>" + results[i].adminRights + "</td><td>" + results[i].email + "</td><td>"
                    + results[i].firstName + "</td><td>" + results[i].lastName + "</td></tr>" ;
            }
            table += "</table>";
            res.send(table);
            connection.end();
        }
    );
});

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


let port = 8000;
app.listen(port, function () {
});
