import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import Cadastrar from './components/Cadastrar.jsx'
import DadosPessoal from './components/DadosPessoal.jsx'
import DadosEndereco from './components/DadosEndereco.jsx'
import Usuario from './components/Usuario.jsx'
import Eventos from './components/Eventos.jsx'
import DetalhesEventos from './components/DetalhesEventos.jsx'
import CriacaoEventos from './components/CriacaoEvento.jsx'
import Cardong from './components/Cardong.jsx'
import Footer from './components/Footer.jsx'
import NavBar from './components/Navbar.jsx'
import Ongpage from './components/Ongpage.jsx'

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render (
  <React.StrictMode>
    <Router>
      <Routes>

        <Route path='/'                             element= {<><NavBar/> <App />             <Footer/></>}/>
        <Route path='/usuario'                      element= {<><NavBar/> <Usuario />         <Footer/></>}/>
        <Route path='/ong'                          element= {<><NavBar/> <Ongpage />         <Footer/></>}/>
        <Route path='/eventos'                      element= {<><NavBar/> <Eventos />         <Footer/></>}/>
        <Route path='/detalhes_eventos/:id'         element= {<><NavBar/> <DetalhesEventos /> <Footer/></>}/>
        <Route path='/criacao_eventos/:ongId'       element= {<><NavBar/> <CriacaoEventos />  <Footer/></>}/>
        <Route path='/cadastrar'                    element= {<Cadastrar />}/>
        <Route path='/dados_pessoal'                element= {<DadosPessoal /> }/>
        <Route path='/dados_endereco'               element= {<DadosEndereco />}/>
        <Route path='/cardong'                      element= {<Cardong/>}/>
        

      </Routes>
    </Router>
  </React.StrictMode>
);

