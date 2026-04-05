/**
 * ================================================================
 * CRISTIANE SANT'ANA BEAUTY HAIR — JavaScript Principal
 * Responsável por: Agendamento via WhatsApp, Modal de Up-sell,
 * Área de Personalização de Serviços e interações da UI
 * ================================================================
 */

// ─── CONFIGURAÇÃO ──────────────────────────────────────────────
/**
 * ⚙️  EDITE AQUI o número de WhatsApp da Cris (somente números).
 * Formato: código do país + DDD + número (sem espaços ou símbolos).
 * Exemplo: "5511999999999" = 55 (Brasil) + 11 (SP) + 999999999
 */
const WHATSAPP_NUMBER = "5511997260983"; // 🔧 Substitua pelo número real!

// ─── LISTA COMPLETA DE SERVIÇOS ─────────────────────────────────
/**
 * Todos os serviços disponíveis para o checklist de personalização.
 * Adicione ou remova serviços aqui conforme necessário.
 */
const SERVICOS_DISPONIVEIS = [
  "Corte Feminino",
  "Coloração Completa",
  "Escova Progressiva / Definitiva",
  "Tratamento Capilar Intensivo",
  "Mechas & Balayage",
  "Penteado & Styling",
  "Corte + Escova",
  "Hidratação Profunda",
  "Cauterização Capilar",
];

// ─── ESTADO DA APLICAÇÃO ────────────────────────────────────────
/**
 * Guarda o serviço clicado pelo usuário antes de abrir o modal.
 */
let servicoSelecionado = "";

// ─── UTILITÁRIOS ────────────────────────────────────────────────

/**
 * Gera um link de WhatsApp com a mensagem formatada.
 * @param {string} mensagem - Texto da mensagem a ser pré-preenchida.
 * @returns {string} URL completa do WhatsApp.
 */
function gerarLinkWhatsApp(mensagem) {
  const textoEncodado = encodeURIComponent(mensagem);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${textoEncodado}`;
}

/**
 * Abre o link do WhatsApp em uma nova aba.
 * @param {string} mensagem - Mensagem a enviar.
 */
function abrirWhatsApp(mensagem) {
  const link = gerarLinkWhatsApp(mensagem);
  window.open(link, "_blank");
}

// ─── MODAL PRINCIPAL (UP-SELL) ──────────────────────────────────

/**
 * Abre o Modal de Up-sell ao clicar em "Agendar" em um serviço.
 * Preenche o nome do serviço dinamicamente e reseta o estado da área
 * de personalização.
 * @param {string} nomeServico - Nome do serviço escolhido pelo usuário.
 */
function abrirModalUpsell(nomeServico) {
  // Salva o serviço no estado global
  servicoSelecionado = nomeServico;

  // Atualiza o conteúdo do modal com o serviço selecionado
  document.getElementById("modal-servico-nome").textContent = nomeServico;

  // Reseta a área de personalização (fecha se estava aberta)
  fecharAreaPersonalizar();

  // Desmarca todos os checkboxes
  const checkboxes = document.querySelectorAll(".servico-checkbox");
  checkboxes.forEach((cb) => (cb.checked = false));

  // Exibe o modal com animação
  const overlay = document.getElementById("modal-overlay");
  overlay.classList.add("active");

  // Impede o scroll do fundo
  document.body.style.overflow = "hidden";
}

/**
 * Fecha o Modal de Up-sell e restaura o scroll da página.
 */
function fecharModal() {
  const overlay = document.getElementById("modal-overlay");
  overlay.classList.remove("active");
  document.body.style.overflow = "";
  fecharAreaPersonalizar();
}

// ─── LÓGICA DOS BOTÕES DO MODAL ─────────────────────────────────

/**
 * Botão "Não, agendar só este".
 * Redireciona direto para o WhatsApp com mensagem simples do serviço.
 */
function agendarDireto() {
  const mensagem = `Olá Cris! 😊 Quero agendar: *${servicoSelecionado}*\n\nPoderia me informar os horários disponíveis?`;
  fecharModal();
  abrirWhatsApp(mensagem);
}

/**
 * Botão "Sim, quero desconto!".
 * Abre a área de personalização onde o cliente escolhe múltiplos serviços.
 */
function abrirAreaPersonalizar() {
  const area = document.getElementById("personalizar-area");

  // Marca o serviço original no checklist automaticamente
  const checkboxes = document.querySelectorAll(".servico-checkbox");
  checkboxes.forEach((cb) => {
    if (cb.value === servicoSelecionado) {
      cb.checked = true; // Pré-seleciona o serviço já escolhido
    }
  });

  // Abre a área com animação suave (usando max-height no CSS)
  area.classList.add("open");

  // Rola suavemente para mostrar a área dentro do modal
  setTimeout(() => {
    area.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, 150);
}

/**
 * Fecha a área de personalização.
 */
function fecharAreaPersonalizar() {
  const area = document.getElementById("personalizar-area");
  area.classList.remove("open");
}

/**
 * Botão "Finalizar Agendamento".
 * Coleta todos os checkboxes marcados, monta a mensagem concatenada
 * e gera o link do WhatsApp com os serviços selecionados.
 */
function finalizarAgendamento() {
  // Coleta todos os checkboxes marcados
  const checkboxesMarcados = document.querySelectorAll(
    ".servico-checkbox:checked"
  );

  // Extrai os valores (nomes dos serviços)
  const servicosSelecionados = Array.from(checkboxesMarcados).map(
    (cb) => cb.value
  );

  // Garante que pelo menos um serviço foi selecionado
  if (servicosSelecionados.length === 0) {
    // Feedback visual: destaca a área de seleção
    const box = document.querySelector(".personalizar-box");
    box.style.borderColor = "var(--gold)";
    box.style.boxShadow = "0 0 15px rgba(212, 175, 55, 0.3)";
    setTimeout(() => {
      box.style.borderColor = "";
      box.style.boxShadow = "";
    }, 1500);
    return; // Não prossegue sem seleção
  }

  // ─── Monta a mensagem concatenada ───────────────────────────
  // Formata a lista de serviços em linhas individuais
  const listaServicos = servicosSelecionados
    .map((s, i) => `  ${i + 1}. ${s}`)
    .join("\n");

  const quantidadeServicos = servicosSelecionados.length;
  const mensagemDesconto =
    quantidadeServicos > 1
      ? `\n\n💛 *Pacote com ${quantidadeServicos} serviços — Solicito o desconto especial!*`
      : "";

  // Mensagem final do WhatsApp
  const mensagemFinal =
    `Olá Cris! 😊 Gostaria de agendar um atendimento com os seguintes serviços:\n\n` +
    listaServicos +
    mensagemDesconto +
    `\n\nPoderia me informar os horários disponíveis? 🙏`;

  // Fecha o modal e abre o WhatsApp
  fecharModal();
  abrirWhatsApp(mensagemFinal);
}

// ─── CONTROLE DA NAVBAR ─────────────────────────────────────────

/**
 * Adiciona a classe .scrolled na navbar quando o usuário rola a página,
 * ativando o efeito glassmorphism no fundo.
 */
function initNavbar() {
  const navbar = document.getElementById("navbar");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

// ─── MENU MOBILE ────────────────────────────────────────────────

/**
 * Controla a abertura/fechamento do painel lateral mobile.
 * O botão hambúrguer abre/fecha o nav-mobile-panel.
 */
function initMenuMobile() {
  const toggle = document.getElementById("nav-toggle");
  const panel = document.getElementById("nav-mobile-panel");

  if (!toggle || !panel) return;

  // Abre/fecha painel ao clicar no hambúrguer
  toggle.addEventListener("click", () => {
    const isOpen = panel.classList.toggle("open");
    toggle.classList.toggle("active", isOpen);
    toggle.setAttribute("aria-expanded", isOpen);
    // Impede scroll do fundo enquanto menu está aberto
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  // Fecha o painel ao clicar em qualquer link interno
  panel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      panel.classList.remove("open");
      toggle.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });
}

// ─── ANIMAÇÃO REVEAL (SCROLL) ───────────────────────────────────

/**
 * Observa os elementos com a classe .reveal e os torna visíveis
 * quando entram no viewport, criando o efeito de "aparecer ao rolar".
 */
function initRevealAnimations() {
  const elementos = document.querySelectorAll(".reveal");

  // IntersectionObserver: dispara quando o elemento fica visível
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // Para de observar após revelar
        }
      });
    },
    {
      threshold: 0.12, // 12% do elemento visível dispara a animação
      rootMargin: "0px 0px -50px 0px",
    }
  );

  elementos.forEach((el) => observer.observe(el));
}

// ─── MODAL: FECHAR AO CLICAR FORA ───────────────────────────────

/**
 * Fecha o modal quando o usuário clica no overlay (área escura fora do modal).
 */
function initModalClickFora() {
  const overlay = document.getElementById("modal-overlay");
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      fecharModal();
    }
  });
}

// ─── FECHAR MODAL COM ESC ───────────────────────────────────────

/**
 * Permite fechar o modal pressionando a tecla Escape.
 */
function initEscapeKey() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      fecharModal();
    }
  });
}

// ─── BOTÃO WHATSAPP FLUTUANTE ────────────────────────────────────

/**
 * O botão flutuante de WhatsApp manda mensagem genérica de contato.
 */
function initWhatsAppFloat() {
  const btn = document.getElementById("whatsapp-float");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const mensagem =
      "Olá Cris! 😊 Vim pelo site e gostaria de saber mais sobre os serviços e agendamentos. Pode me ajudar?";
    abrirWhatsApp(mensagem);
  });
}

// ─── CONSTRUÇÃO DINÂMICA DO CHECKLIST ────────────────────────────

/**
 * Renderiza os checkboxes de serviços dinamicamente no modal,
 * com base no array SERVICOS_DISPONIVEIS.
 * Usar JS para renderizar evita duplicação de código no HTML.
 */
function renderCheckboxes() {
  const lista = document.getElementById("checklist-servicos");
  if (!lista) return;

  // Limpa a lista antes de renderizar
  lista.innerHTML = "";

  // Cria um item de checklist para cada serviço disponível
  SERVICOS_DISPONIVEIS.forEach((servico) => {
    const li = document.createElement("li");
    li.className = "checkbox-item";

    const inputId = `cb-${servico.replace(/\s+/g, "-").toLowerCase()}`;

    li.innerHTML = `
      <label for="${inputId}" style="display:flex;align-items:center;gap:0.75rem;cursor:pointer;width:100%">
        <input
          type="checkbox"
          class="servico-checkbox"
          id="${inputId}"
          value="${servico}"
        />
        <span class="checkbox-custom"></span>
        <span class="checkbox-label">${servico}</span>
      </label>
    `;

    lista.appendChild(li);
  });
}

// ─── INICIALIZAÇÃO ───────────────────────────────────────────────

/**
 * Ponto de entrada principal. Inicializa todos os módulos
 * quando o DOM estiver completamente carregado.
 */
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initMenuMobile();
  initRevealAnimations();
  initModalClickFora();
  initEscapeKey();
  initWhatsAppFloat();
  renderCheckboxes();

  console.log("✨ Cristiane Sant'Ana Beauty Hair — Carregado com sucesso!");
});
