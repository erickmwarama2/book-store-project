const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      products,
      docTitle: "Products",
      path: "/",
      hasProducts: products.length > 0,
      activeProducts: true,
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      products,
      docTitle: "Shop",
      path: "/",
      hasProducts: products.length > 0,
      activeIndex: true,
    });
  });
};

exports.getCart = (req, res, next) => {
  res.render("shop/cart", {
    activeCart: true,
    pageTitle: "Your Cart",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    activeCheckout: true,
    pageTitle: "Checkout",
  });
};
