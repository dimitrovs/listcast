//This controller retrieves data from the customersService and associates it with the $scope
//The $scope is ultimately bound to the customers view
app.controller('ChannelsController', function ($scope, $location, channelsService, fileService, castService) {

    //I like to have an init() for controllers that need to perform some initialization. Keeps things in
    //one place...not required though especially in the simple example below
    init();

    function init() {
        $scope.newChannelName = "";
        $scope.newChannelUrl = "";
        $scope.playlistFile = null;
        $scope.channels = channelsService.getChannels();
    }

    $scope.insertChannels = function () {
        $scope.clearChannels();
        fileService.parseFile($scope.playlistFile).then(function(channels) {
            for (num in channels) {
                channelsService.insertChannel(channels[num].name, channels[num].url, '');
            }
            $scope.channels = channelsService.getChannels();
        })
        
        $scope.playlistFile = null;
    };
    
    $scope.insertChannel = function () {
        channelsService.insertChannel($scope.newChannelName, $scope.newChannelUrl, '');
        $scope.channels = channelsService.getChannels();
        $scope.newChannelName = "";
        $scope.newChannelUrl = "";
    }
    
    $scope.clearChannels = function () {
        channelsService.clearChannels();
    };
    
    $scope.playChannel = function (id) {
        if (castService.isReady()) {
            castService.loadMedia(channelsService.getChannel(id,'matroska'));
        } else {
            $location.path('/player/'+id);
        }
    };
});
