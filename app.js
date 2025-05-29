const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const expressHbs = require("express-handlebars");

const rootDir = require("./utils/path");
const sequelize = require("./utils/db");
const Product = require("./models/orm/Product");
const User = require("./models/orm/User");
const Cart = require("./models/orm/Cart");
const CartItem = require("./models/orm/CartItem");
const Order = require("./models/orm/Order");
const OrderItem = require("./models/orm/OrderItem");

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
  User.findByPk(1)
    .then((user) => {
      // console.log(user.dataValues);
      req.user = user;
      next();
    })
    .catch((err) => console.log(err.message));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.getNotFound);

Product.belongsTo(User, {
  constraints: true,
  onDelete: "CASCADE",
});
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);

Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

sequelize
  .sync({ logging: true })
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Erick", email: "erick@gmail.com" });
    }
    return Promise.resolve(user);
  })
  .then((user) => {
    user.getCart().then((cart) => {
      if (!cart) {
        return user.createCart();
      }
      return Promise.resolve(cart);
    });
  })
  .then(() => {
    app.listen(3000, () => {
      console.log("server listening on port 3000");
    });
  })
  .catch((err) => console.log(err.message));
