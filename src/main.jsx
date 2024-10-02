import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import Cadastrar from './components/Cadastrar.jsx'
import DadosPessoal from './components/DadosPessoal.jsx'
import DadosEndereco from './components/DadosEndereco.jsx'
import Appmod from './components/modera/Appmode.jsx' 
import Usuario from './components/Usuario.jsx'
import Cardong from './components/Cardong.jsx'
import Eventos from './components/Eventos.jsx'

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render (
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/' element={<App />}/>
        <Route path='/cadastrar' element={<Cadastrar />}/>
        <Route path='/dados_pessoal' element={<DadosPessoal />}/>
        <Route path='/dados_endereco' element={<DadosEndereco />}/>
        <Route path='/usuario' element={<Usuario />}/>
        <Route path='/organizacao' element={<Cardong/>}/>
        <Route path='/eventos' element={<Eventos/>}/>
        
        <Route path='/modera' element= {<Appmod/>}/>
      </Routes>
    </Router>
  </React.StrictMode>
);
