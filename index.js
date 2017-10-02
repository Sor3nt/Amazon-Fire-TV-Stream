

/**
 * Amazon Fire TV Discovery and Socket Connection Interface
 * Feel free to spend me a beer for this work <paypal:sor3nt@gmail.com>, thank you!
 */


var FireTvDns = require('./FireTvDns.js').server;
var FireTv = require('./FireTv.js').server;

new FireTvDns({
    found : function (device) {
        console.log("Found Device ", device);

        var fireTv = new FireTv(device.target, device.port);

        fireTv.stream({
            title: 'Test',
            url : 'http://cdn3.streamcloud.eu:8080/hlv74xmoxooax3ptx2jibap36cw6yq7nr4p3va7cqevbftrejfoajzvqji/video.mp4',
            poster: 'http://192.168.0.39:57645/external/video/thumbnails/6744.jpg'
        });
    }
});
