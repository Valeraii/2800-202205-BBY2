const express = require("express");
const session = require("express-session");
const app = express();
const fs = require("fs");
const multer = require("multer");
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

app.get('/getHighScore', function(req, res) {
     let connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'COMP2800'
    });
    connection.connect();
    connection.query('SELECT scoreValue FROM bby_2_score WHERE userID = ?',
    [req.session.userID],
    function (error, results, fields) {
        if (error) {}
        res.send({ status: "success", rows: results });
    });
    connection.end();
})

app.get('/getDaysPlayed', function(req, res) {
    let connection = mysql.createConnection({
     host: 'localhost',
     user: 'root',
     password: '',
     database: 'COMP2800'
   });
   connection.connect();
   connection.query('SELECT * FROM bby_2_score WHERE userID = ?',
   [req.session.userID],
   function (error, results, fields) {
       if (error) {}
       res.send({ status: "success", rows: results });
   });
   connection.end();
})

app.get("/", function (req, res) {

    if (req.session.loggedIn) {
        res.redirect("/profile");
    } else {

        let doc = fs.readFileSync("./app/login.html", "utf8");

        res.set("Server", "Wazubi Engine");
        res.set("X-Powered-By", "Wazubi");
        res.send(doc);
    }
});

app.get("/login", function (req, res) {
    if (req.session.loggedIn) {
        res.redirect("/profile");
    } else {
        let doc = fs.readFileSync("./app/login.html", "utf8");

        res.set("Server", "Wazubi Engine");
        res.set("X-Powered-By", "Wazubi");
        res.send(doc);
    }
});

app.post('/submit', urlencodedParser, function (req, res) {
    connection.connect(function (err) {
        if (err) throw err;
        var sql = "INSERT INTO `bby_2_user` (`adminRights`, `email`, `pass`, `firstName`,`lastName`) VALUES ('NO', '" + req.body.email + "', '" + req.body.password + "' , '" + req.body.firstName + "' , '" + req.body.lastName + "')";
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
        profileDOM.window.document.getElementById("profile_name").innerHTML
        = "Welcome Back " + req.session.firstName + "!";
        res.set("Server", "Wazubi Engine");
        res.set("X-Powered-By", "Wazubi");
        res.send(profileDOM.serialize());
    } else if (req.session.loggedIn && req.session.adminRights == 'NO') {

            let profile = fs.readFileSync("./app/profile.html", "utf8");
            let profileDOM = new JSDOM(profile);
            profileDOM.window.document.getElementById("profile_name").innerHTML
            = "Welcome Back " + req.session.firstName + "!";
            profileDOM.window.document.getElementById("userID").innerHTML
            = req.session.userID;

            profileDOM.window.document.getElementById("profilePicture").src
            =  "img/userImages/" + req.session.userID + "id.jpg";

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
                req.session.userID = userRecord.userID;
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
      "SELECT * FROM bby_2_user WHERE email = ? AND pass = ?", [email, pwd],
      function(error, results, fields) {
          if (error) {}
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
                res.redirect("/login");
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

app.get('/get-timeline', function (req, res) {
    let connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'COMP2800'
    });
    connection.connect();
    connection.query('SELECT * FROM bby_2_timeline WHERE userID = ?', function (error, results, fields) {
        res.send({ status: "success", rows: results });

    });
    connection.end();
});

app.get('/get-users', function (req, res) {
    let connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'COMP2800'
    });
    connection.connect();
    connection.query('SELECT * FROM bby_2_user', function (error, results, fields) {
        res.send({ status: "success", rows: results });

    });
    connection.end();
});

app.get('/get-one-user', function (req, res) {
    let connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'COMP2800'
    });
    connection.connect();
    connection.query('SELECT userID, email, firstName, lastName, pass FROM bby_2_user WHERE userID = ?', 
    [req.session.userID],
    function (error, results, fields) {
        res.send({ status: "success", rows: results });
    });
    connection.end();
});

app.post('/add-timeline', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    let connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'COMP2800'
    });
    connection.connect();
    console.log(req.body.userID, req.body.caption);
    connection.query('INSERT INTO bby_2_timeline (userID, caption, playdate, playtime, playimage) values (?, ?, CURDATE(), CURTIME(), ?)',
          [req.body.userID, req.body.caption, req.body.playimage],
          function (error, results, fields) {
      if (error) {
          console.log(error);
      }
      res.send({ status: "success", msg: "Record added." });
    });
    connection.end();
});

app.post('/add-user', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    let connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'COMP2800'
    });
    connection.connect();
    connection.query('INSERT INTO bby_2_user (adminRights, email, pass, firstName, lastName) values (?, ?, ?, ?, ?)',
          [req.body.adminRights, req.body.email, req.body.pass, req.body.firstName, req.body.lastName],
          function (error, results, fields) {
      if (error) {}
      res.send({ status: "success", msg: "Record added." });
    });
    connection.end();
});

app.post('/add-score', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    let connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'COMP2800'
    });
    connection.connect();
    connection.query('INSERT INTO bby_2_score (userID, scoreValue) values (?, ?)',
          [req.body.userID, req.body.scoreValue],
          function (error, results, fields) {
      if (error) {}
      res.send({ status: "success", msg: "Record added." });
    });
    connection.end();
});

app.post('/update-user-email', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    let connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'COMP2800'
    });
    connection.connect();
    connection.query('UPDATE bby_2_user SET email = ? WHERE userID = ?',
          [req.body.email, req.body.userID],
          function (error, results, fields) {
      if (error) {
         
      }
      res.send({ status: "success", msg: "Recorded updated." });
    });
    connection.end();
});

app.post('/update-user-password', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    let connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'COMP2800'
    });
    connection.connect();
    connection.query('UPDATE bby_2_user SET pass = ? WHERE userID = ?',
          [req.body.pass, req.body.userID],
          function (error, results, fields) {
      if (error) {
      
      }
      res.send({ status: "success", msg: "Recorded updated." });
    });
    connection.end();
});

app.post('/update-user-firstName', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    let connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'COMP2800'
    });
    connection.connect();
    connection.query('UPDATE bby_2_user SET firstName = ? WHERE userID = ?',
          [req.body.firstName, req.body.userID],
          function (error, results, fields) {
      if (error) {
        
      }
      res.send({ status: "success", msg: "Recorded updated." });
    });
    connection.end();
});

app.post('/update-user-lastName', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    let connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'COMP2800'
    });
    connection.connect();
    connection.query('UPDATE bby_2_user SET lastName = ? WHERE userID = ?',
          [req.body.lastName, req.body.userID],
          function (error, results, fields) {
      if (error) {
      }
      res.send({ status: "success", msg: "Recorded updated." });
    });
    connection.end();
});

app.post('/update-user-admin', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    let connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'COMP2800'
    });
    connection.connect();
    connection.query('UPDATE bby_2_user SET adminRights = ? WHERE userID = ?',
          [req.body.adminRights, req.body.userID],
          function (error, results, fields) {
      if (error) {
        
      }
      res.send({ status: "success", msg: "Recorded updated." });
    });
    connection.end();
});

app.post('/update-timeline-caption', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    let connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'comp2800'
    });
    connection.connect();
    console.log("update values", req.body.caption, req.body.scoreID)
    connection.query('UPDATE bby_2_timeline SET caption = ? WHERE timelineID = ?',
          [req.body.caption, req.body.timelineID],
          function (error, results, fields) {
      if (error) {
        console.log(error);
      }
      res.send({ status: "success", msg: "Recorded updated." });
    });
    connection.end();
});

app.post('/delete-user', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    let connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'COMP2800'
    });
    connection.connect();
    connection.query('DELETE FROM bby_2_user WHERE userID = ?',
          [req.body.userID],
          function (error, results, fields) {
      if (error) {
       
      }
      res.send({ status: "success", msg: "Recorded all deleted." });
    });
    connection.end();
});

app.post('/delete-post', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    let connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'COMP2800'
    });
    connection.connect();
    console.log(req.body.timelineID);
    connection.query('DELETE FROM bby_2_timeline WHERE timelineID = ?',
          [req.body.timelineID],
          function (error, results, fields) {
      if (error) {
       
      }
      res.send({ status: "success", msg: "Recorded all deleted." });
    });
    connection.end();
});

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./public/img/userImages/")
    },
    filename: function(req, file, callback) {
        callback(null, req.session.userID + "id.jpg".split('/').pop().trim());
    }
});
const upload = multer({ storage: storage });

app.post('/upload-images', upload.array("files"), function (req, res) {
    for(let i = 0; i < req.files.length; i++) {
        req.files[i].filename = req.files[i].originalname;
    }
});

const timelineStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./public/img/timelineImages/")
    },
    filename: function(req, file, callback) {
        const current = new Date();
        const time = current.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
        callback(null, time + ".jpg".split('/').pop().trim());
    }
});
const uploadTimeline = multer({ storage: timelineStorage });

app.post('/upload-timeline', uploadTimeline.array("files"), function (req, res) {
    console.log(req.files);
    for(let i = 0; i < req.files.length; i++) {
        req.files[i].filename = req.files[i].originalname;
    }
});

let port = 8000;
app.listen(port, function () {
});
