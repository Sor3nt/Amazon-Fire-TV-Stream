var FireTv = require('./FireTv.js').server;

var fireTv = new FireTv('192.168.0.23');

fireTv.stream({
    title: 'Test',
    url : 'http://dl2.mihanpix.com/Film/2016/Barbershop.The.Next.Cut.2016.720p.Ozlem.mp4',
    poster: 'http://192.168.0.39:57645/external/video/thumbnails/6744.jpg'
});