import { MongoClient, ObjectId } from "mongodb";
import express from "express";
import { home } from "./objects.js";

const app = express();
const port = 3000;

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded());

const client = new MongoClient("mongodb://127.0.0.1:27017");
await client.connect();
const db = client.db("sandwich_club");
const userList = db.collection("users");

app.get("/", (req, res) => {
  res.redirect("/home");
});
app.get("/home", (req, res) => {
  const { heading, description } = home;
  const title = `${home.title} - Home`;
  res.render("home", { title, heading, description });
});
app.get("/users", async (req, res) => {
  const title = `${home.title} - Users`;
  const users = await userList.find({}).toArray();
  res.render("users", { title, users });
});
app.get("/users/sortasc", async (req, res) => {
  const title = `${home.title} - Users`;
  const users = await userList
    .find({})
    .collation({ locale: "en" })
    .sort({ name: 1 })
    .toArray();
  res.render("users", { title, users });
});
app.get("/users/sortdesc", async (req, res) => {
  const title = `${home.title} - Users`;
  const users = await userList
    .find({})
    .collation({ locale: "en" })
    .sort({ name: -1 })
    .toArray();
  res.render("users", { title, users });
});
app.get("/form", async (req, res) => {
  const title = `${home.title} - Create user`;
  res.render("form", { title });
});
app.post("/form", async (req, res) => {
  const body = { ...req.body, user_joined: new Date(req.body.user_joined) };
  await userList.insertOne(body);
  res.redirect("/users");
});
app.get("/user/:id", async (req, res) => {
  const user = await userList.findOne({
    _id: new ObjectId(req.params.id),
  });
  const title = `${user.user_name}'s page`;
  res.render("user", {
    user,
    title,
  });
});
app.post("/user/:id/delete", async (req, res) => {
  await userList.deleteOne({ _id: new ObjectId(req.params.id) });
  res.redirect("/users");
});
app.get("/user/:id/update", async (req, res) => {
  const user = await userList.findOne({
    _id: new ObjectId(req.params.id),
  });
  const title = `${user.user_name} - Update`;
  res.render("update", {
    user,
    title,
  });
});
app.post("/user/:id/update", async (req, res) => {
  const body = { ...req.body, user_joined: new Date(req.body.user_joined) };
  await userList.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: body }
  );
  res.redirect("/users");
});

app.listen(port, () => {
  console.log(`Express-server running on port:${port}`);
});
