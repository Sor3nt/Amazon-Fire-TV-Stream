# Amazon Fire TV for Node.js
A simple Node.js Module that allows to stream a video to any Fire TV device.

 Feel free to spend me a beer for this work over Paypal sor3nt@gmail.com, thank you!

## How to use:

Include the library:
```
var FireTv = require('./FireTv.js').server;

```

Create a Fire TV instance
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

## Information! Magic socket port
  
I use in this library the Port `41700` for the communication but it can always happend that you have a different port.

If your connection failed, try to load the BubbleUPnP App and then Sniff the traffic. Look around for /whisperlink and pick up the port from this request.

Please provide any suggestion how we can detect the right Port.

