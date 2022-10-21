const express = require("express");
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://alomia:testpass123@cluster0.w4kug29.mongodb.net/my_database", { useNewUrlParser: true });

const app = new express();
const ejs = require("ejs");

const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const validateMiddleWare = require("./middleware/validationMiddleware");
const expressSession = require("express-session");
const authMiddleware = require("./middleware/authMiddleware");
const redirectIfAuthenticatedMiddleware = require("./middleware/redirectIfAuthenticatedMiddleware");
const flash = require('connect-flash');

let port = process.env.PORT;
if (port == null || port == "") {
  port = 4000;
}

app.set("view engine", "ejs");

global.loggedIn = null;

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use("/posts/store", validateMiddleWare);
app.use(expressSession({
  secret: "keyboard cat"
}))
app.use(flash());
app.use("*", (req, res, next) => {
  loggedIn = req.session.userId;
  next();
})
app.listen(port, () => {
  console.log("App listening on port 4000");
});


const homeController = require("./controllers/home");
const storePostController = require("./controllers/storePost");
const newPostController = require("./controllers/newPost")
const getPostController = require("./controllers/getPost");
const newUserController = require("./controllers/newUser");
const storeUserController = require("./controllers/storeUser");
const loginController = require("./controllers/login");
const loginUserCOntroller = require("./controllers/loginUser");
const logoutController = require("./controllers/logout")

app.get('/', homeController);

app.get("/post/:id", getPostController);

app.get("/posts/new", authMiddleware, newPostController);

app.post("/posts/store", authMiddleware, storePostController);

app.get("/auth/register", redirectIfAuthenticatedMiddleware, newUserController);

app.post("/users/register", redirectIfAuthenticatedMiddleware, storeUserController);

app.get("/auth/login", redirectIfAuthenticatedMiddleware, loginController);

app.post("/users/login", redirectIfAuthenticatedMiddleware, loginUserCOntroller);

app.get("/auth/logout", logoutController);

app.use((req, res) => res.render("notfound"));
