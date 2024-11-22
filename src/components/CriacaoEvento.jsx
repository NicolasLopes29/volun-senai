import React, { useState } from "react";
import axios from "axios";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./../css/CriacaoEventos.css";
import calendario from "./../assets/images/calendario.svg";
import pessoas from "./../assets/images/icon-pessoas.svg";
import correto from "./../assets/images/icon-correto.svg";
import cancela from "./../assets/images/icon-cancela.svg";

// Supondo que o ID da organização esteja em algum lugar do seu estado ou contexto global
const CriacaoEventos = ({ ongId }) => { // Recebe o ongId como prop (exemplo)
    const [formData, setFormData] = useState({
        titulo: "",
        tags: "",
        descricao: "",
        descricao_2: "",
        data_inicio: "",
        data_fim: "",
        vaga_limite: "",
        imagem: "",
    });
    const [imagemFile, setImagemFile] = useState(null); // Estado para armazenar o arquivo de imagem

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleFileChange = (e) => {
        setImagemFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        try {
            let imagemUrl = "";

            // Envio da imagem para o Firebase Storage
            if (imagemFile) {
                const storage = getStorage();
                const storageRef = ref(storage, `eventos/${imagemFile.name}`);
                await uploadBytes(storageRef, imagemFile);
                imagemUrl = await getDownloadURL(storageRef);
            }

            const eventoData = {
                ...formData,
                imagem: imagemUrl,
                ong_id: ongId, // Incluindo o ID da organização
            };

            await axios.post("https://volun-api-eight.vercel.app/eventos/", eventoData);
            alert("Evento criado com sucesso!");
        } catch (error) {
            console.error("Erro ao criar evento:", error);
            alert("Erro ao criar evento. Por favor, tente novamente.");
        }
    };

    return (
        <>
            <div classname="pega-tudo2">
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
                        <p className="titulo-tags">Selecione as tags do evento</p>
                        <select
                            className="tags-evento"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                        >
                            <option value="">Classificação de eventos</option>
                            <option>termas</option>
                            <option>do vale</option>
                        </select>
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
                        <div className="background-colar-img">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        <p>Defina a quantidade de pessoas</p>
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
                            ></img>
                            <input
                                className="data-dia-evento"
                                type="date"
                                name="data_inicio"
                                value={formData.data_inicio}
                                onChange={handleChange}
                            ></input>
                            <input
                                className="data-dia-evento"
                                type="date"
                                name="data_fim"
                                value={formData.data_fim}
                                onChange={handleChange}
                            ></input>
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

                <div className="endereco-mapa2">Mapa foda vem aqui</div>

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
        </>
    );
};

export default CriacaoEventos;

