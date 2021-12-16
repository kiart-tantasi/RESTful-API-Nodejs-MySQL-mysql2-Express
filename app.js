require("dotenv").config();
const e = require("express");
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: "nodejsmysql",
});

db.connect(function (err) {
  if (err) {
    console.log(err);
  }
});

// CREATE DATABASE
function createDatabase(dbName) {
  const sql = "CREATE DATABASE " + dbName;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Database", dbName, "created.");
    }
  });
}

// CREATE TABLE
function createTable(tableName) {
  const sql =
    "CREATE TABLE " +
    tableName +
    "(id int AUTO_INCREMENT, name VARCHAR(255), description VARCHAR(255), PRIMARY KEY (id))";
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Table", tableName, "created.");
    }
  });
}

app
  .route("/items")

  // get all items
  .get(function (req, res) {
    db.query("SELECT * FROM items", (err, results) => {
      if (err) {
        console.log(err);
      } else {
        console.log(results);
        res.send(results);
      }
    });
  })

  // add a new item
  .post(function (req, res) {
    const itemName = req.body.name;
    const itemDescription = req.body.description;
    db.query(
      "INSERT INTO items (name, description) values (?,?)",
      [itemName, itemDescription],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          res.sendStatus(200);
        }
      }
    );
  });

app
  .route("/items/:itemId")

  // get one specific item
  .get(function (req, res) {
    const itemId = req.params.itemId;
    db.query("SELECT * FROM items WHERE id = ?", itemId, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        res.send(result);
      }
    });
  })

  // delete one specific item
  .delete(function (req, res) {
    const itemId = req.params.itemId;
    db.query("DELETE FROM items WHERE id = ?", itemId, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        res.sendStatus(200);
      }
    });
  })

  // update one specfic item
  .patch(function (req, res) {
    const itemId = req.params.itemId;
    const newDescription = req.body.description;
    db.query(
      "UPDATE items SET description = ? WHERE id = ?",
      [newDescription, itemId],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          res.sendStatus(200);
        }
      }
    );
  });

const port = process.env.port || 3000;
app.listen(port, () => console.log("Running on", port));
