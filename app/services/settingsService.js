//This handles retrieving data and is used by controllers. 3 options (server, factory, provider) with 
//each doing the same thing just structuring the functions/data differently.
app.service('settingsService', function (localStorageService) {
    var settings = localStorageService.get("settings");
    if (settings == null){
        settings = {transcoderURL:'', analyzerURL:''}
    }
    
    this.getTranscoderURL = function () {
        return settings.transcoderURL;
    };
    
    this.getAnalyzerURL = function () {
        return settings.analyzerURL;
    };
    
    this.autoProbe = function () {
        return settings.autoProbe;
    };

    this.updateSettings = function (transcoderURL, analyzerURL) {
        settings.transcoderURL = transcoderURL;
        settings.analyzerURL = analyzerURL;
        localStorageService.set("settings",settings);
    };

});