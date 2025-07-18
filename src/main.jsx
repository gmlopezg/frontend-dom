import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faHome,
  faSignOutAlt,
  faExclamationTriangle,
  faCheckCircle,
  faClock,
  faMapMarkerAlt,
  faChartLine,
  faListAlt,
  faUserPlus,
  faUsers,
  faUserEdit
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faHome,
  faSignOutAlt,
  faExclamationTriangle,
  faCheckCircle,
  faClock,
  faMapMarkerAlt,
  faChartLine,
  faListAlt,
  faUserPlus,
  faUsers,
  faUserEdit
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> 
      <App />
    </BrowserRouter>
  </StrictMode>,
)
