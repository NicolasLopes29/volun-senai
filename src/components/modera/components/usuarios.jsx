import React, { useState, useEffect } from 'react';
import '../components/css/Usuario.css';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch('https://volun-api-eight.vercel.app/usuarios/');
        if (!response.ok) {
          throw new Error('Erro ao buscar os usuários');
        }
        const data = await response.json();
        setUsuarios(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <div className='lista-usuario'>
      <h1>Página de Usuários</h1>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Sobrenome</th>
            <th>DDD</th>
            <th>Telefone</th>
            <th>Data de Nascimento</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.nome}>
              <td>{usuario.nome}</td>
              <td>{usuario.sobrenome}</td>
              <td>{usuario.ddd}</td>
              <td>{usuario.telefone}</td>
              <td>{usuario.data_nascimento}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Usuarios;

