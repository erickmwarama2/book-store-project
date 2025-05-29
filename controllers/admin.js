const Product = require("../models/product");
const ProductModel = require("../models/orm/Product");
// const ProductModel = require("../models/ProductModel");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    activeProduct: true,
  });
};

exports.getEditProduct = (req, res, next) => {
  const productId = req.params.productId;
  const editMode = req.query.edit;

  // Product.findById(productId, (product) => {
  //   res.render("admin/edit-product", {
  //     pageTitle: "Edit Product",
  //     path: "/admin/edit-product",
  //     activeProduct: true,
  //     editing: editMode == "true",
  //     product,
  //   });
  // });

  // const productId = req.params.productId;
  // req.user
  //   .getProducts({ where: { id: productId } })
  ProductModel.findByPk(productId)
    .then((product) => {
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        activeProduct: true,
        editing: editMode == "true",
        product: product.dataValues,
      });
    })
    .catch((err) => console.log(err.message));
};

exports.postAddProduct = async (req, res, next) => {
  const { title, imageUrl, description, price } = req.body;
  const product = new ProductModel(title, imageUrl, description, price);
  // product
  //   .save()
  //   .then(() => res.redirect("/admin/admin-products"))
  //   .catch((err) => console.log(err.message));
  await req.user.createProduct({
    title,
    description,
    imageUrl,
    price,
  });
  // await ProductModel.create({
  //   title,
  //   description,
  //   imageUrl,
  //   price,
  //   userId: req.user.id,
  // });
  res.redirect("/admin/admin-products");
};

exports.postEditProduct = (req, res, next) => {
  const { title, imageUrl, description, price, productId } = req.body;
  // const product = new Product(title, imageUrl, description, price, productId);
  // product.save();
  ProductModel.findByPk(productId)
    .then((product) => {
      product.title = title;
      product.imageUrl = imageUrl;
      product.description = description;
      product.price = price;

      return product.save();
    })
    .then(() => {
      res.redirect("/admin/admin-products");
    })
    .catch((err) => console.log(err.message));
};

exports.getProducts = (req, res, next) => {
  // Product.fetchAll((products) => {
  //   res.render("admin/product-list", {
  //     products,
  //     docTitle: "Admin Products",
  //     path: "/admin/product-list",
  //     hasProducts: products.length > 0,
  //     activeAdminProducts: true,
  //   });
  // });

  // ProductModel.findAll()
  // console.log(req.user);
  req.user
    .getProducts()
    .then((products) => {
      const productValues = products.map((product) => product.dataValues);
      res.render("admin/product-list", {
        products: productValues,
        pageTitle: "Admin Products",
        path: "/admin/product-list",
        hasProducts: productValues.length > 0,
        activeIndex: true,
      });
    })
    .catch((err) => console.log(err.message));
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  // Product.deleteById(productId, () => {
  //   res.redirect("/admin/admin-products");
  // });
  ProductModel.findByPk(productId)
    .then((product) => product.destroy())
    .then(() => res.redirect("/admin/admin-products"))
    .catch((err) => console.log(err.message));
};
