# Amazon Fire TV for Node.js
A simple Node.js Module that allows to stream a video to any Fire TV device.

 Feel free to spend me a beer for this work over Paypal sor3nt@gmail.com, thank you!

## How to use the FireTv Streamer:

Include the library:
```
var FireTv = require('./FireTv.js').server;

```

Create a new instance
```
var fireTv = new FireTv('192.168.0.23', 12345);
```

Start the Stream
```
fireTv.stream({
    title: 'Test',
    url : 'http://dl2.mihanpix.com/Film/2016/Barbershop.The.Next.Cut.2016.720p.Ozlem.mp4',
    poster: 'http://192.168.0.39:57645/external/video/thumbnails/6744.jpg'
});
```

## How to use the FireTv Discovery:

Include the library:
```
var FireTvDns = require('./FireTvDns.js').server;

```

Create a new instance
```
 new FireTvDns({
    found : function (device) {
        console.log("Found Device ", device);
    }
 });
```

## Special thanks to
[tmm1](https://github.com/tmm1) for helping to discover the amazon device ip and port!

