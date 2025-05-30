const mongodb = require("mongodb");

const { getDb } = require("../../utils/mongo");

class Product {
  constructor(title, price, description, imageUrl, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id;
  }

  save() {
    const db = getDb();
    let dbOp;
    const { _id, ...updateDetails } = this;
    if (this._id) {
      dbOp = db
        .collection("products")
        .updateOne(
          { _id: new mongodb.ObjectId(this._id) },
          { $set: updateDetails }
        );
    } else {
      dbOp = db.collection("products").insertOne(this);
    }

    return dbOp
      .then((result) => {
        // console.log(result);
        return result;
      })
      .catch((err) => console.log(err.message));
  }

  static findById(productId) {
    const db = getDb();

    return db
      .collection("products")
      .find({ _id: new mongodb.ObjectId(productId) })
      .next()
      .then((product) => product)
      .catch((err) => console.log(err.message));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => products)
      .catch((err) => console.log(err.message));
  }
}

module.exports = Product;
