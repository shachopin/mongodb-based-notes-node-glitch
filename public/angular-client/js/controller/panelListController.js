(function(){
  angular.module('notesApp')
  .controller('PanelListController', function($http) {
    var panelList = this;
    panelList.panels = [];
    // $http.get('/notes').success(function(data){
    //   panelList.panels = data.allNotes;
    // });  
    // same functionaly as above, only the return data object is one more layer than the above, so you need to do data.data in .then and only data in .succcess
    $http.get('/notes').then(function(data){
      panelList.panels = data.data.allNotes;
    });  
  });
})();