
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


Lets start coding helloworld.js:

jhonny grbl is simple a state machine where we maintain the insternal state of the proxy. The proxy is the element between grbl and the host
We can ignore the host side and send commands directly to de grbl side

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

