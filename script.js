const PARES = [
  {
    sintoma: "Dor de cabeça",
    medicamento: "Analgésico",
    pergunta: "É seguro tomar paracetamol em doses maiores que o recomendado para aliviar a dor mais rápido.",
    resposta: false,
    explicacao: "Doses altas podem causar danos graves ao fígado, mesmo em curto prazo."
  },
  {
    sintoma: "Febre",
    medicamento: "Antitérmico",
    pergunta: "O ibuprofeno pode ajudar a reduzir a febre.",
    resposta: true,
    explicacao: "Ele possui ação antitérmica, ajudando a controlar a temperatura corporal."
  },
  {
    sintoma: "Alergia",
    medicamento: "Antialérgico",
    pergunta: "A loratadina pode causar sonolência em algumas pessoas.",
    resposta: true,
    explicacao: "Embora seja menos sedativa, ainda pode causar sonolência em alguns indivíduos."
  },
  {
    sintoma: "Infecção bacteriana",
    medicamento: "Antibiótico",
    pergunta: "Antibióticos devem ser usados mesmo sem prescrição médica quando há suspeita de infecção.",
    resposta: false,
    explicacao: "O uso inadequado pode causar resistência bacteriana, eliminação de bactérias boas (causando diarreia, reação alérgica, náuseas entre outros). ATENÇÃO: O USO DE ANTIBIÓTICOS SEMPRE DEVE SER INDICADO POR UM MÉDICO."
  },
  {
    sintoma: "Tosse seca",
    medicamento: "Antitussígeno",
    pergunta: "Medicamentos para tosse podem ser usados indiscriminadamente em qualquer tipo de tosse.",
    resposta: false,
    explicacao: "O tipo de tosse deve ser avaliado, pois alguns casos precisam eliminar secreções, não bloqueá-las. ATENÇÃO: EM CASO DE TOSSE PERSISTENTE, PROCURE UM PROFISSIONAL."
  },
  {
    sintoma: "Diarreia",
    medicamento: "Probiótico",
    pergunta: "Nos casos de diarreia, é importante manter hidratação (Soro reidratante) e fazer a utilização correta de probiótico com recomendação médica ou farmacêutica.",
    resposta: true,
    explicacao: "A principal preocupação é evitar desidratação, especialmente em crianças e idosos."
  },
  {
    sintoma: "Dor muscular",
    medicamento: "Relaxante muscular",
    pergunta: "Anti-inflamatórios podem causar efeitos colaterais no estômago.",
    resposta: true,
    explicacao: "Eles podem irritar a mucosa gástrica e causar gastrite ou até úlceras."
  },
  {
    sintoma: "Congestão nasal",
    medicamento: "Soro",
    pergunta: "Descongestionantes nasais podem ser usados por tempo ilimitado sem riscos.",
    resposta: false,
    explicacao: "O uso prolongado pode causar efeito rebote, piorando a congestão nasal."
  },
  {
    sintoma: "Cólica abdominal",
    medicamento: "Antiespasmódico",
    pergunta: "Toda dor abdominal é considerada cólica e tem sempre a mesma causa?",
    resposta: false,
    explicacao: "O indivíduo deve procurar um pronto socorro caso a cólica persista ou esteja acompanhada de febre alta, vômitos intensos, sangramento (urina ou fezes) e abdômen rígido."
  },
  {
    sintoma: "Gripe/resfriado",
    medicamento: "Hidratação e repouso",
    pergunta: "Antibióticos são eficazes no tratamento de gripes e resfriados.",
    resposta: false,
    explicacao: "Gripes são causadas por vírus (parasita intracelular, não é uma célula completa), e antibióticos só atuam contra bactérias (organismo completo, que tem vida própria e se reproduz)."
  },
  {
    sintoma: "Náusea",
    medicamento: "Antiemético",
    pergunta: "Alguns antieméticos para enjoo podem causar efeitos colaterais como sonolência.",
    resposta: true,
    explicacao: "Alguns antieméticos atuam no sistema nervoso central e podem provocar sedação, como por exemplo o Dramin, mas há opções que não têm este efeito colateral, como por exemplo o Vonal."
  },
  {
    sintoma: "Hipertensão",
    medicamento: "Anti-hipertensivo",
    pergunta: "É correto interromper o uso do medicamento quando a pressão arterial estiver controlada.",
    resposta: false,
    explicacao: "A interrupção sem orientação médica pode levar ao aumento da pressão e riscos à saúde."
  }
];

let nomeJogador = "";
let cartasViradas = [];
let parEncontrado = null;
let acertos = 0;
let tempoInicio = 0;
let timerInterval = null;
let totalPares = PARES.length;

function irParaTela(id) {
  document.querySelectorAll('.tela').forEach(t => {
    t.classList.remove('ativa');
    t.style.display = 'none';
  });
  const tela = document.getElementById(id);
  tela.style.display = 'flex';
  tela.classList.add('ativa');
}

function iniciarJogo() {
  const nome = document.getElementById('input-nome').value.trim();
  if (!nome) return alert('Digite seu nome para continuar!');
  nomeJogador = nome;
  acertos = 0;
  cartasViradas = [];
  parEncontrado = null;

  document.getElementById('hud-nome').textContent = nomeJogador;
  document.getElementById('hud-acertos').textContent = 0;

  irParaTela('tela-jogo');
  renderizarCartas();
  iniciarTimer();
}

function renderizarCartas() {
  const grid = document.getElementById('grid-cartas');
  grid.innerHTML = '';

  const cartas = [];
  PARES.forEach((par, i) => {
    cartas.push({ id: `s${i}`, texto: par.sintoma,      tipo: 'sintoma',      parIndex: i });
    cartas.push({ id: `m${i}`, texto: par.medicamento,  tipo: 'medicamento',  parIndex: i });
  });

  embaralhar(cartas).forEach(carta => {
    const el = document.createElement('div');
    el.className = 'carta';
    el.dataset.id = carta.id;
    el.dataset.parIndex = carta.parIndex;
    el.dataset.tipo = carta.tipo;
    el.innerHTML = `
      <div class="carta-inner">
        <div class="carta-frente">🃏</div>
        <div class="carta-verso">${carta.texto}</div>
      </div>`;
    el.addEventListener('click', () => virarCarta(el));
    grid.appendChild(el);
  });
}

function embaralhar(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function virarCarta(el) {
  if (cartasViradas.length === 2) return;
  if (el.classList.contains('virada') || el.classList.contains('encontrada')) return;

  el.classList.add('virada');
  cartasViradas.push(el);

  if (cartasViradas.length === 2) verificarPar();
}

function verificarPar() {
  const [a, b] = cartasViradas;
  const mesmoIndex = a.dataset.parIndex === b.dataset.parIndex;
  const tiposDiferentes = a.dataset.tipo !== b.dataset.tipo;

  if (mesmoIndex && tiposDiferentes) {
    parEncontrado = parseInt(a.dataset.parIndex);
    a.classList.add('encontrada');
    b.classList.add('encontrada');
    cartasViradas = [];
    setTimeout(() => abrirPergunta(parEncontrado), 500);
  } else {
    setTimeout(() => {
      a.classList.remove('virada');
      b.classList.remove('virada');
      cartasViradas = [];
    }, 900);
  }
}

function abrirPergunta(index) {
  const par = PARES[index];
  document.getElementById('modal-par').textContent = `${par.sintoma} ↔ ${par.medicamento}`;
  document.getElementById('modal-pergunta-texto').textContent = par.pergunta;
  document.getElementById('modal-pergunta').classList.remove('oculto');
  parEncontrado = index;
}

function responder(resposta) {
  document.getElementById('modal-pergunta').classList.add('oculto');
  const par = PARES[parEncontrado];
  const acertou = resposta === par.resposta;

  if (acertou) {
    acertos++;
    document.getElementById('hud-acertos').textContent = acertos;
  }

  document.getElementById('modal-resultado-icone').textContent = acertou ? '🎉' : '😕';
  document.getElementById('modal-explicacao-texto').textContent = par.explicacao;
  document.getElementById('modal-explicacao').classList.remove('oculto');
}

function fecharExplicacao() {
  document.getElementById('modal-explicacao').classList.add('oculto');
  const encontradas = document.querySelectorAll('.carta.encontrada').length / 2;
  if (encontradas === totalPares) finalizarJogo();
}

function iniciarTimer() {
  clearInterval(timerInterval);
  tempoInicio = Date.now();
  timerInterval = setInterval(() => {
    const seg = Math.floor((Date.now() - tempoInicio) / 1000);
    document.getElementById('hud-tempo').textContent = `${seg}s`;
  }, 1000);
}

function finalizarJogo() {
  clearInterval(timerInterval);
  const tempoTotal = Math.max(1, Math.floor((Date.now() - tempoInicio) / 1000));
  const pontuacao = parseFloat((acertos / tempoTotal).toFixed(4));

  const ranking = JSON.parse(localStorage.getItem('ranking') || '[]');
  ranking.push({ nome: nomeJogador, acertos, tempo: tempoTotal, pontuacao });
  ranking.sort((a, b) => b.pontuacao - a.pontuacao);
  localStorage.setItem('ranking', JSON.stringify(ranking));

  renderizarRanking(ranking);
  irParaTela('tela-ranking');
}

function renderizarRanking(ranking) {
  const tbody = document.getElementById('ranking-body');
  tbody.innerHTML = ranking.map((r, i) => `
    <tr>
      <td>${i + 1}º</td>
      <td>${r.nome}</td>
      <td>${r.pontuacao} <small style="color:#64748b">(${r.acertos} acertos / ${r.tempo}s)</small></td>
    </tr>`).join('');
}

function jogarNovamente() {
  document.getElementById('input-nome').value = '';
  irParaTela('tela-nome');
}

// Inicializa na tela do banner
irParaTela('tela-banner');
