(function(){
  angular.module('notesApp')
  .directive('noteOperationForm', function() {
    return {
      restrict: 'E',
      templateUrl: '/angular-client/view/directive/form.html',
      controller: function($scope, $attrs, $http) { 
        var form = this;
        //this.note = {}; //not necessary
        this.addNote = function() {
          //post api TBD
          console.log("add note: " + this.note.title);
          
//        To access parent scope property, have two ways:
//        below revised option 1
          //$http.post('/notes', {title: this.note.title, body: this.note.body}) 
          //or
          $http.post('/notes', this.note) 
           .success(function(data) { //in success condition, add it in memory too, no need to call get just to refresh the list
             //console.log(data);  reuturn {message: "asdasd", note: {note obj}}
             $scope.panelList.panels.push({
                title: data.note.title, //or form.note.title
                body: data.note.body
             });
             form.note = {};
          });  
          
//        below option 2
//        var parent = $scope.$eval($attrs.parentobject); //has to match the html atttibute name, has to be in all lowercases though //using option 2 here //parent is got return an object

//        $http.post('/notes', {title: this.note.title, body: this.note.body})
//         .success(function(data) { //in success condition, add it in memory too, no need to call get just to refresh the list
//           //console.log(data);  reuturn {message: "asdasd", note: {note obj}}
//           parent.panels.push({
//              title: data.note.title, //or form.note.title
//              body: data.note.body
//           });
//           form.note = {};
//        });         
        };
      },
      controllerAs: 'form'
    };
  });
})();


/* https://github.com/johnpapa/angular-styleguide/issues/457 
How to access parent scope in child controller

option 1:
Using controller
Using the controllerAs syntax, what is a good practice to access/modify simple properties of a parent controller? Please see the example below. I do not like accessing them via $scope.$parent.parent. How do you guys go about similar situations without creating a service for such a trivial logic.

<div ng-controller="Parent as parent">

  <div ng-if="parent.showMessage">
    Some simple message.
  </div>

  <div ng-controller="ChildOne as childOne"></div>

</div>
app.controller('Parent', function () {
    var self = this;
    self.showMessage = true;
});

app.controller('ChildOne', function ($scope) {
    var self = this;
    self.foo = 'bar';
    // Some simple logic.
    if (self.foo === 'bar') {
        $scope.$parent.parent.showMessage = false;  //$scope.$parent is not in child directive's contoller though. Using directive, have to check below
        //although without scope: {}, the directive's html side can access the parent scope variable
        //somehow in directive's controller cannot <--this is wrong, check below, child directive controller can still access parent scope just like html
    }
});

The above way is out dated
revised option 1

in child directive controller, can direct say
console.log("am I working?" + JSON.stringify($scope.panelList.panels));
panelList is the parent controller's alias
just like in directive html temlate, you can say {{panelList}}
because you have not set scope: {} to give it an isolate scope


option 2:
using directive

I would solve this using a diretive to encapsulate the child controller, like this:

<div ng-controller="Parent as parent">

  <div ng-if="parent.showMessage">
    Some simple message.
  </div>

  <div child-one parent="parent"></div>

</div>
app.controller('Parent', function () {
    var self = this;
    self.showMessage = true;
});

app.directive('childOne', function() {
    return {
        controllerAs: 'childOne',
        controller: function($scope, $attrs) {
            var parent = $scope.$eval($attrs.parent);

            var self = this;
            self.foo = 'bar';
            // Some simple logic.
            if (self.foo === 'bar') {
                parent.showMessage = false;
            }
        }
    };
});
Or to use a ng-init on the second contoller.

<div ng-controller="ChildOne as childOne" ng-init="childOne.setParent(parent)"></div>


option 3:

Using a more component-oriented approach:

<html ng-app="myApp">
  <body>
    <div ng-controller="ParentCtrl as vm">
      <my-directive on-foo-eq-bar="vm.updateMessage(msg)"></my-directive>
    </div>

    <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular.min.js"></script>
    <script>
      angular.module('myApp', [])
        .controller('ParentCtrl', function($window) {
          var vm = this;
          vm.updateMessage = function(msg) {
            $window.alert(msg);
          };
        })
        .directive('myDirective', function() {
          return {
            scope: {
              onFooEqBar:'&'
            },
            controllerAs:'vm',
            controller: function($scope) {
              var self = this;
              self.foo = 'bar';
              // Some simple logic.
              if (self.foo === 'bar') {
                $scope.onFooEqBar({msg: false});
              }
            }
          };
        });
    </script>
  </body>
</html>










*/
