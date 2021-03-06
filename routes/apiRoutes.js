var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");



// A GET route for scraping the echoJS website

module.exports = function (app) {

  app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("http://www.nytimes.com/").then(function (response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      // Now, we grab every h2 within an article tag, and do the following:
      $(".css-6p6lnl").each(function (i, element) {
        // Save an empty result object

        var result = {};
        // console.log("i:", i);
        // console.log("element:", element);
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children("a")
          .children("div")
          .children("h2")
          .text().trim();

        // console.log(result.title.trim());
        result.link = ''
        result.link = $(this)
          .children("a")
          .attr("href");

        result.summary = $(this)
          .children()
          .text().trim()
        // console.log(result.link);

        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function (dbArticle) {
            // View the added result in the console
            // console.log("dbarticle: ", dbArticle);
          })
          .catch(function (err) {
            // If an error occurred, log it
            console.log(err);
          });

      });

      // Send a message to the client
      res.redirect("/")
    });
  });

  // Route for getting all Articles from the db
  app.get("/articles", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function (dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route for saving a specific Article by id
  app.get("/saved/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.update(
      { _id: req.params.id },
      { $set: { "saved": true } })
      // ..and populate all of the notes associated with it

      .then(function (dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  // Route for deleting a specific Article by id
  app.get("/delete/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.remove(
      { _id: req.params.id }
    )
      // ..and populate all of the notes associated with it

      .then(function (dbArticle) {
        console.log("Article Deleted");
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
    res.redirect("/saved")
  });
  // Route for grabbing specific Article by saved
  // app.get("/savedArticles", function (req, res) {
  //   // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  //   db.Article.find({ saved: true })
  //     // ..and populate all of the notes associated with it
  //     .then(function (dbArticle) {
  //       // If we were able to successfully find Articles, send them back to the client
  //       res.json(dbArticle);
  //       // res.redirect("/saved")
  //     })
  //     .catch(function (err) {
  //       // If an error occurred, send it to the client
  //       res.json(err);
  //     });
  // });



  app.get("/getNotes/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("modal-content")
      .then(function (dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });

  })



  // Route for saving/updating an Article's associated Note
  app.put("/saveNotes/:id", function (req, res) {


    // Create a new note and pass the req.body to the entry
    // console.log(req.body);
    // console.log("req.body above");
    db.Article.create(req.body)
      .then(function (dbNote) {
        // console.log("DBNOTE:", dbNote);
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query


        //   return db.Article.findOneAndUpdate({ _id: req.params.id , { note: dbNote._id }, { new: false }});
        // })


        return db.Article.findOneAndUpdate({ _id: req.params.id });
      })
      .then(function (dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });




  //Route for clearing database
  app.get("/clear", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.remove({})
      .then(function (dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        // res.json(dbArticle);
        res.redirect("/")
        console.log("Database Dropped");
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

}