const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

// uuid
const uuid = require("uuid/v4");

/**** App modules ****/
const db = require("./db");

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

// const comments = [
//   {
//     id: uuid(),
//     postId: posts[0].id,
//     answer:
//       "I want to match the state in the below csv file to the zip code in another csv file. My dataset also does not contain that many states so I was thinking I could take advantage of a simple conditional expression or case statement that sets a new column equal to a certain zip code if a certain state is in that row.",
//     vote: {
//       count: 1,
//       score: 5
//     }
//   },
//   {
//     id: uuid(),
//     postId: posts[0].id,
//     answer:
//       "I want to match the state in the below csv file to the zip code in another csv file. My dataset also does not contain that many states so I was thinking I could take advantage of a simple conditional expression or case statement that sets a new column equal to a certain zip code if a certain state is in that row.",
//     vote: {
//       count: 3,
//       score: 15
//     }
//   },
//   {
//     id: uuid(),
//     postId: posts[1].id,
//     answer:
//       "I want to match the state in the below csv file to the zip code in another csv file. My dataset also does not contain that many states so I was thinking I could take advantage of a simple conditional expression or case statement that sets a new column equal to a certain zip code if a certain state is in that row.",
//     vote: {
//       count: 4,
//       score: 20
//     }
//   },
//   {
//     id: uuid(),
//     postId: posts[2].id,
//     answer:
//       "I want to match the state in the below csv file to the zip code in another csv file. My dataset also does not contain that many states so I was thinking I could take advantage of a simple conditional expression or case statement that sets a new column equal to a certain zip code if a certain state is in that row.",
//     vote: {
//       count: 3,
//       score: 15
//     }
//   },
//   {
//     id: uuid(),
//     postId: posts[3].id,
//     answer:
//       "I want to match the state in the below csv file to the zip code in another csv file. My dataset also does not contain that many states so I was thinking I could take advantage of a simple conditional expression or case statement that sets a new column equal to a certain zip code if a certain state is in that row.",
//     vote: {
//       count: 2,
//       score: 10
//     }
//   },
//   {
//     id: uuid(),
//     postId: posts[4].id,
//     answer:
//       "I want to match the state in the below csv file to the zip code in another csv file. My dataset also does not contain that many states so I was thinking I could take advantage of a simple conditional expression or case statement that sets a new column equal to a certain zip code if a certain state is in that row.",
//     vote: {
//       count: 3,
//       score: 15
//     }
//   }
// ];

// posts
app.get("/api/post", (req, res) =>
  db.getPosts({}).then(posts => res.json(posts))
);

app.post("/api/post", (req, res) => {
  let title = req.body.title;
  let description = req.body.description;
  db.addPost(title, description).then(id => {
    res.json({ id: id });
  });
});

app.get("/api/post/:id", (req, res) => {
  const post = findPostById(req.params.id);
  // TODO: If post is null, you should throw 404
  res.json(post);
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

db.connect();

/**** Reroute all unknown requests to angular index.html ****/
app.get("/*", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../dist/mandatory_exercise/index.html"));
});

/**** Start ****/
app.listen(port, () =>
  console.log(`Mandatory exercise API running on port ${port}!`)
);
