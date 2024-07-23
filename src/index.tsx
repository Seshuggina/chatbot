import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import FlowDiagram from './FlowDiagram';
import 'reactjs-popup/dist/index.css';
import './styles/tailwind.css';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <h3 className='text-center'>Data Flow Diagram</h3>
    <FlowDiagram/>
  </React.StrictMode>
);
