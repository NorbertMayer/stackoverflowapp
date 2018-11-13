const mongoClient = require("mongodb").MongoClient;

const dbUrl = process.env.MONGODB_URL || "mongodb://localhost:27017";
const dbName = "stackoverflowdb";
let client = {};

module.exports.connect = connect;
module.exports.getPosts = getPosts;
module.exports.addPost = addPost;

function connect() {
  return new Promise((resolve, reject) => {
    mongoClient
      .connect(
        dbUrl,
        { useNewUrlParser: true }
      )
      .then(c => {
        client = c;
        console.log("Connected successfully to mongodb server");
        resolve();
      })
      .catch(error => console.error(error));
  });
}

function getPosts(query) {
  return new Promise((resolve, reject) => {
    client
      .db(dbName)
      .collection("posts")
      .find(query)
      .toArray()
      .then(documents => {
        console.log("Got data");
        resolve(documents);
      })
      .catch(error => console.error(error));
  });
}

function addPost(title, description) {
  return new Promise((resolve, reject) => {
    let post = { title: title, description: description };
    client
      .db(dbName)
      .collection("posts")
      .insertOne(post)
      .then(result => {
        console.log("Post inserted");
        resolve(result.insertedId);
      })
      .catch(error => console.error(error));
  });
}
