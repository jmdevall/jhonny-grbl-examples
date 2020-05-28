
Lets start coding helloworld.js:

first we import grbl11ProxyReducer and print initialState:

```
const grbl11ProxyReducer = require('@jmdevall/jhonny-grbl/lib/reducers/grbl11ProxyReducer');
const reducer=grbl11ProxyReducer.default;
const initialState=grbl11ProxyReducer.initialState;

let state=initialState;
console.log(state);
```

proxy is an element that is positioned between the host and the grbl side.

the proxy has an state that is the state of all 4 ports. We must plug callbacks that dispatch new redux actions that update the state. Redux will notify us when the state changed.
We check the state and invoke I/O operations and update the state.

The program print in console the initial state of the proxy:
```
>node helloworld.js
{
  host: {
    in: { buffer: <Buffer >, blocks: [], rtcs: [], lastId: 0 },
    out: { buffer: <Buffer > }
  },
  grbl: {
    in: { buffer: <Buffer >, grblResponses: [], lastId: 0 },
    out: { buffer: <Buffer > }
  }
}
```


host side, is the side connected to a remote program that interacts with grbl (gcode sender bCNC, etc)
grbl side, is the side connected to the real grbl.

lets center in grbl side only. We are controlling directly de grbl port so we are going to ignore the host side by the moment.

We are going to use the grbl.out port to "send out" requests to the grbl connected to the grbl side of the proxy.


the proxy module exports an object with all possible redux actions 
```
const actions=grbl11ProxyReducer.actions; 
```

we are able to send to type of actions to grbl out port:
grblOutSend: we send new request to grbl. The action creator need a message to send. It may be a rtc "real time command" message or a "block message"

let rtcMessage={
  type: 'rtc'
  payload: number 
}

let blockMessage={
  type: 'block',
  payload: 'G0 X0'
}

 spetial character code in ascii used. In grbl11 possible values of rtc codes is exported in 

```
{
  host: {
    in: { buffer: <Buffer >, blocks: [], rtcs: [], lastId: 0 },
    out: { buffer: <Buffer > }
  },
  grbl: {
    in: { buffer: <Buffer >, grblResponses: [], lastId: 0 },
    out: { buffer: <Buffer 47 30 20 58 30 0d 0a> }
  }
}

```

