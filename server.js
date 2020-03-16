const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//databse config
const db = require("./config/keys").mongoURI;

// connect to mongoose
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("this is the trouble ", err));

app.get("/", (req, res) => {
  res.send("oh it works");
});

// Use the routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.port || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
