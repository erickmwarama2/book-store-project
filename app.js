const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const rootDir = require("./utils/path");

const app = express();

app.set("view engine", "pug");
app.set("views", "views");

const { routes: adminRoutes } = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
  // res.status(404).send("<h1>Page not found </h1>");
  // res.status(404).sendFile(path.join(rootDir, "views", "not-found.html"));
  res.status(404).render("not-found");
});

app.listen(3000, () => {
  console.log("server listening on port 3000");
});
