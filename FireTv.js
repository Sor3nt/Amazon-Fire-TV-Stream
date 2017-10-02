
var net = require('net');


/**
 * Amazon Fire TV Socket Connection Interface
 * Feel free to spend me a beer for this work <paypal:sor3nt@gmail.com>, thank you!
 *
 * A simple Node.js Module that allows to stream a video to any Fire TV device.
 *
 * Usage:
 *
 * var FireTv = require('./FireTv.js').server;
 * var fireTv = new FireTv('192.168.0.23');
 * fireTv.stream({
 *  title: 'Test',
 *  url : 'http://dl2.mihanpix.com/Film/2016/Barbershop.The.Next.Cut.2016.720p.Ozlem.mp4',
 *  poster: 'http://192.168.0.39:57645/external/video/thumbnails/6744.jpg'
 * });
 */
module.exports.server = function( fireTvIp, fireTvPort ){

    var self = {

        _client: false,

        // some fake informations, based on the BubbleUPnP
        _fakeDevice: {
            uuid: '9FE46B7B99429F6C74709C06CF07D21B',
            svcHash: 'S/FRy5cPXE'
        },

        // the module state, possible values are 'idle, connected, error, closed'
        _state : 'idle',

        // in the case the connection is not open yet, save the playback request
        _callbackStack: [],

        _init: function () {
            self._connectToDevice( fireTvIp, fireTvPort );
        },

        _connectToDevice: function( ip, port ){
            self._client = new net.Socket();
            self._client.connect(port, ip, function() {
                console.log('[FireTv] Connecting...');
                self._sendHello();
            });

            self._client.on('data', function(dataRaw) {
                var data = dataRaw.toString();

                // the connection is accepted
                if (data.indexOf('HTTP/1.0 200 OK') !== -1){
                    console.log('[FireTv] Connected!');
                    self._state = 'connected';

                    if (self._callbackStack.length){
                        do{
                            self._callbackStack.shift()();
                        }while(self._callbackStack.length);

                        self._client.end();
                    }
                }
            });

            self._client.on('error', function() {
                self._state = 'error';
                console.log('[FireTv] Error');
            });

            self._client.on('close', function() {
                self._state = 'closed';
                console.log('[FireTv] Connection closed');
            });
        },

        _sendHello: function () {

            var init =
                "POST /whisperlink HTTP/1.0\r\n" +
                "x-amzn-dev-uuid:" + self._fakeDevice.uuid + "\r\n" +
                "x-amzn-dev-name:\r\n" +
                "x-amzn-dev-type:0\r\n" +
                "x-amzn-dev-version:0\r\n" +
                "x-amzn-svc-uuid:amzn.thin.pl\r\n" +
                "x-amzn-svc-version:0\r\n" +
                "x-amzn-channel:inet\r\n" +
                "x-amzn-connection-id:6916\r\n" +
                "x-amzn-connection-version:0\r\n" +
                "x-amzn-connection-metadata:{\"unsecurePort\":46638,\"securePort\":0}\r\n" +
                "x-amzn-svc-hash:" + self._fakeDevice.svcHash + "\r\n" +
                "\r\n";

            self._client.write(new Buffer(init));
        },

        _sendVideoRequest: function ( options ) {
            console.log('[FireTv] Send Video...');

            var description = JSON.stringify({
                "description": "",
                "noreplay": true,
                "poster": options.poster,
                "title": options.title,
                "type": "video/mp4"
            });

            var manufacturer = JSON.stringify({
                "Manufacturer": "Google",
                "DeviceModel": "Pixel",
                "OSVersion": "Android-7.1.1",
                "PackageName": "Android-com.bubblesoft.android.bubbleupnp",
                "FlingSDKVersion": "Android-1.3.0",
                "Uuid": self._fakeDevice.uuid
            });

            var request = new Buffer(
                '800100010000000E' +                        // base header
                '7365744D65646961536F75726365' +            // setMediaSource (command)
                '000000010B0001000000' +                    // unknown code
                options.url.length.toString(16) +           // movie url length
                new Buffer(options.url).toString('hex') +   // movie url
                '0B0002000000' +                            // unknown code
                description.length.toString(16) +           // description length
                new Buffer(description).toString('hex') +   // description obj
                '02000301020004000B0005000000' +            // unknown code
                manufacturer.length.toString(16) +          // manufacturer length
                new Buffer(manufacturer).toString('hex') +  // manufacturer obj
                '00'                                        // end of command ?
            , "hex");

            self._client.write(new Buffer(request, "hex"));
        },

        stream: function ( options ) {
            if (self._state === 'connected'){
                self._sendVideoRequest( options );
                self._client.end();
            }else if( self._state !== 'error' && self._state !== 'closed'){
                self._callbackStack.push(function () {
                    self._sendVideoRequest( options );
                });
            }else{
                console.log('[FireTv] Not Connected, current state is ' + self._state);
            }
        }
    };

    self._init();

    return {
        stream: self.stream
    };
};
