import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-virtualized/styles.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { 
  BrowserRouter as Router,
  Route
} from 'react-router-dom';


ReactDOM.render(
  <Router basename={process.env.PUBLIC_URL}>
    <Route exact={true} component={App} />
  </Router>,
  document.getElementById('root')
);
registerServiceWorker();
