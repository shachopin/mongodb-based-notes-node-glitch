(function(){
  angular.module('notesApp')
  .directive('notePanel', function($http) {
    return {
      restrict: 'E',
      templateUrl: '/angular-client/view/directive/panel.html',
      link: function(scope, element) { //link function will run only after the directive is finished loading, so good place to run jquery code
        element.on("click", function() {
          // //console.log(element);
          // //element represents a jqueryLike object for DOM element <div class="col-xs-6 col-md-3">, which is outmost element in the directive html
          // //this jqueryLike object has limitted methods - check https://docs.angularjs.org/api/ng/function/angular.element
          // var array = element.find('div'); //element can only find by tag name, //it returns array of DomElement
          // var domElement = array[2];
          // var jqueryLikeElement = angular.element(domElement); //wrap that DOMElement to a angualr jquery element
          // var noteTitle = jqueryLikeElement.text();
          
          // the above works even without jquery library, because it's using angular internal jquery like things, but limited
          
          //after including jquery library in index.html
          //element is just like any jquery object
          //it represents the outtmost DOM element of the directive html
          var noteTitle = $(element.find(".panel-heading")[0]).text() //$() is to convert DOM element to jqeury object
          
          //notice here $http cannot be passed in link function parameters list, 
          //you have to pass in the directive level
          $http({method: "GET", url: "/notes/" + replaceQuestionMark(noteTitle)})  //to fix title has ? issue in /notes/:noteTItle, as in jquery
          .success(function(data) {
            showAlertBox(data.note.title, data.note.body);
          });
        });
      },
      controller: function($scope, $http) {
        $scope.deleteNote = function(noteTitle, panelArray) {  
          //console.log("I'm going to delete " + noteTitle);
          $http({method: "DELETE", url: "/notes?noteTitle=" + noteTitle}) // ? is alowed here in query string
          .success(function(data) {  //in success condition, delete it from memory too, no need to call get just to refresh the list
            var chosenNoteArray = panelArray.filter(function(item) {
              return noteTitle === item.title;
            });
            var chosenNote = chosenNoteArray[0];
            var index = panelArray.indexOf(chosenNote);
            if (index > -1) {
               panelArray.splice(index, 1);
            }
          });
        };
      }
    /*****************************/
    // controller: function($scope) {  //way 1, in nw-card.html, you say {{header}}
    //   $scope.header = "haha header with $scope keyward " + num++; //even when the route again routes to the page, the num increases
    // },
    /*****************************/
    // controller: function() {   //way 2, in nw-card.html, you say {{card.header}} //can still pass in $scope to do thing in the controller method argument, but keep controllerAs 
    //   this.header = "haha header with this keywrod " + num++;
    // },
    // controllerAs: "card",
    /*****************************/ 
    };
  });
  
  //utility functions
  function showAlertBox(title, body) {
    $('#alert_placeholder').html(
        '<div class="alert alert-success alert-dismissible fade in show" role="alert">\
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">\
              <span aria-hidden="true">&times;</span>\
            </button>\
            <h4 class="alert-heading">' + title + '</h4>\
            <p id="alert-body">' + body + '</p>\
        </div>');
  }

  function replaceQuestionMark(text) {
    return text.includes("?") ? text.split("?").join("%3F") : text;
  }
  
})();