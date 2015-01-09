//This handles retrieving data and is used by controllers. 3 options (server, factory, provider) with 
//each doing the same thing just structuring the functions/data differently.
app.service('castService', function($q) {
    /**
     * Cast initialization timer delay
     **/
    var CAST_API_INITIALIZATION_DELAY = 1000;
    /**
     * Session idle time out in miliseconds
     **/
    var SESSION_IDLE_TIMEOUT = 300000;

    /**
     * global variables
     */
    var currentMediaSession = null;
    var session = null;
    var initialized = false;
    /**
     * session listener during initialization
     * @param {Object} e session object
     * @this sessionListener
     */
    function sessionListener(e) {
        console.log('New session ID: ' + e.sessionId);
        session = e;
    }

    /**
     * session update listener
     * @param {boolean} isAlive status from callback
     * @this sessionUpdateListener
     */
    function sessionUpdateListener(isAlive) {
        if (!isAlive) {
            session = null;
        }
    }

    /**
     * receiver listener during initialization
     * @param {string} e status string from callback
     */
    function receiverListener(e) {
        if (e === 'available') {
            console.log('receiver found');
        }
        else {
            console.log('receiver list empty');
        }
    }

    /**
     * callback for media status event
     * @param {boolean} isAlive status from callback
     */
    function onMediaStatusUpdate(isAlive) {
        if (!isAlive) {
            console.log(isAlive);
        }
        console.log(currentMediaSession.playerState);
    }
    
    this.isReady = function() {
        return session !== null;
    }

    /**
     * initialization
     */
    this.initializeCastApi = function() {
        var dfd = $q.defer();

        // default app ID to the default media receiver app
        // optional: you may change it to your own app ID/receiver
        var applicationIDs = [
            chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
        ];


        // auto join policy can be one of the following three
        // 1) no auto join
        // 2) same appID, same URL, same tab
        // 3) same appID and same origin URL
        var autoJoinPolicyArray = [
            chrome.cast.AutoJoinPolicy.PAGE_SCOPED,
            chrome.cast.AutoJoinPolicy.TAB_AND_ORIGIN_SCOPED,
            chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
        ];

        // request session
        var sessionRequest = new chrome.cast.SessionRequest(applicationIDs[0]);
        var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
            sessionListener,
            receiverListener,
            autoJoinPolicyArray[1]);

        chrome.cast.initialize(apiConfig, function() {
            dfd.resolve("Initialized.");
            initialized = true;
        }, function() {
            dfd.reject("Error Initializing.");
        });

        return dfd.promise;
    }

    /**
     * launch app and request session
     */
    this.launchApp = function() {
        var dfd = $q.defer();
        if (!initialized) {
            this.initializeCastApi().then(function() {
                chrome.cast.requestSession(function(e) {
                    console.log('session success: ' + e.sessionId);
                    session = e;
                    dfd.resolve(e);
                }, function(e) {
                    dfd.reject(e);
                });
            })
        }
        else {
            chrome.cast.requestSession(function(e) {
                console.log('session success: ' + e.sessionId);
                session = e;
                dfd.resolve(e);
            }, function(e) {
                dfd.reject(e);
            });
        }

        return dfd.promise;
    }

    /**
     * stop app/session
     */
    this.stopApp = function() {
        var dfd = $q.defer();

        session.stop(function() {
            dfd.resolve("Stopped.");
        }, function(e) {
            dfd.reject(e);
        });

        return dfd.promise;
    }

    /**
     * load media
     * @param {string} mediaURL media URL string
     * @this loadMedia
     */
    this.loadMedia = function(channel) {
        var dfd = $q.defer();

        if (!session) {
            console.log('no session');
            dfd.reject('no session');
        }
        else {

            var mediaInfo = new chrome.cast.media.MediaInfo(channel.transcoder_url);

            mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
            mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.GENERIC;
            mediaInfo.contentType = 'video/x-matroska';
            mediaInfo.streamType = chrome.cast.media.StreamType.LIVE;
            mediaInfo.metadata.title = channel.name;
            mediaInfo.metadata.images = [{
                'url': channel.thumbnail
            }];

            var request = new chrome.cast.media.LoadRequest(mediaInfo);
            request.autoplay = true;

            session.loadMedia(request,
                function(result) {
                    currentMediaSession = result;
                    dfd.resolve(currentMediaSession.playerState);
                },
                function(error) {
                    dfd.reject(error);
                });
        }
        return dfd.promise;
    }

    /**
     * get media status initiated by sender when necessary
     * currentMediaSession gets updated
     * @this getMediaStatus
     */
    this.getMediaStatus = function() {
        var dfd = $q.defer();

        if (!session || !currentMediaSession) {
            dfd.resolve('Stopped.');
        }
        else {
            currentMediaSession.getStatus(null,
                function() {
                    dfd.resolve(currentMediaSession.playerState);
                },
                function(error) {
                    dfd.reject(error);
                });
        }

        return dfd.promise;
    }

});