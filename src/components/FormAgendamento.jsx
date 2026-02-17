import { useState, useEffect } from "react"

export default function FormAgendamento({ onAdd, agendamentoEditando, onUpdate, listaAgendamentos }) {

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
        
        const { nome, servico, data, horario } = form;

        if (!nome || !data || !horario) {
            alert("Preencha todos os campos!");
            return;
        }

        const conflito = listaAgendamentos.some( (ag) => {
            const mesmaData = ag.data.trim() === data.trim();
            const mesmoHorario = ag.horario.trim() === horario.trim();
            const diferente = ag.id !== agendamentoEditando?.id;

            return mesmaData && mesmoHorario && diferente;
        }
        );

        if (conflito) {
            setMensagem({
                tipo: "erro",
                texto: "Já existe um agendamento nesse horário."
            });
            return;
        }

        const hoje = new
        Date().toISOString().split("T")[0];

        if (data < hoje) {
            alert("Não é possível agendar para uma data passada.");
            return;
        }
        
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

        setMensagem({
                tipo: "sucesso",
                texto: "Agendamento salvo com sucesso!"
            })

        setTimeout(() => {
            setMensagem("")
        }, 2000)
    } 
    
 
    return (
        <div className="form-container">
            <h2>Novo Agendamento</h2>

            {mensagem && (<p className={`mensagem ${mensagem.tipo}`}>{mensagem.texto}</p>)}

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