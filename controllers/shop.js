const Cart = require("../models/cart");
const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      products,
      docTitle: "Products",
      path: "/",
      hasProducts: products.length > 0,
      activeShopProducts: true,
    });
  });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId, (product) => {
    res.render("shop/product-detail", {
      product,
      pageTitle: "Product details",
      activeShopProduct: true,
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

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  console.log(productId);

  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price);
  });

  res.redirect("/products");
};

exports.getOrders = (req, res, next) => {
  res.render("shop/cart", {
    activeOrders: true,
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    activeCheckout: true,
    pageTitle: "Checkout",
  });
};
