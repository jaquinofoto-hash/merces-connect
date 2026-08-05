const app = document.getElementById('app');
const nav = document.getElementById('bottom-nav');
let currentRole = 'parent';
let currentRoute = 'home';

const data = {
  comunicados: [
    {id:1,titulo:'Reunião de Pais e Responsáveis',origem:'Coordenação Pedagógica',data:'Hoje, 09:30',novo:true,confirmado:false,texto:'Prezadas famílias, informamos que nossa reunião acontecerá na próxima quinta-feira, às 18h30, no auditório da escola. Contamos com a presença de todos.'},
    {id:2,titulo:'Material para a aula de Ciências',origem:'Professora Ana',data:'Ontem, 16:15',novo:true,confirmado:false,texto:'Para a próxima aula, os alunos deverão trazer uma garrafa PET limpa e sem rótulo.'},
    {id:3,titulo:'Calendário de avaliações',origem:'Coordenação',data:'29/07/2026',novo:false,confirmado:true,texto:'O calendário de avaliações do trimestre já está disponível para consulta no Mercês Connect.'}
  ],
  conversas: [
    {id:1,nome:'Coordenação Pedagógica',sigla:'CP',msg:'Obrigada pelo retorno!',hora:'10:42',novo:true},
    {id:2,nome:'Secretaria',sigla:'SE',msg:'Seu documento está disponível.',hora:'Ontem',novo:false},
    {id:3,nome:'Orientação Educacional',sigla:'OE',msg:'Podemos conversar amanhã às 14h.',hora:'31/07',novo:false}
  ]
};

const parentNav = [
  ['home','⌂','Início'],['comunicados','▤','Comunicados'],['conversas','💬','Conversas'],['agenda','▣','Agenda'],['perfil','◉','Perfil']
];
const schoolNav = [
  ['dashboard','⌂','Painel'],['school-comunicados','▤','Comunicados'],['inbox','💬','Mensagens'],['school-more','◉','Mais']
];

function renderNav(){
  const items = currentRole === 'parent' ? parentNav : schoolNav;
  nav.className = `bottom-nav ${currentRole}`;
  nav.innerHTML = items.map(([route,icon,label])=>`<button class="nav-item ${currentRoute===route?'active':''}" onclick="setRoute('${route}')"><span>${icon}</span><small>${label}</small></button>`).join('');
}

function switchRole(role){
  currentRole = role;
  document.getElementById('role-parent').classList.toggle('active',role==='parent');
  document.getElementById('role-school').classList.toggle('active',role==='school');
  setRoute(role==='parent'?'home':'dashboard');
  showToast(role==='parent'?'Visão do responsável.':'Visão da escola/coordenação.');
}

function setRoute(route){
  currentRoute = route;
  renderNav();
  const fn = routes[route];
  if(fn) fn();
  window.scrollTo({top:0,behavior:'smooth'});
}

function pageHeader(title,back,action=''){
  return `<div class="page-header"><button class="back" onclick="setRoute('${back}')">←</button><h2>${title}</h2>${action}</div>`;
}

function home(){
  app.innerHTML = `<section class="page">
    <div class="greeting"><h2>Boa tarde, Maria! 👋</h2><p>Aqui está o que importa hoje.</p></div>
    <div class="hero-card"><button class="student-card" onclick="showToast('Pedro Henrique • Turma 700 selecionado')"><div class="avatar">PH</div><div><strong>Pedro Henrique</strong><small>Turma 700 • Ensino Fundamental II</small></div><span class="chevron">›</span></button></div>
    <div class="summary-grid">
      <button class="summary-card" onclick="setRoute('comunicados')"><span class="icon">📢</span><strong>2</strong><span>comunicados novos</span></button>
      <button class="summary-card" onclick="setRoute('conversas')"><span class="icon">💬</span><strong>1</strong><span>mensagem nova</span></button>
      <button class="summary-card" onclick="setRoute('agenda')"><span class="icon">📅</span><strong>3</strong><span>compromissos próximos</span></button>
      <button class="summary-card" onclick="documents()"><span class="icon">📄</span><strong>1</strong><span>autorização pendente</span></button>
    </div>
    <div class="section-title"><h3>Último comunicado</h3><button class="link-button" onclick="setRoute('comunicados')">VER TODOS</button></div>
    <article class="content-card clickable" onclick="comunicadoDetail(1)"><div class="meta"><span class="badge new">NOVO</span><span>Hoje, 09:30</span></div><h4>Reunião de Pais e Responsáveis</h4><p>Encontro na próxima quinta-feira, às 18h30, no auditório.</p></article>
    <div class="section-title"><h3>Próximo compromisso</h3></div>
    <article class="event-card"><div class="date-box">06<small>AGO</small></div><div><h4>Reunião de Pais</h4><p>18h30 • Auditório da escola</p></div></article>
  </section>`;
}

function comunicados(){
  app.innerHTML = `<section class="page">${pageHeader('Comunicados','home')}<div class="list">${data.comunicados.map(c=>`<button class="content-card clickable" onclick="comunicadoDetail(${c.id})" style="text-align:left;width:100%"><div class="meta">${c.novo?'<span class="badge new">NOVO</span>':'<span class="badge ok">LIDO</span>'}<span>${c.data}</span></div><h4>${c.titulo}</h4><p>${c.origem}</p></button>`).join('')}</div></section>`;
}

function comunicadoDetail(id){
  const c=data.comunicados.find(x=>x.id===id);
  app.innerHTML=`<section class="page">${pageHeader('Comunicado','comunicados')}<article class="content-card"><div class="meta"><span class="badge">${c.origem}</span><span>${c.data}</span></div><h4>${c.titulo}</h4><p class="detail-text">${c.texto}</p><div class="actions"><button id="readBtn" class="secondary-button" onclick="confirmRead(${id},this)">${c.confirmado?'✓ Leitura confirmada':'✓ Confirmar leitura'}</button></div><textarea id="reply" class="reply-box" placeholder="Responder à escola..."></textarea><button class="primary-button" style="margin-top:9px" onclick="sendReply()">Enviar resposta</button></article></section>`;
}

function conversas(){
  app.innerHTML=`<section class="page">${pageHeader('Conversas','home','<button class="header-action" onclick="newConversation()">+ NOVA</button>')}<div class="list">${data.conversas.map(c=>`<button class="message-card" onclick="chatDetail(${c.id})"><div class="avatar">${c.sigla}</div><div class="message-info"><strong>${c.nome}</strong><p>${c.msg}</p></div><small>${c.hora}</small>${c.novo?'<span class="unread"></span>':''}</button>`).join('')}</div></section>`;
}

function newConversation(){
  app.innerHTML=`<section class="page">${pageHeader('Nova conversa','conversas')}<div class="form-card"><label class="form-label">SETOR</label><select class="field"><option>Coordenação Pedagógica</option><option>Secretaria</option><option>Orientação Educacional</option></select><label class="form-label">ASSUNTO</label><input class="field" value="Dúvida sobre reunião"><label class="form-label">MENSAGEM</label><textarea id="newMsg" class="reply-box" placeholder="Escreva sua mensagem..."></textarea><button class="primary-button" style="margin-top:12px" onclick="demoSendConversation()">Enviar para a escola</button></div></section>`;
}

function chatDetail(id){
  const c=data.conversas.find(x=>x.id===id);
  app.innerHTML=`<section class="page">${pageHeader(c.nome,'conversas')}<div class="chat"><div class="bubble sent">Boa tarde! Gostaria de confirmar o horário da reunião.<small>10:18</small></div><div class="bubble received">Boa tarde! A reunião está confirmada para 18h30.<small>10:31</small></div><div class="bubble sent">Perfeito, obrigada!<small>10:39</small></div><div class="bubble received">${c.msg}<small>${c.hora}</small></div></div><textarea id="chatReply" class="reply-box" placeholder="Digite sua mensagem..."></textarea><button class="primary-button" style="margin-top:9px" onclick="sendChat()">Enviar</button></section>`;
}

function agenda(){
  app.innerHTML=`<section class="page">${pageHeader('Agenda','home')}<div class="list"><article class="event-card"><div class="date-box">06<small>AGO</small></div><div><h4>Reunião de Pais</h4><p>18h30 • Auditório</p></div></article><article class="event-card"><div class="date-box">11<small>AGO</small></div><div><h4>Entrega do trabalho de Ciências</h4><p>Turma 700</p></div></article><article class="event-card"><div class="date-box">14<small>AGO</small></div><div><h4>Avaliação de Matemática</h4><p>Conteúdo: unidades 4 e 5</p></div></article></div></section>`;
}

function documents(){
  currentRoute='documents'; renderNav();
  app.innerHTML=`<section class="page">${pageHeader('Documentos','home')}<div class="list"><article class="content-card"><div class="meta"><span class="badge warn">AÇÃO NECESSÁRIA</span><span>PDF</span></div><h4>Autorização para passeio</h4><p>Responder até 08/08/2026.</p><div class="actions"><button class="secondary-button" onclick="showToast('Documento aberto em modo demonstração.')">Visualizar</button><button class="primary-button" onclick="showToast('Autorização registrada com sucesso!')">Autorizar</button></div></article><article class="content-card"><div class="meta"><span class="badge ok">DISPONÍVEL</span><span>PDF</span></div><h4>Calendário Escolar 2026</h4><p>Publicado pela Secretaria.</p></article></div></section>`;
}

function perfil(){
  app.innerHTML=`<section class="page">${pageHeader('Perfil','home')}<div class="profile-card"><div class="avatar">MS</div><h3>Maria da Silva</h3><p>Responsável por Pedro Henrique</p></div><div class="profile-menu"><button onclick="showToast('Cadastro protegido: dados básicos editáveis.')">👤 Meus dados</button><button onclick="showToast('Notificações importantes estão ativadas.')">🔔 Preferências de notificação</button><button onclick="showToast('Central de ajuda em desenvolvimento.')">❓ Ajuda e suporte</button><button onclick="showToast('Modo demonstração: saída desativada.')">↪ Sair</button></div></section>`;
}

function dashboard(){
  app.innerHTML=`<section class="page"><div class="greeting"><h2>Boa tarde, Coordenação! 👋</h2><p>Uma visão rápida da comunicação com as famílias.</p></div><div class="metrics"><article class="metric-card"><small>LEITURAS HOJE</small><strong>94%</strong><span>↑ boa adesão</span></article><article class="metric-card"><small>CONVERSAS ABERTAS</small><strong>7</strong><span>3 aguardam escola</span></article><article class="metric-card"><small>RESPONSÁVEIS ATIVOS</small><strong>428</strong><span>últimos 30 dias</span></article><article class="metric-card"><small>COMUNICADOS</small><strong>18</strong><span>neste mês</span></article></div><button class="primary-button" onclick="createNotice()">＋ Criar novo comunicado</button><div class="section-title"><h3>Comunicado em destaque</h3><button class="link-button" onclick="readReport()">RELATÓRIO</button></div><article class="content-card clickable" onclick="readReport()"><div class="meta"><span class="badge new">PUBLICADO HOJE</span><span>Turma 700</span></div><h4>Reunião de Pais e Responsáveis</h4><p>Enviado para 32 responsáveis.</p><div class="progress-row"><div class="progress-label"><span>Confirmações de leitura</span><strong>28 de 32</strong></div><div class="progress"><div style="width:87.5%"></div></div></div></article><div class="section-title"><h3>Mensagens recentes</h3><button class="link-button" onclick="setRoute('inbox')">VER CAIXA</button></div><button class="message-card" onclick="setRoute('inbox')"><div class="avatar school">MS</div><div class="message-info"><strong>Maria da Silva</strong><p>Dúvida sobre o horário da reunião.</p></div><small>10:18</small><span class="unread"></span></button></section>`;
}

function schoolComunicados(){
  app.innerHTML=`<section class="page">${pageHeader('Comunicados','dashboard','<button class="header-action" onclick="createNotice()">+ NOVO</button>')}<div class="list"><article class="content-card clickable" onclick="readReport()"><div class="meta"><span class="badge ok">PUBLICADO</span><span>Hoje, 09:30</span></div><h4>Reunião de Pais e Responsáveis</h4><p>Turma 700 • 28/32 confirmações</p></article><article class="content-card"><div class="meta"><span class="badge ok">PUBLICADO</span><span>Ontem</span></div><h4>Material para a aula de Ciências</h4><p>Turma 700 • 30/32 visualizações</p></article><article class="content-card"><div class="meta"><span class="badge warn">RASCUNHO</span><span>Não enviado</span></div><h4>Orientações para a Feira de Ciências</h4><p>Ensino Fundamental II</p></article></div></section>`;
}

function createNotice(){
  app.innerHTML=`<section class="page">${pageHeader('Novo comunicado','school-comunicados')}<div class="form-card"><label class="form-label">DESTINATÁRIOS</label><select class="field"><option>Turma 700</option><option>Ensino Fundamental II</option><option>Toda a escola</option><option>Aluno específico</option></select><label class="form-label">TÍTULO</label><input id="noticeTitle" class="field" value="Lembrete — Reunião de Pais"><label class="form-label">MENSAGEM</label><textarea id="noticeText" class="reply-box">Prezadas famílias, lembramos que nossa reunião acontecerá na quinta-feira, às 18h30, no auditório.</textarea><label class="checkbox-row"><input id="requireRead" type="checkbox" checked> Solicitar confirmação de leitura</label><button class="primary-button" style="margin-top:14px" onclick="publishNotice()">Publicar comunicado</button><button class="secondary-button" style="margin-top:8px" onclick="showToast('Rascunho salvo.')">Salvar rascunho</button></div></section>`;
}

function publishNotice(){
  app.innerHTML=`<section class="page">${pageHeader('Comunicado publicado','school-comunicados')}<div class="form-card success-state"><div class="big-check">✓</div><h3>Enviado com sucesso!</h3><p>O comunicado foi publicado para a Turma 700. Os responsáveis receberão uma notificação.</p><button class="primary-button" onclick="readReport()">Acompanhar confirmações</button><button class="secondary-button" style="margin-top:8px" onclick="setRoute('dashboard')">Voltar ao painel</button></div></section>`;
}

function readReport(){
  app.innerHTML=`<section class="page">${pageHeader('Confirmações','school-comunicados')}<article class="content-card"><div class="meta"><span class="badge">TURMA 700</span><span>Enviado hoje, 09:30</span></div><h4>Reunião de Pais e Responsáveis</h4><div class="progress-row"><div class="progress-label"><span>Confirmaram leitura</span><strong>28 / 32</strong></div><div class="progress"><div style="width:87.5%"></div></div></div></article><div class="section-title"><h3>Responsáveis</h3><button class="link-button" onclick="showToast('Filtro: todos os responsáveis.')">FILTRAR</button></div><div class="content-card read-list"><div class="read-person"><div class="mini">MS</div><div><strong>Maria da Silva</strong><small>Pedro Henrique • 700</small></div><span class="status-dot ok">✓ Confirmado</span></div><div class="read-person"><div class="mini">CR</div><div><strong>Carlos Ribeiro</strong><small>Luísa Ribeiro • 700</small></div><span class="status-dot ok">✓ Confirmado</span></div><div class="read-person"><div class="mini">AF</div><div><strong>Ana Ferreira</strong><small>Gustavo Ferreira • 700</small></div><span class="status-dot pending">○ Pendente</span></div><div class="read-person"><div class="mini">JM</div><div><strong>João Martins</strong><small>Helena Martins • 700</small></div><span class="status-dot pending">○ Pendente</span></div></div></section>`;
}

function inbox(){
  app.innerHTML=`<section class="page">${pageHeader('Mensagens','dashboard')}<div class="list"><button class="message-card" onclick="schoolChat()"><div class="avatar school">MS</div><div class="message-info"><strong>Maria da Silva</strong><p>Dúvida sobre o horário da reunião.</p></div><small>10:18</small><span class="unread"></span></button><button class="message-card" onclick="showToast('Conversa aberta em modo demonstração.')"><div class="avatar school">JP</div><div class="message-info"><strong>José Pereira</strong><p>Gostaria de atualizar meu telefone.</p></div><small>09:54</small></button><button class="message-card" onclick="showToast('Conversa aberta em modo demonstração.')"><div class="avatar school">LM</div><div class="message-info"><strong>Luciana Moraes</strong><p>Obrigada pelo atendimento.</p></div><small>Ontem</small></button></div></section>`;
}

function schoolChat(){
  app.innerHTML=`<section class="page">${pageHeader('Maria da Silva','inbox')}<div class="meta"><span class="badge">PEDRO HENRIQUE • 700</span><span>Coordenação</span></div><div class="chat"><div class="bubble received">Boa tarde! Gostaria de confirmar o horário da reunião.<small>10:18</small></div><div class="bubble sent">Boa tarde, Maria! A reunião está confirmada para 18h30, no auditório.<small>10:31</small></div><div class="bubble received">Perfeito, obrigada!<small>10:39</small></div></div><textarea id="schoolReply" class="reply-box" placeholder="Responder como Coordenação..."></textarea><button class="primary-button" style="margin-top:9px" onclick="sendSchoolChat()">Enviar resposta</button><button class="secondary-button" style="margin-top:8px" onclick="showToast('Conversa encaminhada à professora responsável.')">Encaminhar internamente</button></section>`;
}

function schoolMore(){
  app.innerHTML=`<section class="page">${pageHeader('Mais','dashboard')}<div class="profile-card"><div class="avatar school">CP</div><h3>Coordenação Pedagógica</h3><p>Perfil administrativo • Mercês Connect</p></div><div class="profile-menu"><button onclick="showToast('Gestão de usuários prevista para o MVP.')">👥 Usuários e turmas</button><button onclick="showToast('Agenda administrativa em desenvolvimento.')">📅 Eventos e agenda</button><button onclick="showToast('Documentos institucionais em desenvolvimento.')">📄 Documentos</button><button onclick="showToast('Relatórios de comunicação disponíveis por módulo.')">📊 Relatórios</button></div></section>`;
}

function confirmRead(id,button){ const c=data.comunicados.find(x=>x.id===id);c.confirmado=true;c.novo=false;button.textContent='✓ Leitura confirmada';button.style.color='var(--success)';button.disabled=true;showToast('Leitura confirmada. A escola já consegue visualizar.'); }
function sendReply(){const f=document.getElementById('reply');if(!f.value.trim())return showToast('Digite uma resposta primeiro.');f.value='';showToast('Resposta enviada para a escola.');}
function sendChat(){const f=document.getElementById('chatReply');if(!f.value.trim())return showToast('Digite uma mensagem primeiro.');f.value='';showToast('Mensagem enviada.');}
function sendSchoolChat(){const f=document.getElementById('schoolReply');if(!f.value.trim())return showToast('Digite uma resposta primeiro.');f.value='';showToast('Resposta enviada e registrada no histórico.');}
function demoSendConversation(){const f=document.getElementById('newMsg');if(!f.value.trim())return showToast('Digite a mensagem.');showToast('Conversa enviada à Coordenação.');setTimeout(()=>setRoute('conversas'),700);}
function showNotifications(){showToast(currentRole==='parent'?'2 novidades: comunicado e mensagem da Coordenação.':'2 alertas: conversa nova e confirmação pendente.');}
function showToast(message){const t=document.getElementById('toast');t.textContent=message;t.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove('show'),2300);}

const routes={home,comunicados,conversas,agenda,perfil,dashboard,'school-comunicados':schoolComunicados,inbox,'school-more':schoolMore};
setRoute('home');
