const fs = require("fs");
const path = require("path");

const rootDir = require("../utils/path");
const p = path.join(rootDir, "data", "cart.json");

module.exports = class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }

      const existingProductIndex = cart.products.findIndex(
        (product) => product.id === id
      );
      let updatedProduct;
      if (existingProductIndex !== -1) {
        const existingProduct = cart.products[existingProductIndex];
        updatedProduct = { ...existingProduct, qty: existingProduct.qty + 1 };
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }

      cart.totalPrice += Number(productPrice);

      fs.writeFile(p, JSON.stringify(cart), (err) => {
        if (err) {
          console.log(err.message);
          return;
        }

        console.log("Cart updated in file");
      });
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        cb(null);
      }

      const cart = JSON.parse(fileContent);
      cb(cart);
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      const cart = JSON.parse(fileContent);
      const updatedCart = { ...cart };
      const product = updatedCart.products.find((product) => product.id === id);
      const productQty = product.qty;
      updatedCart.totalPrice -= Number(productPrice) * Number(productQty);
      updatedCart.products = updatedCart.products.filter(
        (product) => product.id !== id
      );

      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        if (err) {
          console.log(err.message);
          return;
        }

        console.log("Cart updated in file");
      });
    });
  }
};
