import React, { useState } from "react";
import "./../css/Eventos.css";

const estados = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT",
  "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO",
  "RR", "SC", "SP", "SE", "TO"
];

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

const Search = ({ onBuscar }) => {
  const [estadoSelecionado, setEstadoSelecionado] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState([]);
  const [cidade, setCidade] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllCategories, setShowAllCategories] = useState(false);

  const handleAddCategory = (categoria) => {
    if (!categoriaSelecionada.includes(categoria) && categoriaSelecionada.length < 5) {
      setCategoriaSelecionada([...categoriaSelecionada, categoria]);
    }
  };

  const handleRemoveCategory = (categoria) => {
    setCategoriaSelecionada(categoriaSelecionada.filter((cat) => cat !== categoria));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onBuscar({ estadoSelecionado, categoria: categoriaSelecionada, cidade, searchQuery });
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const toggleCategories = () => {
    setShowAllCategories(!showAllCategories);
  };

  return (
    <section className="arrumar-tudo">
      <h1 className="Eventos-h1">Busque por seus Eventos aqui!</h1>
      <form onSubmit={handleSubmit} className="Eventos-form">
        <div className="Eventos-barra-pesquisa">
          <input
            type="text"
            placeholder="Digite sua pesquisa"
            className="Eventos-input-pesquisa"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="Eventos-button-buscar">
            Buscar
          </button>
        </div>
        <button type="button" onClick={toggleFilters} className="Eventos-toggle-filtros">
          {showFilters ? "Ocultar Filtros ▲" : "Exibir Filtros ▼"}
        </button>
        {showFilters && (
          <div className="Eventos-filtros">
            <div className="Eventos-linha">
              <select
                className="Eventos-estado-busca"
                value={estadoSelecionado}
                onChange={(e) => setEstadoSelecionado(e.target.value)}
              >
                <option value="">Estado</option>
                {estados.map((estado, index) => (
                  <option key={index} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
              <div className="Eventos-input-filtro">
                <input
                  type="text"
                  name="cidade"
                  autoComplete="off"
                  className="Eventos-input"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                />
                <label className="Eventos-user-label">Cidade</label>
              </div>
            </div>
            <div className="Eventos-categorias">
              <h3>Selecione até 5 Categorias</h3>
              <div
                className={`Eventos-categorias-disponiveis ${
                  showAllCategories ? "expanded" : ""
                }`}
              >
                {(showAllCategories ? predefinedTags : predefinedTags.slice(0, 10)).map(
                  (tag, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`Eventos-categoria-opcao ${
                        categoriaSelecionada.includes(tag) ? "disabled" : ""
                      }`}
                      onClick={() => handleAddCategory(tag)}
                      disabled={categoriaSelecionada.includes(tag)}
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
              <button
                type="button"
                className="Eventos-categorias-toggle"
                onClick={toggleCategories}
              >
                {showAllCategories ? "Ver Menos" : "Ver Mais"}
              </button>
              <div className="Eventos-categorias-selecionadas">
                {categoriaSelecionada.map((tag, index) => (
                  <button
                    key={index}
                    type="button"
                    className="Eventos-categoria-removida"
                    onClick={() => handleRemoveCategory(tag)}
                  >
                    {tag} ✕
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </form>
    </section>
  );
};

export default Search;
