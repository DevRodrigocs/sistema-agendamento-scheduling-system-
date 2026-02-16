import { useState, useEffect } from "react"

export default function FormAgendamento({ onAdd, agendamentoEditando, onUpdate }) {

    const [form, setForm] = useState({
        nome: "",
        servico: "",
        data: "",
        horario: ""
    });

    const [mensagem, setMensagem] = useState("")

    useEffect(() => {
        if (agendamentoEditando) {
            setForm(agendamentoEditando)
        }
    }, [agendamentoEditando])

    function handleChange(e) {
        const { name, value } = e.target
        setForm({
            ...form,
            [name]: value
        });
    };

    function handleSubmit(e) {
        e.preventDefault();
        
        if (agendamentoEditando) {
            onUpdate(agendamentoEditando.id, form)
        } else {
            onAdd(form)
        }
        setForm({
            nome: "",
            servico: "",
            data: "",
            horario: ""
        });

        setMensagem("Agendamento salvo com sucesso!")

        setTimeout(() => {
            setMensagem("")
        }, 2000)
    } 
    

    return (
        <div className="form-container">
            <h2>Novo Agendamento</h2>

            {mensagem && <p className="mensagem sucesso">{mensagem}</p>}

            <form onSubmit={handleSubmit} className="form-agendamento">
                <input
                className="input" 
                type="text"
                name="nome"
                placeholder="Nome"
                value={form.nome}
                onChange={handleChange}
                />

                <input
                className="input" 
                type="text"
                name="servico"
                placeholder="Serviço"
                value={form.servico}
                onChange={handleChange}
                />

                <input
                className="input" 
                type="date"
                name="data"
                value={form.data}
                onChange={handleChange}
                />

                <input
                className="input" 
                type="time"
                name="horario"
                value={form.horario}
                onChange={handleChange}
                />

                <button className="submit-btn" type="submit">{agendamentoEditando ? "Atualizar" : "Agendar"}</button>
            </form>
        </div>
    );
}