const db = require("../utils/db");

module.exports = class ProductModel {
  constructor(title, imageUrl, description, price, id = null) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this.id = id;
  }

  save() {
    return db.execute(
      "INSERT INTO products (title, price, description, imageUrl) VALUES (?,?,?,?)",
      [this.title, this.price, this.description, this.imageUrl]
    );
  }

  static findById(id) {
    return db.execute("SELECT * FROM products WHERE id = ? ", [id]);
  }

  static fetchAll() {
    return db.execute("select * from products");
  }
};
