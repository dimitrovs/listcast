//This handles retrieving data and is used by controllers. 3 options (server, factory, provider) with 
//each doing the same thing just structuring the functions/data differently.
app.service('channelsService', function($q, $http, localStorageService, settingsService) {
    var videoTranscodeCodec = 'libx264';
    var audioTranscodeCodec = 'libvo_aacenc';
    var channels = localStorageService.get("channels");
    if (channels == null) {
        channels = [];
    }

    var encodeURL = function(url) {
        return encodeURIComponent(url).replace(/'/g, "%27").replace(/"/g, "%22");
    }
    
    var selectStreams = function(channel) {
        if (channel.streams) {
            channel.streams.forEach(function(stream) {
               if (stream.codec_type === 'video' && channel.settings.track1 === -1) {
                   channel.settings.track1 = stream.index;
                   if (stream.codec_name !== 'h264') {
                       channel.settings.videoTranscode = true;
                   }
               } else if (stream.codec_type === 'audio' && channel.settings.track2 === -1) {
                   channel.settings.track2 = stream.index;
                   if (stream.codec_name !== 'aac') {
                       channel.settings.audioTranscode = true;
                   }
               }
            });
        }
    }

    this.getChannels = function() {
        return channels;
    };

    this.insertChannel = function(name, url, thumbnail) {
        var topID = channels.length + 1;
        channel = {
            id: topID,
            name: name,
            url: url,
            settings: {
                videoTranscode: false,
                audioTranscode: false,
                track1: -1,
                track2: -1
            },
            streams: [],
            thumbnail: thumbnail
        };
        channels.push(channel);
        localStorageService.set("channels", channels);
        this.probeChannel(channel);
    };

    this.deleteChannel = function(id) {
        for (var i = channels.length - 1; i >= 0; i--) {
            if (channels[i].id === id) {
                channels.splice(i, 1);
                break;
            }
        }
        localStorageService.set("channels", channels);
    };

    this.getChannel = function(id, format) {
        for (var i = 0; i < channels.length; i++) {
            if (channels[i].id === id) {
                if (channels[i].url.substr(-5)!==".m3u8" && format) {
                    channels[i].transcoder_url = '' +
                        settingsService.getTranscoderURL() +
                        '?url=' + encodeURL(channels[i].url) +
                        '&acodec=' + (channels[i].settings.audioTranscode?audioTranscodeCodec:'copy') +
                        '&vcodec=' + (channels[i].settings.videoTranscode?videoTranscodeCodec:'copy') +
                        '&track1=' + channels[i].settings.track1 +
                        '&track2=' + channels[i].settings.track2 +
                        '&format=' + format;
                }
                return channels[i];
            }
        }
        return null;
    };

    this.updateChannel = function(channel) {
        for (var i = channels.length - 1; i >= 0; i--) {
            if (channels[i].id === channel.id) {
                channels[i] = channel;
                break;
            }
        }
        localStorageService.set("channels", channels);
    }

    this.probeChannel = function(channel) {
        var dfd = $q.defer();
        $http.get(settingsService.getAnalyzerURL() + '?url=' + encodeURL(channel.url)).success(function(result) {
            if (result && result.streams) {
                channel.streams = result.streams;
                selectStreams(channel);
                for (var i = channels.length - 1; i >= 0; i--) {
                    if (channels[i].id === channel.id) {
                        channels[i] = channel;
                        break;
                    }
                }
                localStorageService.set("channels", channels);
                dfd.resolve(channel);
            } else {
                dfd.reject();
            }
        });
        return dfd.promise;
    }

    this.clearChannels = function() {
        channels.length = 0;
        localStorageService.set("channels", channels);
    };

    /*var channels = [
        {
            id: 1, name: 'BBC', url: 'http://bbc.co.uk', thumbnail: 'No Image',
            settings:
                { transcodeVideo: true, transcodeAudio: true, videoStream: 0, audioStream: 1 }
        },
        {
            id: 2, name: 'BBC2', url: 'http://bbc.co.uk', thumbnail: 'No Image',
            settings:
                { transcodeVideo: false, transcodeAudio: true, videoStream: 0, audioStream: 1 }
        },
        {
            id: 3, name: 'RT', url: 'http://bbc.co.uk', thumbnail: 'No Image',
            settings:
                { transcodeVideo: false, transcodeAudio: false, videoStream: 0, audioStream: 2 }
        },
    ];*/

});