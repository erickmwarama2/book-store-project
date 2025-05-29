const Cart = require("../models/cart");
const Product = require("../models/product");
// const ProductModel = require("../models/ProductModel");
const ProductModel = require("../models/orm/Product");
const CartItem = require("../models/orm/CartItem");

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
  // Cart.getCart((cart) => {
  //   Product.fetchAll((products) => {
  //     const cartProducts = [];
  //     for (product of products) {
  //       const cartProductData = cart.products.find(
  //         (prod) => prod.id === product.id
  //       );
  //       if (cartProductData) {
  //         cartProducts.push({ productData: product, qty: cartProductData.qty });
  //       }
  //     }

  //     res.render("shop/cart", {
  //       activeCart: true,
  //       pageTitle: "Your Cart",
  //       products: cartProducts,
  //       hasProducts: cartProducts.length > 0,
  //     });
  //   });
  // });

  req.user
    .getCart()
    .then((cart) => {
      cart.getProducts().then((products) => {
        // console.log(products);
        const cartProducts = [];
        for (product of products) {
          // console.log(product);
          // console.log(product.cartItems.dataValues);
          cartProducts.push({
            productData: product.dataValues,
            qty: product.cartItems.dataValues.quantity,
          });
        }

        res.render("shop/cart", {
          activeCart: true,
          pageTitle: "Your Cart",
          products: cartProducts,
          hasProducts: cartProducts.length > 0,
        });
      });
    })
    .catch((err) => console.log(err.message));
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  // console.log(productId);

  // Product.findById(productId, (product) => {
  //   Cart.addProduct(productId, product.price);
  // });
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      console.log(products);
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      let newQuantity = 1;
      if (product) {
        newQuantity += product.cartItems.quantity;
      }
      return ProductModel.findByPk(productId)
        .then((product) => {
          return fetchedCart.addProduct(product, {
            through: { quantity: newQuantity },
          });
        })
        .catch((err) => console.log(err.message));
    })
    .then(() => res.redirect("/products"))
    .catch((err) => console.log(err.message));
};

exports.postCartDeleteItem = (req, res, next) => {
  const productId = req.body.productId;
  // Product.findById(productId, (product) => {
  //   Cart.deleteProduct(productId, product.price);
  //   res.redirect("/cart");
  // });

  req.user
    .getCart()
    .then((cart) => {
      if (!cart) {
        return Promise.resolve([]);
      }
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      let product = null;
      if (products.length > 0) {
        product = products[0];
      }

      if (!product) {
        return Promise.resolve(null);
      }

      return product.cartItems.destroy();
    })
    .then(() => res.redirect("/cart"))
    .catch((err) => console.log(err.message));
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await req.user.getOrders({ include: ["products"] });
    // console.log(orders);
    const orderValues = orders.map((order) => {
      const obj = order.dataValues;
      obj.products = order.products.map((product) => {
        let prodObj = product.dataValues;
        prodObj.quantity = product.orderItem.quantity;
        return prodObj;
      });
      return obj;
    });

    res.render("shop/orders", {
      activeOrders: true,
      pageTitle: "Your Orders",
      orders: orderValues,
      hasOrders: orders.length > 0,
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    activeCheckout: true,
    pageTitle: "Checkout",
  });
};

exports.postOrder = async (req, res, next) => {
  try {
    const cart = await req.user.getCart();
    const products = await cart.getProducts();
    const order = await req.user.createOrder();
    await order.addProducts(
      products.map((product) => {
        product.orderItem = { quantity: product.cartItems.quantity };
        return product;
      })
    );
    await cart.setProducts(null);
    // console.log(products);
    res.redirect("/orders");
  } catch (error) {
    console.log(error.message);
  }
};
