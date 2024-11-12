import React, { useState, useEffect } from 'react';
import Modal from "react-modal";  // Importando o Modal
import '../components/css/Usuario.css';  // Certifique-se de que o caminho esteja correto

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para controlar a abertura do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [advertencia, setAdvertencia] = useState('');  // Para armazenar o texto da advertência

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

  // LocalStorage para registrar as ações
  const registrarAcao = (acao) => {
    const historico = JSON.parse(localStorage.getItem('historico')) || [];
    historico.push(acao);
    localStorage.setItem('historico', JSON.stringify(historico));
  };

  // Função para excluir o usuário
  const handleDelete = async (usuario) => {
    try {
      const response = await fetch(`https://volun-api-eight.vercel.app/usuarios/${usuario._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir o usuário');
      }

      // atualiza para remover um usuario da lista
      setUsuarios((prevUsuarios) =>
        prevUsuarios.filter((u) => u.id !== usuario._id)
      );

      // Registrar a ação de exclusão
      registrarAcao(`Moderador excluiu o usuário: ${usuario.nome}`);
      console.log(`Excluir usuário: ${usuario.nome}`);

    } catch (err) {
      setError(err.message);
      console.error('Erro ao excluir o usuário:', err);
    }
  };

  // Função para abrir o modal 
  const handleAdvertir = (usuario) => {
    setSelectedUsuario(usuario); // Guarda o usuário para poder usá-lo dentro do modal
    setIsModalOpen(true); // Abre o modal
  };

  // Função para aplicar a advertência e fechar o modal
  const handleApplyAdvertencia = () => {
    if (!advertencia) {
      alert('Por favor, insira uma advertência.');// mensagem caso campo esteja vazio
      return;
    }

    // Registrar a ação de advertência
    registrarAcao(`Moderador advertiu o usuário: ${selectedUsuario.nome} com a mensagem: "${advertencia}"`);

    // Fechar o modal
    setIsModalOpen(false);
    setAdvertencia(''); // Limpar o campo 
    console.log(`Advertência aplicada ao usuário: ${selectedUsuario.nome}`);
  };

  
   // Tabela de usuarios
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
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario._id}> 
              <td>{usuario.nome}</td>
              <td>{usuario.sobrenome}</td>
              <td>{usuario.ddd}</td>
              <td>{usuario.telefone}</td>
              <td>{usuario.data_nascimento}</td>
              <td>

                 {/* icones para suspensão e advertencia na tabela */}
                <button
                  onClick={() => handleDelete(usuario)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <img
                    src='src/components/modera/assets/img/image 34.png'
                    alt='Excluir'
                    className='icon'
                    style={{ marginRight: '10px' }}
                  />
                </button>
                <button
                  onClick={() => handleAdvertir(usuario)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <img
                    src='src/components/modera/assets/img/image 33.png'
                    alt='Advertir'
                    className='icon'
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>



      {/* Modal para inserir advertência */}
      <Modal 
        isOpen={isModalOpen} 
        onRequestClose={() => setIsModalOpen(false)} 
        contentLabel="Advertir Usuário"
        ariaHideApp={false}
        className="ReactModal__Content"  //  classe personalizada para o conteúdo do modal
        overlayClassName="ReactModal__Overlay"  //  classe personalizada para o overlay
      >


        <h2>Advertir Usuário: {selectedUsuario?.nome}</h2>
        <textarea 
          value={advertencia} 
          onChange={(e) => setAdvertencia(e.target.value)} 
          placeholder="Digite a advertência aqui..."
          rows="5"
          className="modal-textarea"  //  classe personalizada para a textarea
        />
        
       
        <div className="modal-buttons">
          <button onClick={handleApplyAdvertencia}>Aplicar Advertência</button>
          <button onClick={() => setIsModalOpen(false)}>Cancelar</button>
        </div>
      </Modal>
    </div>
  );
};

export default Usuarios;

