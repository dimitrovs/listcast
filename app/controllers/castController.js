//This controller retrieves data from the customersService and associates it with the $scope
//The $scope is bound to the order view
app.controller('CastController', function ($scope, $routeParams, castService) {
    $scope.castStatus = '';

    //I like to have an init() for controllers that need to perform some initialization. Keeps things in
    //one place...not required though especially in the simple example below
    init();

    function init() {
    }
    
    $scope.launchApp = function() {
        castService.launchApp().then(function(status){
            $scope.castStatus = status;
        });
    }
    
    $scope.stopApp = function() {
        castService.stopApp().then(function(status){
            $scope.castStatus = status;
        });
    }
    
    $scope.loadMedia = function() {
        castService.loadMedia($scope.channel_url).then(function(status){
            $scope.castStatus = status;
        });
    }
        
});