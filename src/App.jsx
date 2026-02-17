import Header from "./components/Header";
import FormAgendamento from "./components/FormAgendamento";
import ListaAgendamentos from "./components/ListaAgendamentos";
import Footer from "./components/Footer";
import { useState, useEffect } from "react";
import "./styles/index.css";

function App() {

  const [agendamentos, setAgendamentos] = useState(() => {
    const dadosSalvos = localStorage.getItem("agendamentos")
    return dadosSalvos ? JSON.parse(dadosSalvos) : []
  });

  const [agendamentoEditando, setAgendamentoEditando] = useState(null);

  const [filtro, setFiltro] = useState("")

  const [darkMode, setDarkmode] = useState(() => {
    const salvo = localStorage.getItem("darkMode")
    return salvo ? JSON.parse(salvo) : false
  })

  const agendamentosOrdenados = [...agendamentos].sort((a,b) => {
    const dataA = new Date(`${a.data}T${a.horario}`)
    const dataB = new Date(`${b.data}T${b.horario}`)
    return dataA - dataB
  })

  const agendamentosFiltrados = agendamentosOrdenados.filter(ag => ag.nome.toLowerCase().includes(filtro.toLowerCase()))

  useEffect(() => {
    
    localStorage.setItem("agendamentos", JSON.stringify(agendamentos))
  }, [agendamentos])

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode))
  }, [darkMode])

  function adicionarAgendamento(novoAgendamento) {

    const agendamentoComId = {
      ...novoAgendamento,
      id: crypto.randomUUID()
    }

    setAgendamentos(prev => [...prev, agendamentoComId])
  }

  function removerAgendamento(id) {
    setAgendamentos(prev => prev.filter(agendamento => agendamento.id !== id))
  }

  function atualizarAgendamento(id, dadosAtualizados) {
    setAgendamentos(prev => prev.map(ag => ag.id === id ? { ...ag, ...dadosAtualizados } : ag))

    setAgendamentoEditando(null)
  }

  return (
    <div className={darkMode ? "app-container dark" : "app-container"}>
      <div className="toolbar">
        <button
          className="toggle-btn"
          onClick={() => setDarkmode(prev => !prev)}
        >
          {darkMode ? "☀️ Modo Claro" : "🌙 Modo Escuro"}
        </button>
      </div>

      <Header />
      <FormAgendamento 
        onAdd={adicionarAgendamento}
        agendamentoEditando={agendamentoEditando}
        onUpdate={atualizarAgendamento}
        listaAgendamentos={agendamentos}
      />
      <div className="search-wrapper">
        <input 
          className="search-input"
          type="text"
          placeholder="🔍 Busca por nome..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
       />
      </div>

      <ListaAgendamentos 
        agendamentos={agendamentosFiltrados}
        onRemove={removerAgendamento}
        onEdit={setAgendamentoEditando}
        darkMode={darkMode}
      />
      <Footer />
    </div>
  )
}

export default App