var db = require("../models");
module.exports = function (app) {

  app.get("/", function (req, res) {
    db.Article.find({}).then(function (results) {
      res.render("index", { results: results });

    });
  });


  app.get("/saved", function (req, res) {
    db.Article.find({ saved: true }).then(function (results) {
      res.render("index", { results: results });

    });
  });

  app.get("/clear", function (req, res) {
    db.Article.remove({}).then(function (results) {
      res.render("index", { results: results });

    });
  });



  // app.get("/example/:id", function (req, res) {
  //   db.mainInventory.findOne({ where: { wine: req.params.id } }).then(function (
  //     dbExample
  //   ) {
  //     console.log(dbExample.dataValues);
  //     res.render("example", {
  //       example: dbExample
  //     });
  //   });
  // });


  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
}   