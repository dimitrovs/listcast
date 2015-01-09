//This controller retrieves data from the customersService and associates it with the $scope
//The $scope is bound to the order view
app.controller('PlayerController', function ($scope, $routeParams, $sce, channelsService) {
    $scope.channel = {};
    $scope.channel_url = "";
    $scope.stopVideo = function() {
        var videoElements = angular.element($("video"));
        videoElements[0].pause();
        videoElements[0].src = "";
    };

    //I like to have an init() for controllers that need to perform some initialization. Keeps things in
    //one place...not required though especially in the simple example below
    init();

    function init() {
        //Grab customerID off of the route        
        var channelID = ($routeParams.channelID) ? parseInt($routeParams.channelID) : 0;
        if (channelID > 0) {
            var channel = channelsService.getChannel(channelID,'matroska');
            $scope.channel = channel
            $scope.channel_url = $sce.trustAsResourceUrl(channel.transcoder_url);
        }
    }
});