# Amazon Fire Tv for Node.js
A simple NodeJs Module that allows to stream a video to any Fire TV device.

## How to use:

Include the library:
```
var FireTv = require('./FireTv.js').server;

```

Create a FireTv instance
```
var fireTv = new FireTv('192.168.0.23');
```

Start the Stream
```
fireTv.stream({
    title: 'Test',
    url : 'http://dl2.mihanpix.com/Film/2016/Barbershop.The.Next.Cut.2016.720p.Ozlem.mp4',
    poster: 'http://192.168.0.39:57645/external/video/thumbnails/6744.jpg'
});
```

## WARNING! Magic Socket Port
  
We use in this library the Port `41700` for the communication but it can always happend that you have a different Port.

If your connection failed, try to load the BubbleUPnP App for Android and then Sniff the Traffic. Look around for /whisperlink .

Please provide any suggestion how we can detect the right Port.
