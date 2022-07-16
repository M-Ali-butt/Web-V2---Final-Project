const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Blog = require("./models/Blog");
const app = express();



//connect to mongoDB
mongoose
  .connect("mongodb://localhost:27017/Blog")
  .then(() => {
    console.log(`Connected to MongoDB`);
  })
  .catch((err) => {
    console.log(`Oh No ERROR!`);
    console.log(err);
  });

app.use(methodOverride("_method"));

//parsing data form req.body
app.use(express.urlencoded({ extended: true }));

//static assets
app.use(express.static("public"));

//templating engine
app.set("view engine", "ejs");

//home route
app.get("/",  async (req, res) => {
  try {
    const blogs = await Blog.find().sort([['_id', -1]]);
    // console.log(recepies);
    res.render("home", { blogs });
  } catch (error) {
    console.log(`Oh No ERROR!`);
    res.send(error.message);
  }

  // res.render("home");
});



//show all recepies
app.get("/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find();
    // console.log(recepies);
    res.render("blogs/blogs", { blogs });
  } catch (error) {
    console.log(`Oh No ERROR!`);
    res.send(error.message);
  }
});

//render create new recepie page
app.get("/blog/new", (req, res) => {
  res.render("blogs/new");
});

//create new recepie
app.post("/blogs", async (req, res) => {
  const { title, text, author ,img ,createdDate ,category } = req.body;

  const blog = new Blog({
    title,
    text,
    author,
    img,
    createdDate,
    category,
  });
  try {
    await blog.save();
    res.redirect("/blogs");
  } catch (error) {
    console.log(`Oh No ERROR!`);
    res.send(error.message);
  }
});

//show details page
app.get("/blogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const foundBlog = await Blog.findById(id);

    res.render("blogs/blog", { foundBlog });
  } catch (error) {
    console.log(`Oh No ERROR!`);
    res.send(error.message);
  }
});

//edit recepie form
app.get("/blogs/:id/edit", async (req, res) => {
  const id = req.params.id;
  const foundBlog = await Blog.findById(id);
  res.render("blogs/update", { foundBlog });
});

//update route
app.patch("/blogs/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const foundBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    console.log(foundBlog);
    res.redirect("/blogs");
  } catch (error) {
    console.log(`Oh No ERROR!`);
    res.send(error.message);
  }
});

//Delete recepie
app.delete("/blogs/:id", async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect("/blogs");
  } catch (error) {
    console.log(`Oh No ERROR!`);
    res.send(error.message);
  }
});
 
app.get("/search", async (req, res) => {
  try{
    const category = req.query;
    console.log(category.search);
    const searchBlog = await Blog.find({ category: (category.search) });
    res.render("blogs/search", {searchBlog});
    
  }catch (error) {
    console.log(`Oh No ERROR!`);
    res.send(error.message);
  }
})

app.listen(8080, () => {
  console.log("Server Listening at PORT 8080");
});
