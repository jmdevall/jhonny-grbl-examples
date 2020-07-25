const grbl11ProxyReducer = require('@jmdevall/jhonny-grbl/lib/reducers/grbl11ProxyReducer');
const reducer=grbl11ProxyReducer.default;
const initialState=grbl11ProxyReducer.initialState;
const actions=grbl11ProxyReducer.actions;
const redux=require("redux");

const sendBlockAction = actions.grbl.out.grblOutSend({
    type: 'block',
    payload: 'G0 X0'
})

let store=redux.createStore(reducer,initialState);
console.log(store.getState());

let stateChanged=function(){
    console.log("state changed");
    console.log(store.getState());
}
store.subscribe(stateChanged)
store.dispatch(sendBlockAction);
