
prerequisites:

- Basic knowlegde of arduino and programming. There are several tutorials, books etc over there, for example: https://www.arduino.cc/en/Guide/HomePage You must be able to install programms on the board, be fammiliar with simple sensors, leds, etc, read/write ports, PWM, serial communication with the host, etc.
- mid knowlegde of grbl: https://github.com/gnea/grbl you must be able to install grbl in arduino UNO, last version of grbl at the moment is grbl1.1. You must be able to send commands to it via serial port, do basic configuration etc. You must be able to connect of stepper mottors in real and get moving. Basic Knowledge of GCode https://en.wikipedia.org/wiki/G-code , and general CNC machines.
- Basic knwolegde of bCNC: https://github.com/vlachoudis/bCNC . you must be able to install bCNC and operate it. Connect bCNC to grbl via usb and operate.
- Mid knwoledge javascript in server side: https://www.w3schools.com/nodejs/ and typescript https://www.typescriptlang.org/docs/home.html for understanding of interals of jhonny-grbl code.
- Mid knowledge of redux: https://redux.js.org/ the javascript state/action framework based on.

Hardware necesary:

- 1 arduino uno board, prefferible grbl shield for more easy connection of .
- 3 step motors to check moving for real.
- test board for prototiping.
- multimeter for testing voltages
- end of limit switch for prototiping
- 1 additional arduino, UNO, or mega for testing addtional external I/Os

Hello Tutorial
In this tutorial we will introduce the use of jhonny-grbl by example, step by step. In Each of this steps we will add some logic to the previous step. The final code of each step is in tutorial/hellogrbl-xx.js

Step 01: import jhonny-grbl proxy and test simple action.
=================================================================

Lets start coding tutorial/hellogrbl-01.js:

jhonny grbl is simply a state machine where we maintain the internal state of the proxy. The proxy is the element between grbl board and the host
by the moment, we'l ignore the host side and send commands directly to de grbl side.

First we import grbl11ProxyReducer and print initialState:

```
const grbl11ProxyReducer = require('@jmdevall/jhonny-grbl/lib/reducers/grbl11ProxyReducer');
const reducer=grbl11ProxyReducer.default;
const initialState=grbl11ProxyReducer.initialState;

let state=initialState;
console.log(state);
```

This program prints to console the initial state of the proxy:

```
>node tutorial/hellogrbl-01.js
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

The host and grbl uses a request-response protocol. There is 2 type of request messages: block messages and rtc messages(real time command messages)

The proxy is in between half. It maintain a state that is the state of all its 4 ports: host.in, host.out, grbl.in, grbl.out. lets explain each of them:
host.in: the host send to us, (the proxy), commands to operate grbl in raw bytes. In this port we have:
  buffer: the bytearray buffer of pending bytes that still do not conform a complete request message ready to be parsed. 
  blocks: list of completed parsed "block messages" ready to be processed.
  rtcs: list of parsed "real time command messages" ready to be processed.
  lastId: each incomming message received in this port is assigned an unique id so that you can refer to it when you want to delete
host.out: we (the proxy), send response messages to the host
  buffer: in this bytearray we have the pending bytes to send to de host in response to commands
grbl.in: we  (the proxy), receive response messages from grbl
  buffer: the bytearray buffer of pending bytes that still do not conform a complete response ready to be parsed.
  grblResponses: array of parsed responses ready to be processed
  lastId: each incomming message received  in this port is assigned an unique id so that you can refer to it when you want to delete
grbl.out: we (the proxy), send request to grbl to this port
  buffer: in this bytearray we have the pending bytes to send to grbl host of request commands.

Initially there is no bytes and messagges pending to send to ports or received from outside.
If we invoke reducer with an action, we obtain the new state that is the raw bytes to send to grbl. We create an action "sendBlockAction", and let apply it to the reducer, then we obtain the new state:

```
const sendBlockAction=actions.grbl.out.grblOutSend({
    type: 'block',
    payload: 'G0 X0'
})

const newstate=reducer(state,sendBlockAction);
console.log(newstate);
```

```
>node tutorial/hellogrbl-01.js
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

in newstate.grbl.out we have the byte array buffer in the grbl.out port of the proxy, ready to send to grbl.

Step 02: introduce redux
======================== 

In this step instead of execute reducer directly, we will introduce redux to create a store that manages the state, and let create a listener to be notified by the store when the state changed

first we install redux:

npm install redux

import redux:
```
const redux=require("redux");
```

Create a store with the reducer and let the store manage de state. Whenever the state changes it notify us in the function

```
let store=redux.createStore(reducer,initialState);
console.log(store.getState());
```

We must plug a callback and dispatch new action that update the state. Redux will notify us when the state changed.

```
let stateChanged=function(){
    console.log("state changed");
    console.log(store.getState());
}
store.subscribe(stateChanged)
store.dispatch(sendBlockAction);
```

>node tutorial/hellogrbl-02.js
executing this we will obtain result similar to step 01

Step 03: plug physically grbl board
===================================

We check the state and invoke I/O operations and update the state.




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

npm install redux

var createStore = require('redux').createStore

