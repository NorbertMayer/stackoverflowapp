const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

// uuid
const uuid = require("uuid/v4");

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

const posts = [
  {
    id: uuid(),
    title: "Angular 6 configurations of the dev server",
    description:
      "I hope someone could help me with this because I've been trying to switch from webpack to angular cli. I've accomplished that but when other people pull my branch and try to go to the home page, but for some reason the index.html file gets downloaded and nothing else happens. I cant find anything online talking about this issue. For some reason, the content type header is being applied. Any ideas?"
  },
  {
    id: uuid(),
    title: "Angular change set data from API",
    description:
      "Hey so I'm using an openAPI to get some data. Everything reads in correctly now I want to change the data. Say for 9.00 I get some data and after a couple of hours I get the next result. Now I want the result for 8.00 clock instead, I don't want all results I want it to end at a certain result. How can this be done? I want to change the data to my set times instead."
  },
  {
    id: uuid(),
    title:
      "Angular material accordion based on user input override user click on input",
    description:
      "I'm trying to build a small accordion using Angular Material and I want to make an input field so that whenever the user types something, the accordion's panels are automatically expanded if they have subitems which contain that string. "
  },
  {
    id: uuid(),
    title: "Search for new added divs on a webpage",
    description:
      "I have to search for only new added divs into a webpage, these divs are added in real time. I've tried to use Selenium + Python but I can only get elements that are already on the page. Can you please help me?"
  },
  {
    id: uuid(),
    title:
      "C# won't let me put certain variables at the beginning of method. I don't understand why not",
    description:
      "I've been learning C# for a little over a month. I am working on an exercise where I ask the user to enter a time in a 24-hour clock format and check if it's valid."
  }
];
const comments = [
  {
    id: uuid(),
    postId: posts[0].id,
    answer:
      "I want to match the state in the below csv file to the zip code in another csv file. My dataset also does not contain that many states so I was thinking I could take advantage of a simple conditional expression or case statement that sets a new column equal to a certain zip code if a certain state is in that row."
  },
  {
    id: uuid(),
    postId: posts[0].id,
    answer:
      "I want to match the state in the below csv file to the zip code in another csv file. My dataset also does not contain that many states so I was thinking I could take advantage of a simple conditional expression or case statement that sets a new column equal to a certain zip code if a certain state is in that row."
  },
  {
    id: uuid(),
    postId: posts[1].id,
    answer:
      "I want to match the state in the below csv file to the zip code in another csv file. My dataset also does not contain that many states so I was thinking I could take advantage of a simple conditional expression or case statement that sets a new column equal to a certain zip code if a certain state is in that row."
  },
  {
    id: uuid(),
    postId: posts[2].id,
    answer:
      "I want to match the state in the below csv file to the zip code in another csv file. My dataset also does not contain that many states so I was thinking I could take advantage of a simple conditional expression or case statement that sets a new column equal to a certain zip code if a certain state is in that row."
  },
  {
    id: uuid(),
    postId: posts[3].id,
    answer:
      "I want to match the state in the below csv file to the zip code in another csv file. My dataset also does not contain that many states so I was thinking I could take advantage of a simple conditional expression or case statement that sets a new column equal to a certain zip code if a certain state is in that row."
  },
  {
    id: uuid(),
    postId: posts[4].id,
    answer:
      "I want to match the state in the below csv file to the zip code in another csv file. My dataset also does not contain that many states so I was thinking I could take advantage of a simple conditional expression or case statement that sets a new column equal to a certain zip code if a certain state is in that row."
  }
];

// posts
app.get("/api/post", (req, res) => res.json(posts));

app.post("/api/post", (req, res) => {
  let title = req.body.title;
  let description = req.body.description;
  let id = uuid();
  const post = {
    id: id,
    title: title,
    description: description
  };

  posts.push(post);
  res.json(post);
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
    postId
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

/**** Reroute all unknown requests to angular index.html ****/
app.get("/*", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../dist/mandatory_exercise/index.html"));
});

/**** Start ****/
app.listen(port, () =>
  console.log(`Mandatory exercise API running on port ${port}!`)
);
