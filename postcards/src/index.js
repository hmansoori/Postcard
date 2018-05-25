import React from 'react';
import ReactDOM from 'react-dom';
import { unregister } from './registerServiceWorker';
import App from './components/App'; //import our component

//load our CSS file
import styles from './components/index.css';

//unregister service worker (conflicts with firebase on chrome)
unregister();

//render the Application view
ReactDOM.render((
 <App />),
  document.getElementById('root')
);

