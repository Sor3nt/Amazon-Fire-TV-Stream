
var packet = require('dns-packet');
var dgram = require("dgram");


/**
 * Amazon Fire TV Discovery Service using mdns
 * Feel free to spend me a beer for this work <paypal:sor3nt@gmail.com>, thank you!
 *
 * A simple Node.js Module that allows to find Fire TV devices.
 *
 * Usage:
 * new FireTvDns({
 *    found : function (device) {
 *        console.log("Found Device ", device);
 *    }
 * });
 */
module.exports.server = function( opt ){

    var self = {

        _client : false,

        _init : function () {

            self._client = dgram.createSocket({
                type: 'udp4',
                reuseAddr: true
            });

            self._createEvents();

            self._client.bind(5353);

        },

        _createEvents: function () {
            self._client.on('listening', self._onListening);
            self._client.on('message', self._onMessage);
        },

        _onListening: function () {
            console.log("listening on ", self._client.address().address);

            self._client.addMembership('224.0.0.251', undefined);
            self._client.setMulticastTTL(255);
            self._client.setMulticastLoopback(true);

            var payload = packet.encode({
                questions: [{
                    name: '_amzn-wplay._tcp.local',
                    type: 'SRV',
                    class: 1
                }]
            });

            //we need to change the question mode from QM to QU
            //i think we can adjust this by the given 'class' attribute... any ideas ?
            payload = self._changeToQuMode(payload);

            self._send(payload);
        },

        _onMessage: function (message, rinfo) {
            message = packet.decode(message);

            //we only process responses...
            if (message.type !== "response") return true;

            message.answers.forEach(function (answer) {

                //we only process amazon devices
                if (answer.name.indexOf('amzn.dmgr:') === -1) return;

                if (answer.type === 'SRV'){

                    opt.found({
                        target: answer.data.target,
                        port: answer.data.port
                    });
                }

            });
        },

        _changeToQuMode: function (payload) {
            var hex = payload.toString('hex');
            hex = hex.substr(0, hex.length - 4);
            hex = hex + '8001';
            return Buffer.from(hex, 'hex');
        },

        _send : function ( payload ) {
            console.log("Send payload: ", payload );

            self._client.send(payload, 0, payload.length, 5353, '224.0.0.251', function (err, bytes) {
                if (!err) console.log('Payload submitted');
            });
        }

    };

    self._init();

};
