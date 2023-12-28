import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App/App';

import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LogIn from './LogIn/LogIn';
import FriendsActivity from './FriendsActivity/FriendsActivity';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter basename="/index.html">
      <Routes>
          <Route index element={<App />} />
          <Route path="login" element={<LogIn/>} />
          <Route path="activity" element={<FriendsActivity />} />
      </Routes>
    </BrowserRouter>
    
  </React.StrictMode>
);