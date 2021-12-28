const { DEDICATED_COMPRESSOR_3KB, App } = require('uWebSockets.js');

const decoder = new TextDecoder('utf-8');

/* Non-SSL is simply App() */
App()
  .ws('/app', {
    /* There are many common helper features */
    idleTimeout: 30,
    maxBackpressure: 1024,
    maxPayloadLength: 512,
    compression: DEDICATED_COMPRESSOR_3KB,

    /* For brevity we skip the other events (upgrade, open, ping, pong, close) */
    message: (ws, message, isBinary) => {
      try {
        let body = JSON.parse(decoder.decode(message));

        if (body.event === 'ping') {
          ws.send(
            JSON.stringify({ event: body.event, channel: body.channel }),
            isBinary,
            false
          );
        }
      } catch (e) {
        console.error(e);
      }

      /* You can do app.publish('sensors/home/temperature', '22C') kind of pub/sub as well */
      /* Here we echo the message back, using compression if available */
      // let ok = ws.send(message, isBinary, true);
    },
  })
  .get('/*', (res, req) => {
    /* It does Http as well */
    res
      .writeStatus('200 OK')
      .writeHeader('IsExample', 'Yes')
      .end('Hello there!');
  })
  .listen(9001, (listenSocket) => {
    if (listenSocket) {
      console.log('Listening to port 9001');
    }
  });
