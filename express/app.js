const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

// uuid
const uuid = require("uuid/v4");

/**** App modules ****/
//const db = require("./db");
const mongodb = require("mongodb");
let ObjectID = mongodb.ObjectID;
let db;
const POST_COLLECTION = "posts";

mongodb.MongoClient.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/stackoverflowdb",
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
        handleError(res, err.message, "Failed to get contacts.");
      } else {
        res.status(200).json(post);
      }
    })
);

app.post("/api/post", (req, res) => {
  let title = req.body.title;
  let description = req.body.description;
  let post = {
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

app.post("/api/comment", (req, res) => {
  const { answer, postId } = req.body;
  const comment = {
    id: uuid(),
    answer,
    postId,
    vote: {
      count: 0,
      score: 0
    }
  };

  comments.push(comment);
  res.json(comment);
});

app.get("/api/comment", (req, res) => {
  const { postId } = req.query;
  if (typeof postId === "string") {
    const commentsForPost = comments.filter(
      comment => comment.postId === postId
    );
    res.json(commentsForPost);
  } else {
    res.json(comments);
  }
});

app.get("/api/comment/:id", (req, res) => {
  const comment = findCommentById(req.params.id);
  // TODO: If comment is null, you should throw 404
  res.json(comment);
});

// votes
app.post("/api/comment/:id/vote", (req, res) => {
  const index = findCommentIdxById(req.params.id);
  const isUp = req.body.up;
  if (index !== -1) {
    const comment = comments[index];
    const vote = comment.vote;
    comments.splice(index, 1, {
      ...comment,
      vote: {
        ...vote,
        count: vote.count + 1,
        score: isUp ? vote.score + 5 : vote.score - 5
      }
    });
    res.json(vote);
  }
});

function findPostIdxById(id) {
  return posts.findIndex(post => post.id === id);
}

function findPostById(id) {
  const index = findPostIdxById(id);
  if (index !== -1) {
    return posts[index];
  }
  return null;
}

function findCommentIdxById(id) {
  return comments.findIndex(comment => comment.id === id);
}

function findCommentById(id) {
  const index = findCommentIdxById(id);
  if (index !== -1) {
    return comments[index];
  }
  return null;
}

//db.connect();

/**** Reroute all unknown requests to angular index.html ****/
app.get("/*", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../dist/mandatory_exercise/index.html"));
});

/**** Start ****/
app.listen(port, () =>
  console.log(`Mandatory exercise API running on port ${port}!`)
);
