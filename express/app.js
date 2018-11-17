const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongodb = require("mongodb");

/**** App modules ****/
let ObjectID = mongodb.ObjectID;
let db;
const POST_COLLECTION = "posts";
const COMMENT_COLLECTION = "comments";

mongodb.MongoClient.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/stackoverflowdb",
  { useNewUrlParser: true },
  function(err, client) {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    // Save database object from the callback for reuse.
    db = client.db();
    console.log("Database connection ready");
  }
);

/**** Configuration ****/
const port = process.env.PORT || 8080;
const app = express();
app.use(bodyParser.json()); // Parse JSON from the request body
app.use(morgan("combined")); // Log all requests to the console
app.use(express.static("../dist/mandatory_exercise"));

// Additional headers for the response to avoid trigger CORS security
// errors in the browser
// Read more: https://en.wikipedia.org/wiki/Cross-origin_resource_sharing
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

// posts
app.get("/api/post", (req, res) =>
  db
    .collection(POST_COLLECTION)
    .find({})
    .toArray(function(err, post) {
      if (err) {
        handleError(res, err.message, "Failed to get posts.");
      } else {
        res.status(200).json(post);
      }
    })
);

app.post("/api/post", (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const post = {
    title: title,
    description: description
  };

  db.collection(POST_COLLECTION).insertOne(post, function(err, post) {
    res.json(post);
  });
});

app.get("/api/post/:id", (req, res) => {
  db.collection(POST_COLLECTION).findOne(
    { _id: new ObjectID(req.params.id) },
    function(err, post) {
      if (err) {
        handleError(res, err.message, "Failed to get post");
      } else {
        res.status(200).json(post);
      }
    }
  );
});

//comments
app.post("/api/comment", (req, res) => {
  const { answer, postId } = req.body;
  const comment = {
    answer,
    postId,
    vote: {
      count: 0,
      score: 0
    }
  };

  db.collection(COMMENT_COLLECTION).insertOne(comment, function(err, comm) {
    if (err) {
      handleError(res, err.message, "Failed to add new comment");
    } else {
      res.status(200).json(comm);
    }
  });
});

app.get("/api/comment", (req, res) => {
  const { postId } = req.query;
  db.collection(COMMENT_COLLECTION)
    .find({ postId })
    .toArray(function(err, comm) {
      if (err) {
        handleError(res, err.message, "Failed to get comments.");
      } else {
        res.status(200).json(comm);
      }
    });
});

app.get("/api/comment/:id", (req, res) => {
  const comment = findCommentById(req.params.id);
  // TODO: If comment is null, you should throw 404
  res.json(comment);
});

// votes

app.post("/api/comment/:id/vote", (req, res) => {
  const isUp = req.body.up;
  const id = new ObjectID(req.params.id);

  db.collection(COMMENT_COLLECTION).findOne({}, function(err, data) {
    const count = data.vote.count + 1;
    const score = isUp ? data.vote.score + 5 : data.vote.score - 5;
    const newVal = { $set: { vote: { count, score } } };
    db.collection(COMMENT_COLLECTION).update(
      { _id: id },
      newVal,
      { upsert: true },
      function(err, data) {
        console.log(data);
        res.json(data);
      }
    );
  });
});

/**** Reroute all unknown requests to angular index.html ****/
app.get("/*", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../dist/mandatory_exercise/index.html"));
});

/**** Start ****/
app.listen(port, () =>
  console.log(`Mandatory exercise API running on port ${port}!`)
);
