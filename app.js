var app = angular.module('listCastApp', ['ngRoute', 'LocalStorageModule', 'ngSanitize']);

//This configures the routes and associates each route with a view and a controller
app.config(function ($routeProvider) {
    $routeProvider
        .when('/channels',
            {
                controller: 'ChannelsController',
                templateUrl: '/app/partials/channels.html'
            })
        //Define a route that has a route parameter in it (:customerID)
        .when('/player/:channelID',
            {
                controller: 'PlayerController',
                templateUrl: '/app/partials/player.html'
            })
        .when('/editChannel/:channelID',
            {
                controller: 'ChannelSettingsController',
                templateUrl: '/app/partials/channelSettings.html'
            })
        .when('/settings',
            {
                controller: 'SettingsController',
                templateUrl: '/app/partials/settings.html'
            })
        .otherwise({ redirectTo: '/channels' });
});

app.run(function($rootScope) {
    $rootScope.$on( "$routeChangeSuccess", function(event, next, current) {
        if (current && current.$$route && current.$$route.controller === 'PlayerController')
            current.scope.stopVideo();
    });
});
