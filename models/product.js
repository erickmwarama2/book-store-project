const fs = require("fs");
const path = require("path");

const rootdir = require("../utils/path");

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
  constructor(title) {
    this.title = title;
  }

  save() {
    getProductsFromFile((fileContents) => {
      let products = [];
      if (fileContents.length != 0) {
        products = fileContents;
      }

      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        if (err) {
          console.log(err.message);
          return;
        }
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
};
