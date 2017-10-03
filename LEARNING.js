1. request.query.something  for ?something=blah
2. app.get("/notes/:noteTitle", function (request, response) {  
  var noteTitle = request.params.noteTitle;
3. app.use(bodyParser.json());, so you can use var title = request.body.title; after passing the json in the request body

/*************************************************************************************************************************************************************************/
Send Request
1. jquery sending GET request:
$.getJSON( "test.js", { name: "John", time: "2pm" } ) //will be query params in URL
  .done(function( json ) {
    console.log( "JSON Data: " + json.users[ 3 ].name ); //successful requst
  })
  .fail(function( jqxhr, textStatus, error ) {
    var err = textStatus + ", " + error;
    console.log( "Request Failed: " + err );
});

  
$.get('/dreams', function(dreams) { //if the server sends json string (array is also json), will convert it to object; if the server just sends string, will show string, a string.forEach will be undefined
  dreams.forEach(function(dream) {
    $('<li></li>').text(dream).appendTo('ul#dreams'); //useful appendTo
  });
});

// $.getJSON('/dreams', function(dreams) { //if the server sends json string (array is also json), will convert it to object; if the server just sends string, will not even be entered
//   dreams.forEach(function(dream) {
//     $('<li></li>').text(dream).appendTo('ul#dreams'); //useful appendTo
//   });
// });

 $.ajax(
 {url:"/dreams",
 success: function(result){ //if the server sends json string (array is also json), will convert it to object; if the server just sends string, will show string,
    console.log(result);
 }});

  
  
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
    
2. JQuery sending POST request
$('form').submit(function(event) {  //notice this form doesn't have to have name attribute
  event.preventDefault(); //same effect as hijacking the form, not submitting the form which is form's default behavior
  var dream = $('input').val();
  $.post('/dreams?' + $.param({dream: dream}), {dream: dream}, function(data) {  //$.param({dream: dream}) will add query string to the url  // {dream: dream} will send form data // in this case, both query string and request body form data will have dream: asd
    $('<li></li>').text(dream).appendTo('ul#dreams');  //suppose I capture the retun in function parameter,  //if the return "data" is json string (array is also json), will convert it to object //if just plain text, then render text
    $('input').val('');
    $('input').focus(); //useful to set focus back
    console.log(typeof data); //if the return "data" is json string (array is also json), will convert it to object //if just plain string, then render string
    console.log(data.message); //if data is of string type, then this will be undefined
  });
});

$('#btn').click(function() { //notice for serialize to work, the form has to have name attribute for each field
  var form = $("#aForm").serialize();
  console.log(form); //dream=asd&year=22
  console.log(typeof form);  //string
   $.post('/dreams', form, function(data) { 
     console.log(data);   //will see data sent as form data, pretty much the same as above
   });
});
  
  
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
  //     contentType: "application/json" //without this, still will be sent as in form data. even if you have data: JSON.stringify
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

3. JQuery sending delete request:
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
  
4.Angular sending HTTP GET Request
// $http.get('/notes').success(function(data){
//   panelList.panels = data.allNotes;
// });  
// same functionaly as above, only the return data object is one more layer than the above, so you need to do data.data in .then and only data in .succcess
$http.get('/notes').then(function(data){
  panelList.panels = data.data.allNotes;
});  
//another way
$http({method: "GET", url: "/notes/" + replaceQuestionMark(noteTitle)})  //to fix title has ? issue in /notes/:noteTItle, as in jquery
.success(function(data) {
  showAlertBox(data.note.title, data.note.body);
});

5 Angular sending HTTP POST Request
//$http.post('/notes', {title: this.note.title, body: this.note.body}) 
//or
$http.post('/notes', this.note) 
.success(function(data) { //in success condition, add it in memory too, no need to call get just to refresh the list
 //console.log(data);  reuturn {message: "asdasd", note: {note obj}}

6. Angular sending HTTP DELETE Request
$http({method: "DELETE", url: "/notes?noteTitle=" + noteTitle}) // ? is alowed here in query string
          .success(function(data) {  //in success condition, delete it from memory too, no need to call get just to refresh the list
/*************************************************************************************************************************************************************************/
Promise:
1. 
return Promise.reject();
//same as
/*
return new Promise((resolve, reject) => {
  reject();
});
*/
2.
function readJSON(filename){
  return readFile(filename, 'utf8').then(function (res){
    return JSON.parse(res)
  })
}

Since JSON.parse is just a function, we could re-write this as:

function readJSON(filename){
  return readFile(filename, 'utf8').then(JSON.parse);
}

3.
Promise.prototype.then(onFulfilled, onRejected)
Appends fulfillment and rejection handlers to the promise, \
and returns a new promise resolving to the return value of the called handler, 
or to its original settled value if the promise was not handled 
(i.e. if the relevant handler onFulfilled or onRejected is not a function).

4.
jQuery
This feels like a good time to warn you that what jQuery calls a promise is in fact totally different to what everyone else calls a promise. jQuery's promises have a poorly thought out API that will likely just confuse you. Fortunately, instead of using jQuery's strange version of a promise, you can just convert it to a really simple standardised promise:

var jQueryPromise = $.ajax('/data.json');
var realPromise = Promise.resolve(jQueryPromise);
//now just use `realPromise` however you like.

5.
 /* utlity functions */
function checkExistingIDCSRoleGrants(userId) //needed for revokeRoleAssignment
{
    var existingIDCSRoleGrants = [];

    var grantsParams = {"filter":"grantee.value+eq+%22" + userId + "%22"};
    return idcsRestFacade.getIdcsGrants(grantsParams)
    .then (function (grants)
    {
       grants.resources.forEach(function(resource)
       {
         existingIDCSRoleGrants.push(resource.id);
       });
       return Promise.resolve(existingIDCSRoleGrants);
    }).catch(function(e)
    {
      say("retrieve role grants error:", e);
      return Promise.reject();
    }); 
}

function revokeRoles(grantIds)
{
   var itemRemoved = 0;
   if (grantIds.length === 0) 
   {
      return Promise.resolve("There is no idcs role to remove");
   }
   return new Promise(function(resolve, reject) {
      grantIds.forEach(function(grantId)
      {
         idcsRestFacade.removeIdcsRoleGrant(grantId)
         .then(function(result)
         {
            itemRemoved++;
            say("unassign idcs role ok");
            if (grantIds.length === itemRemoved) 
            {
               resolve("all idcs roles have been removed");
            }
         }, function(e)
         {
            say("unassign idcs role error", e);
            reject("some error removing the idcs role");
         });
      });  
   });
}
  
var currentPerson = self.userManagement.currentUser();
checkExistingIDCSRoleGrants(currentPerson.id).then(function(grantIds)
{
  revokeRoles(grantIds).then(function()
  {
     idcsRestFacade.removeIdcsUser(currentPerson.id)
     .then(function(result)
     {
        self.closeRemoveUserDialog ();
        self.userManagement.setConfirmationMessage (oj.Translations.getTranslatedString ('user.list.removedUser', self.userManagement.currentUser ().name ()));
        self.userPagingListModel.removeRecord (currentPerson.id);

        self.loadUsers (); // Refresh page of user records

     }, function(e)
     {
        self.removeUserMessage.setError (oj.Translations.getTranslatedString ('user.list.errorRemovingUser'));
     });
  }).catch(function(e)
  {
     self.removeUserMessage.setError (oj.Translations.getTranslatedString ('user.list.errorRemovingUser'));
  });
           

6. 
p1.then(function(value) {
  console.log(value); // "Success!"
  throw "oh, no!"; //throw can be caught as an unsuccessful condition as well, just like by reject(e)
}).catch(function(e) {
  console.log(e); // "oh, no!"
});

p1.then(function(value) {
  console.log(value); // "Success!"
  throw "oh, no!";
}).then(undefined, function(e) {
  console.log(e); // "oh, no!"
});


7
For Angualar Promises:
https://github.com/angular/angular.js/issues/10508

Hello. $http returns a normal promise for a server response object (with data, status, headers etc.). 
As a normal promise, returning values from a handler in .then results in a new exported promise for the value 
(or assimilation, if the return value is a promise, or rejection in case of error, etc.). That is all well and good.

For convenience/abstraction, AngularJS provides two custom methods on promises returned by 
$http: .success and .error. Each takes a single handler with the data, status etc. as parameters.

The problem is that people familiar with promises will likely try to chain off of 
.success, perhaps by transforming and returning new values or new promises. 
However, .success does not return a new promise; rather, it returns the original promise:

angular.module('promisesApp')
  .controller('MainCtrl', function ($http, $log) {

    $http.get('/api/things')
      .success(function (data) {
        $log.debug('in success:', data); // these are the things from the API
        return 'a new value';
      })
      .then(function (data) {
        $log.debug('in chained .then:', data);
        // data is the original server response object, NOT 'a new value'
        // data.data are the things from the API
      });

  });
If you were trying to make .success chainable in the same way .then is, 
it would be easy to change in the AngularJS source, and indeed I had started work on a pull request:

8.  
// $http.get('/notes').success(function(data){
//   panelList.panels = data.allNotes;
// });  
// same functionaly as above, only the return data object is one more layer than the above, so you need to do data.data in .then and only data in .succcess
$http.get('/notes').then(function(data){
  panelList.panels = data.data.allNotes;
});  

9 return a value directly means the promise good condition is triggered, and the parameters gets that value
but this only working in .then(), not workiing in original promise

 return user.save().then(() => { //.then() returns a promise object. So here it's returned a promise with token as success argument (return token)
    return token;
  });
  
  check more in your repl example
  
var somePromise = new Promise((resolve, reject) => {
  resolve('it worked');  //only one of them should be active
  //return ('it worked');  //-------- this is not working
  //throw('it failed');   //----------- this is working
});

somePromise.then((message) => {
  console.log("success: ", message); 
  //return Promise.resolve('it worked again');  //----------- this is working
  return 'it worked again';   //----------- this is working
})
.then(function(message) {
  console.log("success: ", message);
})
.catch(function(error){
  console.log("error: ", error); //shows it failed
});

/////////////////////////////////////////////////////////////////////////

function getPromise() {
  return new Promise(function(resolve, reject) {
    resolve(" I am working");
  });
} 
  
function consumePromise() {
  return getPromise()  //need to return, below there is explanation...
  .then(function(msg) {
    console.log(msg);
    //return "great";  will show great, without will show undefined in the below function
  });
}
  
consumePromise();

consumePromise()
.then(function(msg2){
  console.log(msg2)  //shows undefined
});

//if in consumePromise function, you don't return getPromise(), it will say
//Cannot read property 'then' of undefined