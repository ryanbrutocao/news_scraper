//Save an article to database
$(".saveBtn").on("click", function () {
  let url = "/saved/" + $(this).attr('id');
  let urlID = $(this).attr('id')
  console.log(urlID);
  $.ajax({
    url: url
  }).then(function () {

    console.log("saved! the ID is: " + url);
  })
})

// delete an article from the database
$(".deleteBtn").on("click", function () {
  // $(".articlesHere").empty()
  let url = "/delete/" + $(this).attr('value');
  console.log("delete button url id: ", url);
  $.ajax({
    url: url
  })
    .then(function () {

      window.location = "/saved"
    })
})



let idVal = ""
console.log("id val: ", idVal);

// Whenever someone clicks the 'add a note' button
$(".noteBtn").on("click", function () {
  let thisId = $(this).attr("data-id");
  console.log("this id 2", thisId);

  idVal = thisId;
  console.log("inside", idVal);
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/getNotes/" + thisId
  })

    // With that done, add the note information to the page
    .then(function (data) {


      $(".modal-title").text("Notes for Article: " + data._id)
      $('.save-note').attr('data-id', data._id)


    });

});

$(".saveNoteBtn").on("click", function () {
  console.log(idVal);
  var theSaveId = idVal;
  var url = "/saveNotes/" + theSaveId
  console.log("this id save:", theSaveId);
  console.log("url: ", url);
  $.ajax({
    method: "PUT",
    url: url,
    note: $(".note").val()

  })
    .then(function (data) {
      console.log(data);
      console.log("this note has been saved");
      $(".modal-title").empty()
      $(".modal-body").empty()
      $(".note").val("")
      $(".modal").toggle();
    });






  // var thisId = $("button").attr("data-id");
  // console.log(this); 

  // console.log("this id 3", thisId);
  // let content = $(".noteTxt").val()
  // console.log(content);
  // $.ajax({
  //   method: "PUT",
  //   url: "/notes/" + thisId,
  //   data: {
  //     note: content
  //   }
  // }).then(function (data) {
  //   console.log("content being sent:", content);
  //   $('#notes').modal('hide')
  // })

})


// // When you click the savenote button
// $(document).on("click", "#saveBtn", function () {
//   // Grab the id associated with the article from the submit button
//   var thisId = $(this).attr("data-id");
//   console.log("ln82", thisId);
//   // Run a POST request to change the note, using what's entered in the inputs
//   $.ajax({
//     method: "POST",
//     url: "/articles/" + thisId,
//     data: {
//       // Value taken from title input
//       title: $("#titleinput").val(),
//       // Value taken from note textarea
//       body: $("#bodyinput").val()
//     }
//   })
//     // With that done
//     .then(function (data) {
//       // Log the response
//       console.log(data);
//       // Empty the notes section
//       $("#notes").empty();
//     });

//   // Also, remove the values entered in the input and textarea for note entry
//   $("#titleinput").val("");
//   $("#bodyinput").val("");
// });
