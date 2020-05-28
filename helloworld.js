const grbl11ProxyReducer = require('@jmdevall/jhonny-grbl/lib/reducers/grbl11ProxyReducer');
const reducer=grbl11ProxyReducer.default;
const initialState=grbl11ProxyReducer.initialState;
const actions=grbl11ProxyReducer.actions;


let state=initialState;
console.log(state);

const sendBlockAction=actions.grbl.out.grblOutSend({
    type: 'block',
    payload: 'G0 X0'
})

state=reducer(state,sendBlockAction);
console.log(state);

actions.grbl.out.grblOutSend



//state=reducer(state,)