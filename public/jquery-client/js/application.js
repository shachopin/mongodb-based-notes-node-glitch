$(function(){
  listNodes(); //initial load
  
	//button in a form is by default type of submit, 
	//to not submit the form can just make it type of button or make the js return false on the button click action 
  //button outside a form is by default of type button, so no need to do anything
   
  ////$('#listButton').on("click", function(){
    // $.getJSON( "/notes", function( json ) {
    //   console.log( "JSON Data: " + json); //successful request
    // }).fail(function(){
    //   console.log("request failed");
    // });
    
    //exactly the same as above, only catching the failed scenario 
    //(success function can be both in callback for getJSON or as called in the promise like done method for jquery deferred object, 
    //jquery ajax related function returns a jxhr object)
    
    // $.getJSON("/notes")
    // .done(function(data) {
    //   //console.log(data); //successful request for status 200. In express, calling response.send() without specify status automatically return 200
    //   $("#notesShowRoom").empty();
    //   data.allNotes.forEach((note) => {
    //       $("#notesShowRoom").append(
    //         "<div class='col-xs-4'>\
    //             <div class='panel panel-primary'>\
    //               <div class='panel-heading'>" + note.title + "</div>\
    //               <div class='panel-body' style='word-break:break-all;height: 100px;overflow-y: scroll;'>" + note.body + "</div>\
    //             </div>\
    //         </div>"
    //       );
    //   });
    // })
    // .fail(function(){
    //   console.log("request failed");  //for status not 200, like 404, 400, 500
    // });
    
    //listNodes();
    
  //});
  
  $('#noteTitle').on('keyup', function(){
    var noteTitle = $("#noteTitle").val().trim(); //welcomes ? here
    if (noteTitle.length > 25){
      $("#noteTitle").css("border", "2px solid red");
      $('#myalert').show();
      $('#addButton').prop('disabled', true); //notice the difference between attr() and prop(). attr() is the html attribute value, prop() is the for the DOM element during runtime
    } else {
      $("#noteTitle").css("border", "");
      $('#myalert').hide();
      $('#addButton').prop('disabled', false);
    }
  });
  
  $('#addButton').on("click", function(){ 
    var noteTitle = $("#noteTitle").val().trim(); //welcomes ? here
    var noteBody = $("#noteBody").val().trim();
    if (noteTitle.length === 0){
      $("#noteTitle").css("border", "2px solid red");
      return;
    }
    $("#noteTitle").css("border", "");
    if (noteBody.length === 0){
      $("#noteBody").css("border", "2px solid red");
      return;
    }
    $("#noteBody").css("border", "");
    
    $("#noteTitle").val('');
    $("#noteBody").val('');
    // $.post( "/notes", {title: $('#noteTitle').val(), body: $('#noteBody').val()}, function(data) { // the data object will be sent as in form data, on server side(expressJS), you need app.use(bodyParser.urlencoded({extended: true})); //to allow image or video, false will only take string
    //    console.log("successfully added: ", data.note.title);
    // }).fail(function(){
    //   console.log("failed");
    // });
    //by default, jquery doesn't have a postJSON method to send json request body
    //you have to use 
    // $.ajax({
    //     type: 'POST',
    //     url: '/form/',
    //     data: '{"name":"jonas"}', // or JSON.stringify ({name: 'jonas'}),
    //     success: function(data) { alert('data: ' + data); },
    //     error: function() {},
    //     contentType: "application/json",  //for request header
    //     dataType: 'json' //for response header
    // });
    
    //or someone posted the jquery extension method .postJSON you can use
    //http://rohanradio.com/blog/2011/02/22/posting-json-with-jquery/
    // $.extend({
    //   postJSON: function(url, data, callback, callback2) {
    //     return jQuery.ajax({
    //       type: "POST",
    //       url: url,
    //       data: JSON.stringify(data),
    //       success: callback,
    //       error: callback2,
    //       dataType: "json",
    //       contentType: "application/json",
    //       processData: false
    //     });
    //   }
    // });
    
    
    // $.ajax({
    //     type: 'POST',
    //     url: '/notes',
    //     data: JSON.stringify({title: $('#noteTitle').val(), body: $('#noteBody').val()}), //has to be the stringified version
    //     success: function(data) {console.log("successfully added: ", data.note.title);},
    //     error: function(err) {console.log("failed", err);},  //can err.responseText is a string: "{"message":"Note title taken"}"
    //     contentType: "application/json" //without this, still will be sent as in form data. even if you have data.JSON.stringify
    //     the form data will be {"title":"FF","body":"FFFF"}:nil
    //     ruby is able to parse it still, but not node.js
    //     for node.js, either 1)pass data object and without contentType: "application/json"
    //     Then on express server side, you need app.use(bodyParser.urlencoded({extended: true})); //to allow image or video, false will only take string
    //     or 2) pass stringified data object and with contentType: "application/json" and with only app.use(bodyParser.json()); but this might cause CORS issue
    // });
    
    //exactly same as before
    $.ajax({
        type: 'POST',
        url: '/notes',
        data: JSON.stringify({title: noteTitle, body: noteBody}),
        contentType: "application/json" //without this, still will be sent as in form data. Then on express server side, you need app.use(bodyParser.urlencoded({extended: true})); //to allow image or video, false will only take string
                                        //the form data will be {"title":"FF","body":"FFFF"}:nil
        //ruby is able to parse it still, but not node.js
        //for node.js, either 1)pass data object and without contentType: "application/json"
        //Then on express server side, you need app.use(bodyParser.urlencoded({extended: true})); //to allow image or video, false will only take string
        //or 2) pass stringified data object and with contentType: "application/json" and with only app.use(bodyParser.json()); but this might cause CORS issue
    
    }).fail(function(err){
      console.log("failed adding the note", err); //err.responseText is a string: "{"message":"Note title taken"}"
    }).done(function(data){
      console.log("successfully added: ", data.note.title);
      listNodes();
    });
  });
  
  $('#deleteAllButton').on("click", function(){
    $.ajax({
        type: 'DELETE',
        url: '/notes'
    }).fail(function(){
      console.log("failed deleting all"); 
    }).done(function(data){
      console.log(data.message);
      listNodes();
    });
  });
  
  //http://stackoverflow.com/questions/21292761/jquery-click-an-element-inside-its-clickable-container-how-to-override
  //here we need to do this because remove the note click is inside show the note click
  //$('.seq').click(function(ev) {
  // ev.stopPropagation();
  //});
  $(document).on("click", ".removeIcon", function(event){  //dynamicly generated elements need this rebinding way
    event.stopPropagation();
    var title = $(this).parent().text();
    $.ajax({
        type: 'DELETE',
        url: '/notes?noteTitle=' + title //will automatically convert space to %20
      //in url,https://file-based-notes-node.glitch.me/notes?noteTitle=?%20a%20? is possible, no need to replace ?
    //request.query.noteTitle will still decode the URL encoding
    //notice here you can only append ?noteTitle=title directly after url
    //POST and DELETE will send data object as form data by default, In order to append query string, you have to do it in URL directly
    //only GET will send data object as query string in URL 
    }).done(function(data){
      console.log(data.message);
      listNodes();
    });
  });
  
  $(document).on("click", ".panel", function(){  //dynamicly generated elements need this rebinding way
    var noteTitle = $(this).find(">:first-child").text();
    noteTitle = replaceQuestionMark(noteTitle);//if the string has spaces, no problem, will automatically replace with %20
    $.getJSON("/notes/" + noteTitle, function(data){ //will not automatically replace ?, that's why we need to do manually as above
      //server side. request.params will automatically decode the URL encoding 
      //suppose the database data has ending space, here the .text() will not return ending space, hence will show cannot find this note, 
      //using trim() in above before saving to db solved ths problem 
      //ACTUALLY there is no need to use trim() in application.js for the button click action (keyup action still need it) because I used trim() on the model layer. using trim() only for the file-based app 
      //Actually the above statement is wrong, although model layer trim() will make sure the database data wil be always trim, but without application.js trim(), user can type spaces and still pass the validation
      //we don't want that, so we still use trim() in application.js
      //no need to do that in angular client. ng-model will trim automatically for you
      showAlertBox(data.note.title, data.note.body);
    }).fail(function(){
      console.log("failed getting the note");
    });
  });
});


//utility function
function listNodes() {
  $.getJSON("/notes")
    .done(function(data) {
      //console.log(data); //successful request for status 200. In express, calling response.send() without specify status automatically return 200
      $("#notesShowRoom").empty();
      data.allNotes.forEach((note) => {
          $("#notesShowRoom").append(
            "<div class='col-xs-6 col-md-3'>\
                <div class='panel panel-primary' style='cursor:pointer'>\
                  <div class='panel-heading'>" + note.title + "<span class='glyphicon glyphicon-remove removeIcon' style='float:right;cursor:pointer'></span></div>\
                  <div class='panel-body' style='word-break:break-all;height: 100px;overflow-y: scroll;'>" + note.body + "</div>\
                </div>\
            </div>"
          );
      });
    })
    .fail(function(){
      console.log("request failed getting all nodes");  //for status not 200, like 404, 400, 500
    });
}

function showAlertBox(title, body) {
  $('#alert_placeholder').html(
    '<div class="alert alert-success alert-dismissible fade in show" role="alert">\
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">\
          <span aria-hidden="true">&times;</span>\
        </button>\
        <h4 class="alert-heading">' + title + '</h4>\
        <p id="alert-body">' + body + '</p>\
    </div>')
}  

function replaceQuestionMark(text) {
  return text.includes("?") ? text.split("?").join("%3F") : text;
}

