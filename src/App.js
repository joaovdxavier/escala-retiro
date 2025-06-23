import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

const ministerios = [
  "Intercessão", "Música", "Ordem", "Comunicação",
  "Liturgia", "Louvor", "Limpeza", "Lazer"
];

const servos = [
  "CAMILA", "GUSTAVO", "ELLEN", "GABY", "LETÍCIA", "JOÃO EMANUEL",
  "LUCAS", "MARIANA BEZERRA", "RAQUEL", "THAYLA", "MONIQUE", "PEDRO",
  "MATHEUS", "VINICIUS OXI", "JOÃO VITOR XAVIER", "LORENA MARIA", "MARIA GABRIELA", "LIANDRA",
  "LEONARDO", "MOISÉS", "MARIA JÚLIA", "LISANDRA", "TATIANA", "JÚLIA",
  "PEDRO GUSTAVO", "ERICK", "MARIANA LETÍCIA", "ANNY", "AIZA", "NICOLAS",
  "MARIA BEATRIZ", "JOÃO VITOR GALVÃO", "LORENA CRISTINA", "CARLOS", "KALLED", "MARIANA BRANDÃO",
  "AMANDA", "FERNANDA", "MARIA EDUARDA", "CLARA MACEDO", "JOÃO ÍTALO", "GIOVANA",
  "JAQUELINE", "JOHAB", "CARLOS"
];

const CREDENTIALS = [
  { username: "coordenador", password: "meufilhotumeamas" }
];

const diasRef = {
  "SEXTA": "2025-06-13",
  "SÁBADO": "2025-06-14",
  "DOMINGO": "2025-06-15"
};

const parseHorario = (dia, hora) => new Date(`${diasRef[dia]}T${hora}:00`);

const programacao = [
  { dia: "SEXTA", hora: "12:00", atividade: "Credenciamento dos campistas" },
  { dia: "SEXTA", hora: "12:30", atividade: "Oração dos servos" },
  { dia: "SEXTA", hora: "13:15", atividade: "Saída para a Casa de Campo" },
  { dia: "SEXTA", hora: "15:00", atividade: "Chegada e acolhida" },
  { dia: "SEXTA", hora: "15:30", atividade: "Louvor Inicial + Oração" },
  { dia: "SEXTA", hora: "16:10", atividade: "Divisão dos Pastoreios" },
  { dia: "SEXTA", hora: "16:20", atividade: "Primeiro Momento (Lazer)" },
  { dia: "SEXTA", hora: "16:50", atividade: "Partilha (Apresentação dos Pastoreios)" },
  { dia: "SEXTA", hora: "17:30", atividade: "I Pregação + Oração" },
  { dia: "SEXTA", hora: "18:30", atividade: "Lazer" },
  { dia: "SEXTA", hora: "19:30", atividade: "Jantar" },
  { dia: "SEXTA", hora: "20:30", atividade: "Teatro + Oração" },
  { dia: "SEXTA", hora: "21:30", atividade: "Partilha" },
  { dia: "SEXTA", hora: "22:00", atividade: "Lanche e Banho" },
  { dia: "SEXTA", hora: "23:00", atividade: "Recolhimento e Reunião dos Servos" },
  { dia: "SÁBADO", hora: "05:00", atividade: "Despertar - Servos" },
  { dia: "SÁBADO", hora: "05:30", atividade: "Despertar - Participantes" },
  { dia: "SÁBADO", hora: "05:40", atividade: "Cenáculo" },
  { dia: "SÁBADO", hora: "07:00", atividade: "Santa Missa" },
  { dia: "SÁBADO", hora: "09:00", atividade: "Café da Manhã" },
  { dia: "SÁBADO", hora: "10:30", atividade: "Trilha + Partilha" },
  { dia: "SÁBADO", hora: "12:00", atividade: "Final da Trilha" },
  { dia: "SÁBADO", hora: "13:00", atividade: "Almoço" },
  { dia: "SÁBADO", hora: "14:00", atividade: "Louvor + Oração" },
  { dia: "SÁBADO", hora: "14:20", atividade: "II Pregação + Adoração à cruz" },
  { dia: "SÁBADO", hora: "15:40", atividade: "Lanche" },
  { dia: "SÁBADO", hora: "16:10", atividade: "Louvor + Oração" },
  { dia: "SÁBADO", hora: "16:20", atividade: "III Pregação + Perdão" },
  { dia: "SÁBADO", hora: "17:30", atividade: "Partilha" },
  { dia: "SÁBADO", hora: "18:30", atividade: "Louvor" },
  { dia: "SÁBADO", hora: "18:50", atividade: "Momento Mariano" },
  { dia: "SÁBADO", hora: "20:00", atividade: "Jantar" },
  { dia: "SÁBADO", hora: "21:00", atividade: "Fraternidade" },
  { dia: "SÁBADO", hora: "21:40", atividade: "Partilha" },
  { dia: "SÁBADO", hora: "22:00", atividade: "Banho" },
  { dia: "SÁBADO", hora: "23:00", atividade: "Reunião dos Servos" },
  { dia: "DOMINGO", hora: "05:00", atividade: "Despertar - Servos" },
  { dia: "DOMINGO", hora: "06:00", atividade: "Despertar - Participantes" },
  { dia: "DOMINGO", hora: "07:00", atividade: "Café da Manhã" },
  { dia: "DOMINGO", hora: "08:00", atividade: "Santa Missa" },
  { dia: "DOMINGO", hora: "10:00", atividade: "Lanche" },
  { dia: "DOMINGO", hora: "10:30", atividade: "IV Pregação (família)" },
  { dia: "DOMINGO", hora: "11:30", atividade: "Partilha" },
  { dia: "DOMINGO", hora: "11:50", atividade: "V Pregação + Oração" },
  { dia: "DOMINGO", hora: "12:50", atividade: "Lazer" },
  { dia: "DOMINGO", hora: "13:30", atividade: "Almoço + Banho (Todos)" },
  { dia: "DOMINGO", hora: "15:50", atividade: "Louvorzão" },
  { dia: "DOMINGO", hora: "16:20", atividade: "VI Pregação" },
  { dia: "DOMINGO", hora: "17:00", atividade: "Efusão + Adoração" },
  { dia: "DOMINGO", hora: "18:00", atividade: "Partilha" },
  { dia: "DOMINGO", hora: "18:30", atividade: "Louvor + Anúncio do Lazer" },
  { dia: "DOMINGO", hora: "19:30", atividade: "Encerramento" }
];

const getColorClass = (value) => {
  switch (value) {
    case "Intercessão": return "bg-red-500 text-white";
    case "Música": return "bg-blue-500 text-white";
    case "Ordem": return "bg-gray-500 text-white";
    case "Comunicação": return "bg-pink-500 text-white";
    case "Liturgia": return "bg-purple-600 text-white";
    case "Louvor": return "bg-orange-500 text-black";
    case "Limpeza": return "bg-green-500 text-white";
    case "Lazer": return "bg-yellow-500 text-white";
    default: return "";
  }
};

function App() {
  const [authenticated, setAuthenticated] = useState(null);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [exportType, setExportType] = useState(null);
  const [exportValue, setExportValue] = useState("");

  const [tab, setTab] = useState("programacao");

  const [data, setData] = useState(() => {
    const stored = localStorage.getItem("escalaData");
    const parsed = stored ? JSON.parse(stored) : [];
    return programacao.map((_, i) =>
      parsed[i] && Array.isArray(parsed[i])
        ? parsed[i].slice(0, servos.length).concat(Array(servos.length).fill("")).slice(0, servos.length)
        : Array(servos.length).fill("")
    );
  });

  const [timeSlotData, setTimeSlotData] = useState(() => {
    const stored = localStorage.getItem("horarioData");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("escalaData", JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem("horarioData", JSON.stringify(timeSlotData));
  }, [timeSlotData]);

  const startTime = parseHorario(programacao[0].dia, programacao[0].hora);
  const endTime = parseHorario(programacao[programacao.length - 1].dia, programacao[programacao.length - 1].hora);

  const timeSlots = [];
  let current = new Date(startTime);
  while (current <= endTime) {
    const next = new Date(current.getTime() + 30 * 60000);
    timeSlots.push({
      label: `${current.toLocaleString('pt-BR', { weekday: 'short' })} ${current.getHours().toString().padStart(2, '0')}:${current.getMinutes().toString().padStart(2, '0')} - ${next.getHours().toString().padStart(2, '0')}:${next.getMinutes().toString().padStart(2, '0')}`,
      start: new Date(current),
      end: next
    });
    current = next;
  }

  const getConflictingAssignment = (rowIndex, colIndex, selectedMinistry) => {
    const currentTime = parseHorario(programacao[rowIndex].dia, programacao[rowIndex].hora);
    for (let i = 0; i < programacao.length; i++) {
      if (i !== rowIndex && parseHorario(programacao[i].dia, programacao[i].hora).getTime() === currentTime.getTime()) {
        if (data[i][colIndex] === selectedMinistry) {
          return true;
        }
      }
    }
    return false;
  };

  const getMinistryForSlot = (servoIndex, slotStart) => {
    for (let i = 0; i < programacao.length; i++) {
      const progStart = parseHorario(programacao[i].dia, programacao[i].hora);
      const progEnd = new Date(progStart.getTime() + 30 * 60000);
      if (slotStart >= progStart && slotStart < progEnd) {
        return data[i][servoIndex];
      }
    }
    return "";
  };

  const exportToExcel = () => {
    const ws_data = [["Dia", "Hora", "Atividade", ...servos], ...programacao.map((item, i) => [item.dia, item.hora, item.atividade, ...data[i]])];
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Escala");
    XLSX.writeFile(wb, "Escala_AbbaCamp.xlsx");
  };

  const exportFiltered = () => {
    if (!exportValue || (exportType === "ministry" ? !ministerios.includes(exportValue) : !servos.includes(exportValue))) {
      alert("Seleção inválida.");
      return;
    }

    const wb = XLSX.utils.book_new();

    if (exportType === "ministry") {
      const filteredProg = [["Dia", "Hora", "Atividade", "Servo"]];
      programacao.forEach((item, i) => {
        if (!data[i]) return;
        servos.forEach((servo, j) => {
          if (data[i][j] === exportValue) {
            filteredProg.push([item.dia, item.hora, item.atividade, servo]);
          }
        });
      });

      const filteredHorario = [["Horário", "Servo"]];
      timeSlots.forEach((slot, i) => {
        servos.forEach((servo, j) => {
          const val = timeSlotData[i]?.[j] || getMinistryForSlot(j, slot.start);
          if (val === exportValue) {
            filteredHorario.push([slot.label, servo]);
          }
        });
      });

      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(filteredProg), exportValue + "_Programacao");
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(filteredHorario), exportValue + "_Horarios");
    } else {
      const index = servos.indexOf(exportValue);
      const filteredProg = [["Dia", "Hora", "Atividade", "Ministério"]];
      programacao.forEach((item, i) => {
        if (data[i]?.[index]) {
          filteredProg.push([item.dia, item.hora, item.atividade, data[i][index]]);
        }
      });

      const filteredHorario = [["Horário", "Ministério"]];
      timeSlots.forEach((slot, i) => {
        const val = timeSlotData[i]?.[index] || getMinistryForSlot(index, slot.start);
        if (val) {
          filteredHorario.push([slot.label, val]);
        }
      });

      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(filteredProg), exportValue + "_Programacao");
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(filteredHorario), exportValue + "_Horarios");
    }

    XLSX.writeFile(wb, `Escala_AbbaCamp_${exportValue}.xlsx`);
    setExportType(null);
    setExportValue("");
  };

  const handleLogin = () => {
    const valid = CREDENTIALS.some(
      (cred) => cred.username === loginUser && cred.password === loginPass
    );
    if (valid) {
      setAuthenticated(true);
    } else {
      alert("Credenciais inválidas.");
    }
  };

  if (authenticated === null) {
    return (
      <div className="p-4 max-w-sm mx-auto">
        <h1 className="text-xl font-bold mb-4">Login para Editar</h1>
        <input
          type="text"
          placeholder="Usuário"
          value={loginUser}
          onChange={(e) => setLoginUser(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          type="password"
          placeholder="Senha"
          value={loginPass}
          onChange={(e) => setLoginPass(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
        />
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Entrar
        </button>
        <p className="mt-2 text-sm text-gray-500">Ou continue como visitante. Apenas visualização.</p>
        <button
          onClick={() => setAuthenticated(false)}
          className="mt-2 text-blue-500 underline"
        >
          Continuar sem login
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 overflow-auto">
      <h1 className="text-3xl font-bold mb-4">Escala AbbaCamp</h1>

      <div className="mb-4">
        <button className={`px-4 py-2 mr-2 rounded ${tab === 'programacao' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`} onClick={() => setTab("programacao")}>Por Programação</button>
        <button className={`px-4 py-2 rounded ${tab === 'horarios' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`} onClick={() => setTab("horarios")}>Por Horário</button>
      </div>

      {tab === "programacao" ? (
        <table className="border-collapse border border-gray-400 w-full text-sm">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Dia</th>
              <th className="border border-gray-300 px-4 py-2">Hora</th>
              <th className="border border-gray-300 px-4 py-2">Atividade</th>
              {servos.map((s, idx) => (
                <th key={idx} className="border border-gray-300 px-2 py-2 text-xs whitespace-nowrap">{s}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {programacao.map((prog, rowIndex) => (
              <tr key={rowIndex}>
                <td className="border border-gray-300 px-2 py-2">{prog.dia}</td>
                <td className="border border-gray-300 px-2 py-2">{prog.hora}</td>
                <td className="border border-gray-300 px-2 py-2">{prog.atividade}</td>
                {servos.map((_, colIndex) => (
                  <td key={colIndex} className="border border-gray-300 px-2 py-2">
                    <select
                      disabled={authenticated === false}
                      value={data[rowIndex][colIndex]}
                      onChange={(e) => {
                        const selected = e.target.value;
                        if (getConflictingAssignment(rowIndex, colIndex, selected)) {
                          alert(`Conflito detectado: ${servos[colIndex]} já está designado para ${selected} nesse mesmo horário.`);
                          return;
                        }
                        const newData = [...data];
                        newData[rowIndex][colIndex] = selected;
                        setData(newData);
                      }}
                      className={`w-full min-w-[140px] p-2 border border-gray-200 rounded text-sm ${getColorClass(data[rowIndex][colIndex])}`}
                    >
                      <option value="">--</option>
                      {ministerios.map((minist, idx) => (
                        <option key={idx} value={minist}>{minist}</option>
                      ))}
                    </select>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table className="border-collapse border border-gray-400 w-full text-sm">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Horário</th>
              {servos.map((s, idx) => (
                <th key={idx} className="border border-gray-300 px-2 py-2 text-xs whitespace-nowrap">{s}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot, rowIndex) => (
              <tr key={rowIndex}>
                <td className="border border-gray-300 px-2 py-2 font-semibold whitespace-nowrap">{slot.label}</td>
                {servos.map((_, colIndex) => {
                  if (!timeSlotData[rowIndex]) timeSlotData[rowIndex] = Array(servos.length).fill("");
                  const ministry = timeSlotData[rowIndex][colIndex] || getMinistryForSlot(colIndex, slot.start);
                  const handleChange = (e) => {
                    const selected = e.target.value;
                    const newSlotData = [...timeSlotData];
                    if (!newSlotData[rowIndex]) newSlotData[rowIndex] = Array(servos.length).fill("");
                    newSlotData[rowIndex][colIndex] = selected;
                    setTimeSlotData(newSlotData);
                  };
                  return (
                    <td key={colIndex} className="border border-gray-300 px-2 py-2">
                      <select
                        disabled={authenticated === false}
                        value={ministry}
                        onChange={handleChange}
                        className={`w-full min-w-[140px] p-2 border border-gray-200 rounded text-sm ${getColorClass(ministry)}`}
                      >
                        <option value="">--</option>
                        {ministerios.map((minist, idx) => (
                          <option key={idx} value={minist}>{minist}</option>
                        ))}
                      </select>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-4 space-x-2">
        <button onClick={exportToExcel} className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
          Exportar para Excel
        </button>
        <button
          onClick={() => setExportType("ministry")}
          className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Exportar por Ministério
        </button>
        <button
          onClick={() => setExportType("servo")}
          className="px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Exportar por Servo
        </button>
      </div>

      {exportType && (
        <div className="mt-4">
          <label className="mr-2 font-medium">{exportType === 'ministry' ? 'Ministério' : 'Servo'}:</label>
          <select
            value={exportValue}
            onChange={(e) => setExportValue(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="">Selecione</option>
            {(exportType === 'ministry' ? ministerios : servos).map((item, idx) => (
              <option key={idx} value={item}>{item}</option>
            ))}
          </select>
          <button
            onClick={exportFiltered}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Confirmar Exportação
          </button>
        </div>
      )}
    </div>
  );

}

export default App;
