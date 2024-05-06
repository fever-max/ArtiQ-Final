import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Modal from 'react-modal'; // react-modal import
import { BrowserRouter as Router } from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root'));
Modal.setAppElement('#root');
root.render(
  <Router>
    <App />
  </Router>
);

reportWebVitals();