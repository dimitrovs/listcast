//This controller retrieves data from the customersService and associates it with the $scope
//The $scope is bound to the order view
app.controller('SettingsController', function ($scope, $location, settingsService) {

    init();

    function init() {
        $scope.transcoderURL = settingsService.getTranscoderURL();
        $scope.analyzerURL = settingsService.getAnalyzerURL();
    }
    
    $scope.saveSettings = function() {
        settingsService.updateSettings($scope.transcoderURL, $scope.analyzerURL);
        $location.path('/');
    }

});