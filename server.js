var express = require("express");
var fs = require("fs");
var methodOverride = require("method-override");

var app = express();


//sets up view engine
app.set("view engine", "ejs");
//sets up a static folder where CSS, JS, and images can be found
app.use(express.static("static"));
app.use(express.urlencoded({extended: false}));
app.use(methodOverride("_method"));

//Setting up root directory
app.get("/", function(req, res) {
    res.send("working or something")
});

//Articles from JSON go into index
app.get("/articles", function(req, res) {
    var articles = fs.readFileSync("./articles.json");
    var articleData = JSON.parse(articles);
    console.log(articleData);
    res.render("articles/index", {myArticles: articleData});
});

//Create new article
app.get("/articles/new", function(req, res) {
    res.render("articles/new");
});

//Post new article
app.post("/articles", function(req, res) {
    var articles = fs.readFileSync("./articles.json");
    articles = JSON.parse(articles);
    articles.push(req.body);
    fs.writeFileSync("./articles.json", JSON.stringify(articles));
    res.redirect("/articles");
});

//show one page of each article
app.get("/articles/:id", function(req, res) {
    var articles = fs.readFileSync("./articles.json");
    var articleData = JSON.parse(articles);
    var articleIndex = parseInt(req.params.id);
    if (articleIndex > articleData.length -1) {
        res.send("pick a lower index")
    } else {
        res.render("articles/show", {myArticles: articleData[articleIndex]});
    }
});

//Delete
app.delete("/articles/:id", function(req, res) {
    var articles = fs.readFileSync("./articles.json");
    articles = JSON.parse(articles);
    articles.splice(parseInt(req.params.id), 1);
    fs.writeFileSync("./articles.json", JSON.stringify(articles));
    res.redirect("/articles");
});

//Sending out the edit form
app.get("/articles/:id/edit", function(req, res) {
    var articles = fs.readFileSync("./articles.json");
    articles = JSON.parse(articles);
    var articleIndex = parseInt(req.params.id);
    res.render("articles/edit", {article: articles[articleIndex], articleId: articleIndex});
});

app.put("/articles/:id", function(req, res) {
    var articles = fs.readFileSync("./articles.json");
    articles = JSON.parse(articles);
    var articleId = parseInt(req.params.id);
    articles[articleId].title = req.body.title;
    articles[articleId].body = req.body.body;
    fs.writeFileSync("./articles.json", JSON.stringify(articles));
    res.redirect("/articles/" + articleId);
});


app.listen(3000);