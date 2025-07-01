import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { login } from "./service/authService";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { salvarEscalaNoFirebase, buscarEscalaDoFirebase } from "./service/firestoreService"; // Funções de salvar e buscar no Firestore



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
  "MARIA BEATRIZ", "JOÃO VITOR GALVÃO", "LORENA CRISTINA", "DUDU", "KALLED", "MARIANA BRANDÃO",
  "AMANDA", "FERNANDA", "MARIA EDUARDA", "CLARA MACEDO", "GIOVANA",
  "JAQUELINE", "JOHAB", "CARLOS GOMES"
];

const CREDENTIALS = [
  { username: "coordenador", password: "829128d4a01e25ce288f46c39f33a36630666670cb1c6207288885f0ef7398c7" }
];

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

<style>
  {`
    table th:nth-child(1),
    table td:nth-child(1) {
      position: sticky;
      left: 0;
      background-color: white;
      z-index: 3;
      box-shadow: 2px 0 5px -2px rgba(0,0,0,0.3);
    }
    table th:nth-child(2),
    table td:nth-child(2) {
      position: sticky;
      left: 120px;
      background-color: white;
      z-index: 3;
      box-shadow: 2px 0 5px -2px rgba(0,0,0,0.2);
    }
    table th:nth-child(3),
    table td:nth-child(3) {
      position: sticky;
      left: 280px;
      background-color: white;
      z-index: 3;
      box-shadow: 2px 0 5px -2px rgba(0,0,0,0.1);
    }
  `}
</style>

function App() {
  const [authenticated, setAuthenticated] = useState(null);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [data, setData] = useState("");
    // Estado para controlar filtro e seleção
  const [exportType, setExportType] = useState(null); // "servo" ou "ministerio"
  const [selectedExportItem, setSelectedExportItem] = useState(""); // nome do servo ou ministério

  const [user, setUser] = useState(null); // Estado do usuário autenticado



  // Carregar dados do Firestore quando o usuário estiver logado
  useEffect(() => {
    if (user) {
      buscarEscalaDoFirebase(user.uid).then((dados) => {
        setData(dados);
      });
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuario) => {
      if (usuario) {
        setUser(usuario);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    try {
      await login(loginUser, loginPass);
      setAuthenticated(true);
    } catch (error) {
      alert("Erro no login: " + error.message);
    }
  };

  const handleSalvar = async (e, i, j) => {
    const user = auth.currentUser;
    if (user) {
      const valor = e.target.value;
      const newData = { ...data, [`${i}-${j}`]: valor };
      setData(newData);
      await salvarEscalaNoFirebase(user.uid, newData);
      // opcional: alert("Dados salvos no Firebase!");
    } else {
      alert("Usuário não autenticado.");
    }
  }

  function exportPlanilhaCompleta(blocos, servos, data) {
    const rows = blocos.map((bloco, i) => {
      const row = {
        Dia: bloco.dia,
        Horário: `${bloco.inicio} - ${bloco.fim}`,
        Programações: bloco.atividades.join(", ") || "--"
      };
      servos.forEach((servo, j) => {
        row[servo] = data[`${i}-${j}`] || "--";
      });
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Escala Completa");
    XLSX.writeFile(wb, "escala_completa.xlsx");
  }

   function exportPorServoSelecionado(blocos, servos, data, servoSelecionado) {
    if (!servoSelecionado) {
      alert("Selecione um servo para exportar.");
      return;
    }
    const wb = XLSX.utils.book_new();

    const j = servos.indexOf(servoSelecionado);
    if (j === -1) {
      alert("Servo inválido.");
      return;
    }

    const rows = blocos.map((bloco, i) => ({
      Dia: bloco.dia,
      Horário: `${bloco.inicio} - ${bloco.fim}`,
      Programação: `${bloco.atividades.join(", ")}`,
      Ministério: data[`${i}-${j}`] || "--"
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, servoSelecionado.substring(0, 30));
    XLSX.writeFile(wb, `escala_${servoSelecionado}.xlsx`);
  }

  function exportPorMinisterioSelecionado(blocos, servos, data, ministerioSelecionado) {
    if (!ministerioSelecionado) {
      alert("Selecione um ministério para exportar.");
      return;
    }

    const wb = XLSX.utils.book_new();

    const rows = blocos.map((bloco, i) => {
      const presentes = servos
        .map((servo, j) => (data[`${i}-${j}`] === ministerioSelecionado ? servo : null))
        .filter((x) => x !== null);
      return {
        Dia: bloco.dia,
        Horário: `${bloco.inicio} - ${bloco.fim}`,
        Programação: `${bloco.atividades.join(", ")}`,
        Servos: presentes.length ? presentes.join(", ") : "--"
      };
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, ministerioSelecionado.substring(0, 30));
    XLSX.writeFile(wb, `escala_${ministerioSelecionado}.xlsx`);
  }

  // Gerar faixas de 30min (12:00 a 20:00 como exemplo)
  const gerarBlocos = () => {
    const dias = [...new Set(programacao.map(p => p.dia))];
    const blocos = [];

    dias.forEach(dia => {
      const progDia = programacao.filter(p => p.dia === dia);
      const horas = progDia.map(p => p.hora).sort();
      const minHora = horas[0];
      const maxHora = horas[horas.length - 1];

      const start = new Date(`2025-06-13T${minHora}`);
      const end = new Date(`2025-06-13T${maxHora}`);
      end.setMinutes(end.getMinutes() + 30);

      let current = start;
      while (current < end) {
        const next = new Date(current.getTime() + 30 * 60000);
        blocos.push({
          dia,
          inicio: current.toTimeString().slice(0,5),
          fim: next.toTimeString().slice(0,5),
          atividades: progDia
            .filter(p => p.hora >= current.toTimeString().slice(0,5) && p.hora < next.toTimeString().slice(0,5))
            .map(p => `${p.hora} - ${p.atividade}`)
        });
        current = next;
      }
    });

    return blocos;
  };

  const blocos = gerarBlocos();

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

  const getDiaBackgroundClass = (dia) => {
    switch (dia) {
      case "SEXTA":
        return "bg-cyan-50";  // vermelho claro
      case "SÁBADO":
        return "bg-amber-100";  // verde claro
      case "DOMINGO":
        return "bg-red-100";  // azul claro
      default:
        return "";
    }
  };

  return (
    <>
    <style>
        {`
          table {
            border-collapse: collapse;
          }

          thead th {
              position: sticky;
              top: 0;
              background-color: white;
              z-index: 20;
              box-shadow: 0 2px 5px -1px rgba(0,0,0,0.1);
            }

          table th, table td {
            box-sizing: border-box;
            border: 1px solid #ccc; /* manter borda igual */
            background-color: white; /* para sticky */
          }

          table th:nth-child(1),
          table td:nth-child(1) {
            position: sticky;
            left: 0;
            width: 120px;
            min-width: 120px;
            max-width: 120px;
            background-color: white;
            z-index: 5;
            box-shadow: 2px 0 5px -2px rgba(0,0,0,0.3);
          }

          table th:nth-child(2),
          table td:nth-child(2) {
            position: sticky;
            left: 120px;
            width: 160px;
            min-width: 160px;
            max-width: 160px;
            background-color: white;
            z-index: 4;
            box-shadow: 2px 0 5px -2px rgba(0,0,0,0.2);
          }

          table th:nth-child(3),
          table td:nth-child(3) {
            position: sticky;
            left: 280px;
            width: 350px;
            min-width: 350px;
            max-width: 350px;
            background-color: white;
            z-index: 3;
            box-shadow: 2px 0 5px -2px rgba(0,0,0,0.1);
          }
        `}
      </style>
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Escala AbbaCamp 2025</h1>
      <div>    
        <table className="border-collapse border border-gray-400 w-[1500px] text-sm">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Dia</th>
              <th className="border border-gray-300 p-2">Faixa Horária</th>
              <th className="border border-gray-300 p-2">Programações</th>
              {servos.map((s, idx) => (
                <th key={idx} className="border border-gray-300 p-2">{s}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {blocos.map((bloco, i) => (
              <tr key={i}>
                <td className={`border border-gray-300 p-2 ${getDiaBackgroundClass(bloco.dia)}`}>{bloco.dia}</td>
                <td className="border border-gray-300 p-2 min-w-[100px]">{bloco.inicio} - {bloco.fim}</td>
                <td className="border min-w-[350px] border-gray-300 p-2">
                  {bloco.atividades.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {bloco.atividades.map((atv, idx) => (
                        <li key={idx}>{atv}</li>
                      ))}
                    </ul>
                  ) : (
                    "--"
                  )}
                </td>
                {servos.map((_, j) => (
                  <td key={j} className="border border-gray-300 p-2">
                    <select
                      disabled={authenticated === false}
                      value={data[`${i}-${j}`] || ""}
                      onChange={(e) => handleSalvar(e, i, j)}
                      className={`w-full min-w-[140px] p-2 border border-gray-200 rounded text-sm `
                        + getColorClass(data[`${i}-${j}`])
                      }
                    >
                      <option value="">--</option>
                      {ministerios.map((m, idx) => (
                        <option key={idx} value={m}>{m}</option>
                      ))}
                    </select>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex space-x-2 my-4 items-center">
        <button
          onClick={() => {
            exportPlanilhaCompleta(blocos, servos, data);
            setExportType(null);
            setSelectedExportItem("");
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Exportar Completa
        </button>

        <button
          onClick={() => {
            setExportType("servo");
            setSelectedExportItem("");
          }}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Exportar por Servo
        </button>

        <button
          onClick={() => {
            setExportType("ministerio");
            setSelectedExportItem("");
          }}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Exportar por Ministério
        </button>

        {/* Mostrar select e botão de exportar após escolha do tipo */}
        {exportType === "servo" && (
          <>
            <select
              value={selectedExportItem}
              onChange={(e) => setSelectedExportItem(e.target.value)}
              className="ml-4 p-2 border rounded"
            >
              <option value="">-- Selecione um Servo --</option>
              {servos.map((s, i) => (
                <option key={i} value={s}>{s}</option>
              ))}
            </select>
            <button
              onClick={() => exportPorServoSelecionado(blocos, servos, data, selectedExportItem)}
              disabled={!selectedExportItem}
              className="ml-2 bg-green-700 text-white px-3 py-1 rounded"
            >
              Exportar
            </button>
          </>
        )}

        {exportType === "ministerio" && (
          <>
            <select
              value={selectedExportItem}
              onChange={(e) => setSelectedExportItem(e.target.value)}
              className="ml-4 p-2 border rounded"
            >
              <option value="">-- Selecione um Ministério --</option>
              {ministerios.map((m, i) => (
                <option key={i} value={m}>{m}</option>
              ))}
            </select>
            <button
              onClick={() => exportPorMinisterioSelecionado(blocos, servos, data, selectedExportItem)}
              disabled={!selectedExportItem}
              className="ml-2 bg-purple-700 text-white px-3 py-1 rounded"
            >
              Exportar
            </button>
          </>
        )}
      </div>
    </div>
    </>
  );
}

export default App;
