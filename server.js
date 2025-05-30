const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const expressHbs = require("express-handlebars");

const rootDir = require("./utils/path");
const { mongoConnect } = require("./utils/mongo");

const app = express();

app.engine(
  "hbs",
  expressHbs.engine({
    layoutsDir: "views/layouts",
    defaultLayout: "main-layout",
    extname: ".hbs",
  })
);
app.set("view engine", "hbs");
// app.set("view engine", "ejs");
app.set("views", "views");

const { routes: adminRoutes } = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));

app.use((req, res, next) => {
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.getNotFound);

mongoConnect(() => {
  //   console.log(client);
  app.listen(3000, () => {
    console.log("Server listening on port 3000");
  });
});
