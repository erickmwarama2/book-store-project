const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (cb) => {
  MongoClient.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@node-db.uoktqre.mongodb.net/?retryWrites=true&w=majority&appName=node-db`
  )
    .then((client) => {
      console.log("connected to db");
      _db = client.db("node-db");
      cb();
    })
    .catch((err) => {
      console.log(err.message);
      throw err;
    });
};

const getDb = () => {
  if (_db) return _db;
  throw "No database found";
};

module.exports.mongoConnect = mongoConnect;
module.exports.getDb = getDb;
