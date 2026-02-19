import { useState, useEffect } from "react"
import ReactDatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { constructFrom, format, parse } from "date-fns"
import { existeConflito } from "../utils/validacaoUtils";


export default function FormAgendamento({ onAdd, agendamentoEditando, onUpdate, listaAgendamentos }) {

    const initialForm = { nome: "", servico: "", duracao: "" }

    const presetDurations = ["00:15", "00:30", "00:45", "01:00", "01:30", "02:00"]

    const [form, setForm] = useState(initialForm)
    const [date, setDate] = useState(null)       // Date object for the day
    const [time, setTime] = useState(null)       // Date object for the time (date part ignored)
    const [mensagem, setMensagem] = useState("")
    const [useCustomDuration, setUseCustomDuration] = useState(false)
    const [customDurH, setCustomDurH] = useState("0")
    const [customDurM, setCustomDurM] = useState("15")

    useEffect(() => {
        if (agendamentoEditando) {
            setForm({
                nome: agendamentoEditando.nome || "",
                servico: agendamentoEditando.servico || "",
                duracao: agendamentoEditando.duracao || ""
            })

            // se a duração não estiver entre os presets, ativar custom e preencher os campos
            const dur = agendamentoEditando.duracao || ""
            if (dur && !presetDurations.includes(dur)) {
                const parts = dur.split(":").map(Number)
                setUseCustomDuration(true)
                setCustomDurH(String(parts[0] || 0))
                setCustomDurM(String(parts[1] || 0))
                setForm(prev => ({ ...prev, duracao: "" }))
            } else {
                setUseCustomDuration(false)
            }

            setDate(
                agendamentoEditando.data
                    ? parse(agendamentoEditando.data, "yyyy-MM-dd", new Date())
                    : null
            )

            setTime(
                agendamentoEditando.horario
                    ? parse(agendamentoEditando.horario, "HH:mm", new Date())
                    : null
            )
        } else {
            setForm(initialForm)
            setDate(null)
            setTime(null)
            setUseCustomDuration(false)
            setCustomDurH("0")
            setCustomDurM("15")
        }
    }, [agendamentoEditando])

    function handleChange(e) {
        const { name, value } = e.target
        if (name === "duracao") {
            if (value === "custom") {
                setUseCustomDuration(true)
                setForm(prev => ({ ...prev, duracao: "" }))
            } else {
                setUseCustomDuration(false)
                setForm(prev => ({ ...prev, duracao: value }))
            }
        } else {
            setForm(prev => ({ ...prev, [name]: value }))
        }
    }

    function pad(n) {
        return String(n).padStart(2, "0")
    }

    function handleSubmit(e) {
        e.preventDefault()

        const nome = form.nome.trim()
        const servico = form.servico.trim()

        // obter duração string: preset ou custom
        const duracaoStr = useCustomDuration
            ? `${pad(customDurH)}:${pad(customDurM)}`
            : (form.duracao?.trim() || "")

        if (!nome || !date || !time || !duracaoStr) {
            alert("Preencha todos os campos!");
            return;
        }

        // parse data/hora
        const dataStr = format(date, "yyyy-MM-dd")
        const horarioStr = format(time, "HH:mm")
        const [hora, minuto] = horarioStr.split(":").map(Number);

        // validar duração no formato HH:mm
        const durParts = duracaoStr.split(":").map(Number)
        if (durParts.length !== 2 || Number.isNaN(durParts[0]) || Number.isNaN(durParts[1])) {
            alert("Duração inválida. Use o formato HH:mm");
            return;
        }
        const [durH, durM] = durParts;
        const durTotalMin = durH * 60 + durM;

        // início em minutos desde 00:00
        const inicioTotalMin = hora * 60 + minuto;

        // fim em minutos (permitindo ultrapassar meia-noite)
        let fimTotalMin = inicioTotalMin + durTotalMin;
        const minutosPorDia = 24 * 60;
        const fimTotalMinModulo = fimTotalMin % minutosPorDia; // para exibir em HH:mm
        const fimHora = Math.floor(fimTotalMinModulo / 60);
        const fimMinuto = fimTotalMinModulo % 60;

        const horarioFimStr = `${String(fimHora).padStart(2, "0")}:${String(fimMinuto).padStart(2,"0")}`;

        // usar util de conflito se quiser (aqui cheque simples)
        const conflito = existeConflito(listaAgendamentos, dataStr, horarioStr, duracaoStr, agendamentoEditando?.id)
        if (conflito) {
            alert("Conflito: já existe um agendamento nesse intervalo.");
            return;
        }

        const payload = {
            nome,
            servico,
            duracao: duracaoStr,
            data: dataStr,
            horario: horarioStr,
            horarioFim: horarioFimStr
        }

        if (agendamentoEditando) {
            onUpdate(agendamentoEditando.id, payload)
        } else {
            onAdd(payload)
        }

        setForm(initialForm)
        setDate(null)
        setTime(null)
        setUseCustomDuration(false)
        setCustomDurH("0")
        setCustomDurM("15")
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

                <div className="duracao-wrapper">
                    <select
                        className="input duration-select"
                        name="duracao"
                        value={useCustomDuration ? "custom" : (form.duracao || "")}
                        onChange={handleChange}
                        aria-label="Duração"
                    >
                        <option value="">Selecione a duração</option>
                        {presetDurations.map(d => (
                            <option key={d} value={d}>{d.replace(/^00:/, "") === d ? d : d}</option>
                        ))}
                        <option value="custom">Outro...</option>
                    </select>

                    {useCustomDuration && (
                        <div className="custom-duration">
                            <input
                                className="input"
                                type="number"
                                min="0"
                                max="12"
                                value={customDurH}
                                onChange={(e) => setCustomDurH(e.target.value)}
                                aria-label="Horas"
                                title="Horas"
                            />
                            <span>h</span>
                            <input
                                className="input"
                                type="number"
                                min="0"
                                max="59"
                                step="5"
                                value={customDurM}
                                onChange={(e) => setCustomDurM(e.target.value)}
                                aria-label="Minutos"
                                title="Minutos"
                            />
                            <span>m</span>
                        </div>
                    )}
                </div>

                <ReactDatePicker
                    selected={date}
                    onChange={(d) => setDate(d)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Selecione a data"
                    className="input"
                    minDate={new Date()}
                />

                <ReactDatePicker
                    selected={time}
                    onChange={(t) => setTime(t)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Horário"
                    dateFormat="HH:mm"
                    placeholderText="Selecione o horário"
                    className="input"
                />

                <button className="submit-btn" type="submit">{agendamentoEditando ? "Atualizar" : "Agendar"}</button>
            </form>
        </div>
    );
}