import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './i18n';
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import data from './paletten.json'
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App paletten={data.paletten}/>
    </BrowserRouter>
  </StrictMode>,
)
