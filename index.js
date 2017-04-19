var FireTv = require('./FireTv.js').server;

var fireTv = new FireTv('192.168.0.23');

fireTv.stream({
    title: 'Test',
    url : 'http://cdn3.streamcloud.eu:8080/hlv74xmoxooax3ptx2jibap36cw6yq7nr4p3va7cqevbftrejfoajzvqji/video.mp4',
    poster: 'http://192.168.0.39:57645/external/video/thumbnails/6744.jpg'
});