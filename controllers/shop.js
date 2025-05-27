const Cart = require("../models/cart");
const Product = require("../models/product");
// const ProductModel = require("../models/ProductModel");
const ProductModel = require("../models/orm/Product");

exports.getProducts = (req, res, next) => {
  // ProductModel.fetchAll()
  //   .then(([products]) => {
  //     res.render("shop/product-list", {
  //       products,
  //       pageTitle: "Products",
  //       path: "/",
  //       hasProducts: products.length > 0,
  //       activeShopProducts: true,
  //     });
  //   })
  //   .catch((err) => console.log(err.message));

  ProductModel.findAll()
    .then((products) => {
      const productValues = products.map((product) => product.dataValues);
      res.render("shop/product-list", {
        products: productValues,
        pageTitle: "Products",
        path: "/",
        hasProducts: productValues.length > 0,
        activeIndex: true,
      });
    })
    .catch((err) => console.log(err.message));
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  ProductModel.findByPk(productId)
    .then((product) => {
      // console.log(product);
      res.render("shop/product-detail", {
        product: product.dataValues,
        pageTitle: "Product details",
        activeShopProduct: true,
      });
    })
    .catch((err) => console.log(err.message));
};

exports.getIndex = (req, res, next) => {
  ProductModel.findAll()
    .then((products) => {
      const productValues = products.map((product) => product.dataValues);
      res.render("shop/index", {
        products: productValues,
        pageTitle: "Shop",
        path: "/",
        hasProducts: productValues.length > 0,
        activeIndex: true,
      });
    })
    .catch((err) => console.log(err.message));
  // ProductModel.fetchAll()
  //   .then(([products]) => {
  //     res.render("shop/index", {
  //       products,
  //       pageTitle: "Shop",
  //       path: "/",
  //       hasProducts: products.length > 0,
  //       activeIndex: true,
  //     });
  //   })
  //   .catch((err) => console.log(err.message));
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }

      res.render("shop/cart", {
        activeCart: true,
        pageTitle: "Your Cart",
        products: cartProducts,
        hasProducts: cartProducts.length > 0,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  // console.log(productId);

  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price);
  });

  res.redirect("/products");
};

exports.postCartDeleteItem = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId, (product) => {
    Cart.deleteProduct(productId, product.price);
    res.redirect("/cart");
  });
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
