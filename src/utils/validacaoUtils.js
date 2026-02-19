function toMinutes(hhmm) {
  if (!hhmm || typeof hhmm !== "string") return NaN;
  const parts = hhmm.trim().split(":").map(Number);
  if (parts.length !== 2 || parts.some(p => Number.isNaN(p))) return NaN;
  const [h, m] = parts;
  if (h < 0 || m < 0 || m >= 60) return NaN;
  return h * 60 + m;
}

function parseDurationToMinutes(dur) {
  if (!dur) return NaN;
  // aceita "HH:MM" ou "H:MM" / também um número de minutos como string
  if (dur.includes(":")) {
    return toMinutes(dur);
  }
  const n = Number(dur);
  return Number.isNaN(n) ? NaN : n;
}

/**
 * Verifica se existe conflito de agendamento em lista para o intervalo fornecido.
 * - lista: array de agendamentos ({ id, data, horario, duracao?, horarioFim? })
 * - dataStr: "yyyy-MM-dd"
 * - inicioStr: "HH:mm"
 * - duracaoStr: "HH:mm" ou número de minutos (opcional, se horarioFim estiver ausente)
 * - idEditando: id a ignorar (quando editando)
 */
export function existeConflito(lista, dataStr, inicioStr, duracaoStr, idEditando = null) {
  const minutosPorDia = 24 * 60;

  const inicio = toMinutes(inicioStr);
  if (Number.isNaN(inicio)) return false;

  let durMin = parseDurationToMinutes(duracaoStr);
  if (Number.isNaN(durMin)) durMin = 0;

  let fim = inicio + durMin;
  // se fim não avançou (duracao 0) tenta manter fim = inicio+1 para evitar falso positivo em mesmo horário
  if (fim === inicio) fim = inicio + 1;

  // normaliza para permitir ultrapassar meia-noite
  if (fim <= inicio) fim += minutosPorDia;

  return lista.some((ag) => {
    if (!ag || ag.id === idEditando) return false;
    if ((ag.data || "").trim() !== (dataStr || "").trim()) return false;
    const agInicio = toMinutes((ag.horario || "").trim());
    if (Number.isNaN(agInicio)) return false;

    // calcula fim do agendamento existente
    let agFim;
    if (ag.horarioFim) {
      agFim = toMinutes(ag.horarioFim.trim());
    } else if (ag.duracao) {
      const d = parseDurationToMinutes(ag.duracao);
      agFim = Number.isNaN(d) ? agInicio + 1 : agInicio + d;
    } else {
      agFim = agInicio + 1;
    }

    // normaliza fim do existente se necessário (wrap meia-noite)
    if (agFim <= agInicio) agFim += minutosPorDia;

    // também tratar caso novo intervalo comece antes do existente com wrap — comparar ambos sem módulo
    const aStart = inicio;
    const aEnd = fim;
    const bStart = agInicio;
    const bEnd = agFim;

    // overlap check
    return aStart < bEnd && aEnd > bStart;
  });
}