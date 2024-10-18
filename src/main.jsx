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
import Eventos from './components/Eventos.jsx'
import DetalhesEventos from './components/DetalhesEventos.jsx'
import Footer from './components/Footer.jsx'
import Navbar from './components/Navbar.jsx'

const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

// Layout sem Navbar e Footer
const NoMainLayout = ({ children }) => {
  return (
    <>
      {children}
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render (
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/' element={<MainLayout><App /></MainLayout>}/>
        <Route path='/cadastrar' element={<NoMainLayout><Cadastrar /></NoMainLayout>}/>
        <Route path='/dados_pessoal' element={<NoMainLayout><DadosPessoal /></NoMainLayout>}/>
        <Route path='/dados_endereco' element={<NoMainLayout><DadosEndereco /></NoMainLayout>}/>
        <Route path='/usuario' element={<MainLayout><Usuario /></MainLayout>}/>
        <Route path='/eventos' element={<MainLayout><Eventos /></MainLayout>}/>
        <Route path='/detalhes_eventos' element={<MainLayout><DetalhesEventos /></MainLayout>}/>
        <Route path='/modera' element= {<MainLayout><Appmod/></MainLayout>}/>
      </Routes>
    </Router>
  </React.StrictMode>
);
