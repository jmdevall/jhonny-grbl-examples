const grbl11ProxyReducer = require('@jmdevall/jhonny-grbl/lib/reducers/grbl11ProxyReducer');
const reducer=grbl11ProxyReducer.default;
const initialState=grbl11ProxyReducer.initialState;
const actions=grbl11ProxyReducer.actions;
//const SerialPort = require('serialport');


//let state=initialState;
//console.log(state);

const sendBlockAction=actions.grbl.out.grblOutSend({
    type: 'block',
    payload: 'G0 X0'
})

//state=reducer(state,sendBlockAction);
//console.log(state);

actions.grbl.out.grblOutSend;


const createStore = require('redux').createStore
const store=createStore(reducer,initialState);

const listener=function(){
    console.log(store.getState());
}

const unsubscribe=store.subscribe(listener);
store.dispatch(sendBlockAction);

/*
const serialPortPath="/dev/ttyACM0";
const port = new SerialPort(serialPortPath, { baudRate: 115200 })

// Open errors will be emitted as an error event
port.on('error', function(err) {
    console.log('Error: ', err.message)
});

port.on('open', function() {
    console.log('port open correctly');   
});
  
port.on('data', function (data) {
    console.log('Data:', data.toString());
   // console.log(data.toString());
   // port.write(Buffer.from('G0 X2'));
});

*/

//state=reducer(state,)