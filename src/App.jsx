import Header from "./components/Header";
import FormAgendamento from "./components/FormAgendamento";
import ListaAgendamentos from "./components/ListaAgendamentos";
import Footer from "./components/Footer";
import { useState, useEffect } from "react";

function App() {

  const [agendamentos, setAgendamentos] = useState(() => {
    const dadosSalvos = localStorage.getItem("agendamentos")
    return dadosSalvos ? JSON.parse(dadosSalvos) : []
  });

  const [agendamentoEditando, setAgendamentoEditando] = useState(null);

  const [filtro, setFiltro] = useState("")

  const agendamentosOrdenados = [...agendamentos].sort((a,b) => {
    const dataA = new Date(`${a.data}T${a.horario}`)
    const dataB = new Date(`${b.data}T${b.horario}`)
    return dataA - dataB
  })

  const agendamentosFiltrados = agendamentosOrdenados.filter(ag => ag.nome.toLowerCase().includes(filtro.toLowerCase()))

  useEffect(() => {
    
    localStorage.setItem("agendamentos", JSON.stringify(agendamentos))
  }, [agendamentos])

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
    <div style={{
      maxWidth: "800px", 
      margin: "40px auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f3f4f6",
      minHeight: "100vh"
    }}>
      <Header />
      <FormAgendamento 
        onAdd={adicionarAgendamento}
        agendamentoEditando={agendamentoEditando}
        onUpdate={atualizarAgendamento}
      />
      <div style={{ width: "100%", marginBottom: "20px" }}>
        <input 
          type="text"
          placeholder="🔍 Busca por nome..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            boxSizing: "border-box"
          }}
       />
      </div>

      <ListaAgendamentos 
        agendamentos={agendamentosFiltrados}
        onRemove={removerAgendamento}
        onEdit={setAgendamentoEditando}
      />
      <Footer />
    </div>
  )
}

export default App