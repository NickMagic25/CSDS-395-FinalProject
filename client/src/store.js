import { createStore, applyMiddleware, compose } from "redux";
import combineReducers from "./reducers/rootReducer";
import thunk from "redux-thunk";
const initialState = {};
const middleware = [thunk];
const store = createStore(
  combineReducers,
  initialState,
  compose(
    applyMiddleware(...middleware)
  )
);
export default store;