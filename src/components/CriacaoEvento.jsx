import React, { useState } from "react";
import axios from "axios";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./../css/CriacaoEventos.css";
import { useParams, useNavigate } from "react-router-dom";
import calendario from "./../assets/images/calendario.svg";
import pessoas from "./../assets/images/icon-pessoas.svg";
import correto from "./../assets/images/icon-correto.svg";
import cancela from "./../assets/images/icon-cancela.svg";

const CriacaoEventos = () => { 
    const { ongId } = useParams(); // Extrai o ID da ONG da rot4
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        titulo: "",
        descricao: "",
        descricao_2: "",
        data_inicio: "",
        data_fim: "",
        vaga_limite: "",
        imagem: "",
    });
    const [enderecoDados, setEnderecoDados] = useState({
        cep: "",
        numero: "",
        logradouro: "",
        bairro: "",
        cidade: "",
        estado: "",
    });
    const predefinedTags = [
        "Educação", "Saúde", "Social", "Meio Ambiente", "Cultura", "Arte", "Esporte",
        "Lazer", "Alimentação", "Animais", "Assistência Social", "Música", "Cooperativo",
        "Tecnologia", "Apoio Psicológico", "Reciclagem", "Eventos Religiosos",
        "Treinamentos", "Inclusão Digital", "Capacitação", "Empreendedorismo",
        "Eventos Infantis", "Moradia", "Resgate", "Acessibilidade", "Combate à Fome",
        "Bem-Estar", "Direitos Humanos", "Reforma de Espaços", "Defesa Civil",
        "Combate à Violência", "Saúde Mental", "Outros", "Governamental", "Doação",
        "Urbano", "Rural"
      ];

    const [imagemFile, setImagemFile] = useState(null);
    const [previewImage, setPreviewImage] = useState("");
    const [tags, setTags] = useState([]);
    const [showTags, setShowTags] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

  // Adicionar ou remover tags predefinidas
  const toggleTag = (tag) => {
    if (tags.includes(tag)) {
      setTags((prevTags) => prevTags.filter((t) => t !== tag));
    } else if (tags.length < 5) {
      setTags((prevTags) => [...prevTags, tag]);
    }
  };

  const handleToggleTagsVisibility = () => {
    setShowTags(!showTags);
  };


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImagemFile(file);
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => setPreviewImage(reader.result);
          reader.readAsDataURL(file);
        }
      };

    const handleEnderecoChange = (e) => {
        const { name, value } = e.target;
        setEnderecoDados((prevData) => ({ ...prevData, [name]: value }));
    };

    const buscarCEP = async (e) => {
        e.preventDefault();
        const cep = enderecoDados.cep.replace(/\D/g, "");
        if (cep.length >= 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();

                if (!data.erro) {
                    setEnderecoDados({
                        ...enderecoDados,
                        logradouro: data.logradouro,
                        bairro: data.bairro,
                        cidade: data.localidade,
                        estado: data.uf,
                    });
                } else {
                    alert("CEP não encontrado.");
                }
            } catch (error) {
                alert("Erro ao buscar CEP. Tente novamente.");
            }
        } else {
            alert("CEP inválido.");
        }
    };

    const handleSubmit = async () => {
        try {
            console.log("Formulário enviado:", formData);
            let imagemUrl = "";
            let enderecoId = "";
    
            // Upload da imagem para o Firebase Storage
            if (imagemFile) {
                const storage = getStorage();
                const storageRef = ref(storage, `eventos/${imagemFile.name}`);
                await uploadBytes(storageRef, imagemFile);
                imagemUrl = await getDownloadURL(storageRef);
            }
    
            // Criação do endereço e captura do ID
            const enderecoResponse = await axios.post("https://volun-api-eight.vercel.app/endereco", enderecoDados);
            console.log("Resposta da API de endereço:", enderecoResponse.data);
    
            if (enderecoResponse.data.endereco?._id) {
                enderecoId = enderecoResponse.data.endereco._id;
            } else {
                throw new Error("ID do endereço não retornado.");
            }
    
            // Preparação e envio dos dados do evento
            const eventoData = {
                ...formData,
                imagem: imagemUrl,
                ong_id: ongId,
                endereco_id: enderecoId,
                tags,
            };
    
            const response = await axios.post("https://volun-api-eight.vercel.app/eventos/", eventoData);
            setShowModal(true);
        } catch (error) {
            console.error("Erro ao criar evento ou endereço:", error.response?.data || error.message);
            alert("Erro ao criar evento ou endereço. Por favor, tente novamente.");
        }
    };

    const closeModal = () => {
        setShowModal(false);
        navigate("/ong"); // Navega para a página /ong
      };
    
    
    return (
        <>
            <div className="pega-tudo2">
                <div className="titulo-criacao">
                    <h1>Novo Evento+</h1>
                </div>

                <div className="toda-pagina2">
                    <div className="primera-parte">
                        <p className="nome-bonito">Digite o nome do evento</p>
                        <input
                            placeholder="Nome do evento"
                            className="nome-evento"
                            name="titulo"
                            value={formData.titulo}
                            onChange={handleChange}
                        ></input>
                        <div className="tags-container">
                        <label htmlFor="tags-dropdown" className="tags-label">Selecione as tags do evento (máx. 5)</label>
                        <div className="tags-dropdown" id="tags-dropdown">
                            <div className="tags-dropdown-header" onClick={handleToggleTagsVisibility}>
                            <span>{tags.length > 0 ? `Tags selecionadas: ${tags.length}` : "Clique para selecionar tags"}</span>
                            <svg className={`dropdown-arrow ${showTags ? 'open' : ''}`} width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            </div>
                            {showTags && (
                            <div className="tags-dropdown-content">
                                <div className="selected-tags">
                                {tags.map((tag) => (
                                    <span key={tag} className="selected-tag">
                                    {tag}
                                    <button onClick={() => toggleTag(tag)} className="remove-tag">&times;</button>
                                    </span>
                                ))}
                                </div>
                                <div className="tags-list">
                                {predefinedTags.map((tag) => (
                                    <button
                                    key={tag}
                                    className={`tag-button ${tags.includes(tag) ? 'selected' : ''}`}
                                    onClick={() => toggleTag(tag)}
                                    disabled={tags.length >= 5 && !tags.includes(tag)}
                                    >
                                    {tag}
                                    </button>
                                ))}
                                </div>
                                {tags.length === 5 && (
                                <p className="tag-limit-message">Máximo de 5 tags selecionadas.</p>
                                )}
                            </div>
                            )}
                        </div>
                        </div>
                        <div className="descricao-fundo">
                            <p>Descrição</p>
                            <textarea
                                placeholder="descrição do evento aqui..."
                                className="descricao-novo"
                                name="descricao"
                                value={formData.descricao}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                    </div>

                    <div className="segunda-parte">
                    <div className="imagem-upload-container">
                        <label htmlFor="imagem-upload" className="imagem-upload-label">
                            {previewImage ? (
                                <img
                                    src={previewImage}
                                    alt="Pré-visualização"
                                    className="imagem-preview"
                                />
                            ) : (
                                <>
                                    <svg className="imagem-upload-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <span className="imagem-upload-text">Clique para fazer upload de uma imagem</span>
                                </>
                            )}
                        </label>
                        <input
                            id="imagem-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="imagem-input-hidden"
                        />
                        {previewImage && (
                            <button
                                onClick={() => setPreviewImage("")}
                                className="imagem-remove-button"
                            >
                                Remover Imagem
                            </button>
                        )}
                    </div>
                        <p>Defina a quantidade de pessoas:</p>
                        <div className="definir-vagas">
                            <img
                                src={pessoas}
                                alt="quantidade de pessoas"
                                className="icon-pessoas2"
                            ></img>
                            <input
                                className="numero-vagas"
                                name="vaga_limite"
                                type="number"
                                value={formData.vaga_limite}
                                onChange={handleChange}
                            ></input>
                        </div>
                        <p>Defina os dias de ínicio e término do evento</p>
                        <div className="definir-dia">
                            <img
                                src={calendario}
                                alt="dia do evento"
                                className="icon-calendario2"
                            />
                            <input
                                className="data-dia-evento"
                                type="datetime-local" // Alterado para datetime-local
                                name="data_inicio"
                                value={formData.data_inicio}
                                onChange={handleChange}
                                min="1900-01-01T00:00" // Data mínima permitida
                                max={`${new Date().toISOString().split("T")[0]}`} // Data máxima (hoje)
                            />
                            <input
                                className="data-dia-evento"
                                type="datetime-local" // Alterado para datetime-local
                                name="data_fim"
                                value={formData.data_fim}
                                onChange={handleChange}
                                min={formData.data_inicio} // Data mínima permitida
                                max={`${new Date().toISOString().split("T")[0]}`} // Data máxima (hoje)
                            />
                        </div>
                        <div>
                            <textarea
                                className="preferencias2"
                                placeholder="Preferências"
                                name="descricao_2"
                                value={formData.descricao_2}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="endereco-container">
                    <h2>Endereço do Evento</h2>
                    <div className="endereco-form">
                        <div className="endereco-row">
                            <div className="input-group">
                                <label htmlFor="cep">CEP</label>
                                <input
                                    type="text"
                                    id="cep"
                                    name="cep"
                                    placeholder="Digite o CEP"
                                    value={enderecoDados.cep}
                                    onChange={handleEnderecoChange}
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="numero">Número</label>
                                <input
                                    type="text"
                                    id="numero"
                                    name="numero"
                                    placeholder="Digite o número"
                                    value={enderecoDados.numero}
                                    onChange={handleEnderecoChange}
                                />
                            </div>
                            <button onClick={buscarCEP} className="buscar-cep-btn">
                                Buscar CEP
                            </button>
                        </div>
                        <div className="endereco-row">
                            <div className="input-group">
                                <label htmlFor="logradouro">Logradouro</label>
                                <input
                                    type="text"
                                    id="logradouro"
                                    name="logradouro"
                                    placeholder="Logradouro"
                                    value={enderecoDados.logradouro}
                                    disabled
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="bairro">Bairro</label>
                                <input
                                    type="text"
                                    id="bairro"
                                    name="bairro"
                                    placeholder="Bairro"
                                    value={enderecoDados.bairro}
                                    disabled
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="cidade">Cidade</label>
                                <input
                                    type="text"
                                    id="cidade"
                                    name="cidade"
                                    placeholder="Cidade"
                                    value={enderecoDados.cidade}
                                    disabled
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="estado">Estado</label>
                                <input
                                    type="text"
                                    id="estado"
                                    name="estado"
                                    placeholder="Estado"
                                    value={enderecoDados.estado}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                </div>


                <div className="botões-evento">
                    <button className="cancelar-evento">
                        <img
                            src={cancela}
                            alt="cancelar evento"
                            className="cancelar-evento-img"
                        ></img>
                        <p>Cancelar Evento</p>
                    </button>

                    <button className="adicionar-evento" onClick={handleSubmit}>
                        <img
                            src={correto}
                            alt="confirmar evento"
                            className="confirmar-evento-img"
                        ></img>
                        <p>Adicionar Evento</p>
                    </button>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Evento Criado com Sucesso!</h2>
                        <p>Seu evento foi criado e já está disponível para visualização.</p>
                        <button onClick={closeModal} className="modal-button">
                        Voltar para a página da ONG
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default CriacaoEventos;

