var {mongoose} = require('./db/mongoose');
var {Note} = require('./models/note');

// init project
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
// bodyParser, right now only takes json body
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: true}));

//http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  if (request.query.client === 'jquery') {
    response.sendFile(__dirname + '/views/note-index-jquery-client.html'); //option 1 - jquery client (to use jquery client, you have to append ?client=jquery)
  } else {
    response.sendFile(__dirname + '/views/note-index-angular-client.html');  //option 2 - angular client (by defaut it's angular)
  }
});

app.get("/notes", function (request, response) {  // you cannot only have /notes/:noteTitle and pass /notes only, it will say route cannot found
  Note.find().then((allNotes) => {
    response.send({allNotes}); 
  }, (e) => {
    response.status(404).send(e);
  }); 
});

app.post("/notes", function (request, response) {
  var title = request.body.title;
  var body = request.body.body;
  var note = new Note({
    title,
    body
  });
  note.save().then((note)=> {
    response.send({note, message: "Note was created"});
  }, (e)=> {
    response.status(400).send({message: "Note title taken"});
  });
});

app.get("/notes/:noteTitle", function (request, response) {  
  var noteTitle = request.params.noteTitle;
  Note.findOne({
    title: noteTitle
  }).then((note)=>{
    if (!note) {
      response.status(404).send({message: 'Note not found'}); // if no match, will return note as null, still considered as success Promise condition
    }
    response.send({message: 'Note found', note}); 
  }, (e)=>{
    response.status(400).send({message: 'failed finding that note'});
  });
});

app.delete("/notes", function (request, response) {
  var noteTitle = request.query.noteTitle; //because you use query string, you can combine two calls together
  var message;
   if (noteTitle === undefined) {   
    Note.remove({}).then((result) => {
      response.send({message: "all cleared"});
    }, (e) => {
      response.status(400).send({message: "failed clearing all notes"});                   
    });
  } else {   
    Note.findOneAndRemove({title: noteTitle}).then((note) => {
      if (!note) {
        response.status(404).send({message: "Note not found"}); // if no match, will return note as null, still considered as success Promise condition
      }
      response.send({message: "Note removed", note}); 
    }, (e) => {
      response.status(400).send({message: "failed removing that note"});                   
    });
  } 
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});