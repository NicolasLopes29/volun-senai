import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import Cadastrar from './components/Cadastrar'
import Eventos from './components/Eventos'

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render (
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/' element={<App />}/>
        {/* <Route path='/cadastrar' element={<Cadastrar />}/> */}
        <Route path='/components/Eventos.jsx' element={<Eventos />}/>
      </Routes>
    </Router>
  </React.StrictMode>
);
