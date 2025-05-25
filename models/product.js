const fs = require("fs");
const path = require("path");

const rootdir = require("../utils/path");
const { randomUUID } = require("crypto");
const Cart = require("./cart");

const p = path.join(rootdir, "data", "products.json");

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContents) => {
    if (err) {
      cb([]);
      return;
    }

    try {
      cb(JSON.parse(fileContents));
    } catch (error) {
      console.log(error.message);
      cb([]);
    }
  });
};

module.exports = class Product {
  constructor(title, imageUrl, description, price, id = null) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this.id = id;
  }

  save() {
    getProductsFromFile((fileContents) => {
      if (!this.id) {
        this.id = Math.floor(1 + Math.random() * 10000).toString();
      }

      let products = [];
      if (fileContents.length != 0) {
        products = fileContents;
      }

      const productIndex = products.findIndex(
        (product) => product.id == this.id
      );
      if (productIndex !== -1) {
        products[productIndex] = this;
      } else {
        products.push(this);
      }

      fs.writeFile(p, JSON.stringify(products), (err) => {
        if (err) {
          console.log(err.message);
          return;
        }
      });
    });
  }

  static deleteById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      const updatedProducts = products.filter((p) => p.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        if (err) {
          console.log(err.message);
          return;
        }

        Cart.deleteProduct(id, product.price);
        cb();
      });
    });
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id == id);
      cb(product);
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
};
