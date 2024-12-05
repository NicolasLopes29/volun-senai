import React, { useState } from "react";
import axios from "axios";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./../css/CriacaoEventos.css";
import { useParams, useNavigate } from "react-router-dom";
import calendario from "./../assets/images/calendario.svg";
import pessoas from "./../assets/images/icon-pessoas.svg";
import correto from "./../assets/images/icon-correto.svg";
import cancela from "./../assets/images/icon-cancela.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const CriacaoEventos = () => { 
    const { ongId } = useParams(); // Extrai o ID da ONG da rot4
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        titulo: "",
        descricao: "",
        descricao_2: "",
        data_inicio: null,
        data_fim: null,
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

    function handleVoltar(){
        navigate(`/ong`);
    }

    function validarLimiteVagas(value) {
        if (value > 4999) return 4999;
        if (value < 10) return 10;
        return value;
    }

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

  //função que limita o número de caracteres do titulo a 30
  const handleNomeEvento = (e) => {
    const { name, value } = e.target;
    if (value.length > 30) {
        alert("O título do evento deve ter no máximo 30 caracteres.");
        setFormData((prevData) => ({
            ...prevData,
            [name]: value.substring(0, 30), // Tranca o numero maximo de caracteres
        }));
        return;
    }
    setFormData((prevData) => ({ ...prevData, [name]: value }));
};
//função conjunta pra incluir o handlechange no handleNomeEvento
const handleTituloChange = (e) => {
    handleChange(e); 
    handleNomeEvento(e); 
};

// função que limita a descrição a 500 caracteres
const handleDescricaoCaracteres = (e) => {
    const { name, value } = e.target;
    if (value.length > 500) {
        alert("A descrição do evento deve ter no máximo 500 caracteres.");
        setFormData((prevData) => ({
            ...prevData,
            [name]: value.substring(0, 500), // Tranca o numero maximo de caracteres
        }));
        return;
    }
    setFormData((prevData) => ({ ...prevData, [name]: value }));
};

const handleDescricaoChange = (e) => {
    handleChange(e);
    handleDescricaoCaracteres(e);
}

const handlePreferenciasCaracteres = (e) => {
    const { name, value } = e.target;
    if (value.length > 150) {
        alert("O campo de preferências deve ter no máximo 150 caracteres.");
        setFormData((prevData) => ({
            ...prevData,
            [name]: value.substring(0, 150), // Tranca o numero maximo de caracteres
        }));
        return;
    }
    setFormData((prevData) => ({ ...prevData, [name]: value }))
};

const handlePreferenciasChange = (e) => {
    handleChange(e);
    handlePreferenciasCaracteres(e);

}

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
        // Permitir apenas números no campo "número" e limitar a 4 dígitos
        if (name === "numero" && value.length > 4) {
            return;
        }
        setEnderecoDados({ ...enderecoDados, [name]: value });
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
            // Verificar se todos os campos obrigatórios estão preenchidos
            if (
                !formData.titulo ||
                !formData.descricao ||
                !formData.data_inicio ||
                !formData.data_fim ||
                !formData.vaga_limite ||
                !imagemFile ||
                !enderecoDados.cep ||
                !enderecoDados.numero ||
                !enderecoDados.logradouro ||
                !enderecoDados.bairro ||
                !enderecoDados.cidade ||
                !enderecoDados.estado
            ) {
                alert("Por favor, preencha todos os campos obrigatórios antes de enviar o formulário.");
                return;
            }
    
            // Restrição de número com 4 dígitos
            if (enderecoDados.numero.length > 4) {
                alert("O número do endereço deve ter no máximo 4 dígitos.");
                return;
            }
    
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
            const enderecoResponse = await axios.post(
                "https://volun-api-eight.vercel.app/endereco",
                enderecoDados
            );
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
    
            const response = await axios.post(
                "https://volun-api-eight.vercel.app/eventos/",
                eventoData
            );
            setShowModal(true);
        } catch (error) {
            console.error(
                "Erro ao criar evento ou endereço:",
                error.response?.data || error.message
            );
            alert("Erro ao criar evento ou endereço. Por favor, tente novamente.");
        }
    };
    

    const closeModal = () => {
        setShowModal(false);
        navigate("/ong"); // Navega para a página /ong
      };

      const handleDateChange = (date, name) => {
        const now = new Date();
        now.setSeconds(0, 0); // Reseta segundos e milissegundos

        if (name === "data_inicio") {
            if (date < now) {
                alert("A data de início não pode ser menor que a data atual.");
                return;
            }
            setFormData((prevData) => ({
                ...prevData,
                data_inicio: date,
                data_fim: prevData.data_fim && prevData.data_fim <= date ? null : prevData.data_fim,
            }));
        } else if (name === "data_fim") {
            const startDate = formData.data_inicio;
            if (!startDate) {
                alert("Por favor, selecione primeiro a data de início.");
                return;
            }
            if (date <= startDate) {
                alert("A data de término deve ser posterior à data de início.");
                return;
            }
            const maxEndDate = new Date(startDate);
            maxEndDate.setDate(startDate.getDate() + 30);
            if (date > maxEndDate) {
                alert("A data de término não pode exceder 30 dias a partir da data de início.");
                return;
            }
            setFormData((prevData) => ({ ...prevData, data_fim: date }));
        }
    };

    // Obter a data/hora atual no formato adequado
    const getCurrentDateTime = () => {
        const now = new Date();
        return now.toISOString().slice(0, 16); // Formato: YYYY-MM-DDTHH:mm
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
                            onChange={handleTituloChange}
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
                                onChange={handleDescricaoChange}
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
                                max="4999" min="10"
                                value={formData.vaga_limite}
                                onChange={(e) => {
                                    const valorValidado = validarLimiteVagas(parseInt(e.target.value, 10));
                                    handleChange({ target: { name: e.target.name, value: valorValidado } });
                                }}
                            />
                        </div>
                        <p>Defina os dias de ínicio e término do evento</p>
                        <div className="definir-dia">
                            <img
                                src={calendario}
                                alt="dia do evento"
                                className="icon-calendario2"
                            />
                             <DatePicker
                                selected={formData.data_inicio}
                                onChange={(date) => handleDateChange(date, "data_inicio")}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="dd/MM/yyyy HH:mm"
                                minDate={new Date()}
                                placeholderText="Selecione a data e hora de início"
                                className="custom-datepicker"
                                isClearable={false}
                                showPopperArrow={false}
                                onChangeRaw={(e) => e.preventDefault()}
                            />
                            <DatePicker
                                selected={formData.data_fim}
                                onChange={(date) => handleDateChange(date, "data_fim")}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="dd/MM/yyyy HH:mm"
                                minDate={formData.data_inicio ? new Date(formData.data_inicio) : new Date()}
                                maxDate={formData.data_inicio ? new Date(new Date(formData.data_inicio).setDate(new Date(formData.data_inicio).getDate() + 30)) : null}
                                placeholderText="Selecione a data e hora de término"
                                className="custom-datepicker"
                                isClearable={false}
                                showPopperArrow={false}
                                onChangeRaw={(e) => e.preventDefault()}
                            />
                        </div>
                        <div>
                            <textarea
                                className="preferencias2"
                                placeholder="Preferências"
                                name="descricao_2"
                                value={formData.descricao_2}
                                onChange={handlePreferenciasChange}
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
                                    maxLength="4"
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
                    <button className="cancelar-evento" onClick={handleVoltar}>
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

