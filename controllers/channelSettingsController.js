//This controller is a child controller that will inherit functionality from a parent
//It's used to track the orderby parameter and ordersTotal for a customer. Put it here rather than duplicating 
//setOrder and orderby across multiple controllers.
app.controller('ChannelSettingsController', function ($scope, $routeParams, $location, channelsService) {
    $scope.channel = {};
    $scope.videoStreams = [];
    $scope.audioStreams = [];


    //I like to have an init() for controllers that need to perform some initialization. Keeps things in
    //one place...not required though especially in the simple example below
    init();

    function init() {
        //Grab customerID off of the route        
        var channelID = ($routeParams.channelID) ? parseInt($routeParams.channelID) : 0;
        if (channelID > 0) {
            $scope.channel = channelsService.getChannel(channelID);
            updateStreams();
        }
    }
    
    function updateStreams() {
        $scope.videoStreams = [];
        $scope.audioStreams = [];
        if ($scope.channel.streams) {
            $scope.channel.streams.forEach(function(stream) {
                if (stream.codec_type === 'video') {
                    $scope.videoStreams.push(stream);
                } else if (stream.codec_type === 'audio') {
                    $scope.audioStreams.push(stream);
                }
            });
        }
    }
    
    $scope.deleteChannel = function (id) {
        channelsService.deleteChannel(id);
    };
    
    $scope.probeChannel = function () {
        channelsService.probeChannel($scope.channel).then(function(channel){
            $scope.channel = channel;
            updateStreams();
        });
    }
    
    $scope.saveChannelSettings = function() {
        channelsService.updateChannel($scope.channel);
        $location.path('/');
    }


});