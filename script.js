class Tarefa {
    constructor(id, descricao, data, comentario, data_criacao, prioridade, notificacao) {
        this.id = id;
        this.descricao = descricao;
        this.data = data;
        this.comentario = comentario;
        this.data_criacao = data_criacao;
        this.prioridade = prioridade;
        this.notificacao = notificacao;
    }
}

const formTarefa = document.getElementById('formTarefa');
const listaTarefas = document.getElementById('listaTarefas');
const descricao = document.getElementById('descricao');
const data = document.getElementById('data');
const comentario = document.getElementById('comentario');
const data_criacao = document.getElementById('data_criacao');
const prioridade = document.getElementById('prioridade');
const notificacao = document.getElementById('notificacao');
const botaoSalvar = document.getElementById('adicionar');

const avisoLista = document.getElementById('avisoLista');
const opcaoOrdenar = document.getElementById('opcaoOrdenar');
const ordem = document.getElementById('ordem');

setDataInicial();

const listaDeTarefas = [];

formTarefa.addEventListener('submit', function (event) {
    event.preventDefault();

    const idTarefa = gerarIdTarefa(); // Gerar ID pseudoaleatório
    const tarefa = new Tarefa(idTarefa, descricao.value, data.value, comentario.value, data_criacao.value, prioridade.value, notificacao.checked);
    listaDeTarefas.push(tarefa);
    adicionarTarefaNaLista();
    resetForm();
});

function resetForm() {
    formTarefa.reset();
    setDataInicial();
}

function adicionarTarefaNaLista() {
    const tarefa = listaDeTarefas.slice(-1)[0]; //pega o ultimo elemento da lista
    const card = criarCard(tarefa);
    listaTarefas.appendChild(card);
    console.log(JSON.stringify(tarefa));
    
    // Verifica que a lista não está mais vazia e remove o aviso
    const listaVazia = verificarListaTarefas();
    if(!listaVazia) {
        avisoLista.style.display = "none";
        ordem.selectedIndex = 0;
        opcaoOrdenar.removeAttribute('style');
    }
}

function criarCard(tarefa) {
    const card = document.createElement('div');
    card.classList.add('tarefa');
    card.classList.add('card');
    card.setAttribute('id', `${tarefa.id}`);

    const card_header = document.createElement('div');
    card_header.classList.add('card-header');
    card_header.innerHTML = `<strong>${formataData(tarefa.data)}</strong>: ${tarefa.descricao} | Prioridade: ${tarefa.prioridade}`;

    const button_toggle = document.createElement('button');
    button_toggle.classList.add('btn');
    button_toggle.classList.add('btn-secondary');
    button_toggle.classList.add('btn-sm');
    button_toggle.setAttribute('type', 'button');
    button_toggle.setAttribute('data-bs-toggle', 'collapse');
    button_toggle.setAttribute('data-bs-target', `#detalhes${tarefa.id}`);
    button_toggle.setAttribute('aria-expanded', 'false');
    button_toggle.setAttribute('aria-controls', `detalhes${tarefa.id}`);
    button_toggle.innerHTML = "Expandir";

    const card_body = document.createElement('div');
    card_body.classList.add('collapse');
    card_body.classList.add('card-body');
    card_body.setAttribute('id', `detalhes${tarefa.id}`);
    card_body.innerHTML = `<p class = "card-text">Data de criação: ${formataData(tarefa.data_criacao)}</p>
                           <p class = "card-text">${tarefa.comentario}</p>`;
    
    const button_remove = document.createElement('button');
    button_remove.classList.add('btn');
    button_remove.classList.add('btn-danger');
    button_remove.setAttribute('type', 'button');
    button_remove.setAttribute('onclick', `removerTarefa(${tarefa.id})`);
    button_remove.innerHTML = "Remover";

    const button_edit = document.createElement('button');
    button_edit.classList.add('btn');
    button_edit.classList.add('btn-primary');
    button_edit.setAttribute('type', 'button');
    button_edit.setAttribute('onclick', `editarTarefa(${tarefa.id})`);
    button_edit.innerHTML = "Editar";

    card_header.appendChild(button_toggle);
    card_body.appendChild(button_remove);
    card_body.appendChild(button_edit);
    card.appendChild(card_header);
    card.appendChild(card_body);

    return card;
}

function removerTarefa(idTarefa) {
    console.log(`Removendo tarefa ${idTarefa}`);
    const tarefa = document.getElementById(idTarefa);
    tarefa.remove();

    // Verifica se a lista está vazia para exibir ou não o aviso e a opção de ordenação
    const listaVazia = verificarListaTarefas();
    if(listaVazia) {
        avisoLista.style.display = "block";
        opcaoOrdenar.style.display = "none";
    }
}

function verificarListaTarefas() {
    return listaTarefas.childElementCount === 0;
}

function editarTarefa(idTarefa) {
    console.log(`Editando tarefa ${idTarefa}`);
    // Encontrar a tarefa pelo id
    const tarefaEncontrada = listaDeTarefas.find(tarefa => tarefa.id === idTarefa);

    // Carregar os atributos dela nos campos do formulário
    descricao.value = tarefaEncontrada.descricao;
    data.value = tarefaEncontrada.data;
    comentario.value = tarefaEncontrada.comentario;
    prioridade.value = tarefaEncontrada.prioridade;
    data_criacao.value = tarefaEncontrada.data_criacao;
    notificacao.checked = tarefaEncontrada.notificacao;

    // Alterar a função do botão "adicionar tarefa" pra invocar outra função
    botaoSalvar.setAttribute('type', 'button');
    botaoSalvar.setAttribute('onclick', `salvarTarefa(${idTarefa})`);
}

function salvarTarefa(idTarefa) {
    // Encontrar a tarefa pelo id na lista aki do js
    let tarefaEncontrada = listaDeTarefas.find(tarefa => tarefa.id === idTarefa);

    // Alterar os valores da tarefa
    tarefaEncontrada = new Tarefa(idTarefa, descricao.value, data.value, comentario.value, data_criacao.value, prioridade.value, notificacao.checked);
    
    // Alterar a visualização da tarefa na listagem da página
    const atualCardTarefa = document.getElementById(idTarefa);
    atualCardTarefa.setAttribute('id', 'cardParaRemover');
    const novoCardTarefa = criarCard(tarefaEncontrada);
    listaTarefas.insertBefore(novoCardTarefa, atualCardTarefa);
    atualCardTarefa.remove();
    resetForm();
    console.log(JSON.stringify(tarefaEncontrada));

    // Voltar o botão ao normal
    botaoSalvar.removeAttribute('onclick');
    botaoSalvar.setAttribute('type', 'submit');
}

function gerarIdTarefa() {
    // Gera um ID pseudoaleatório usando Math.random() e Date.now()
    return Math.floor(Math.random() * 9999) + 1;
}

function setDataInicial() {
    const dataInicial = new Date();
    const dataFormatada = dataInicial.toISOString().split('T')[0];
    data.value = dataFormatada;
    data_criacao.value = dataFormatada;
}

function formataData(data) {
    const dataEscolhida = new Date(data+"T12:00:00");
    const dia = dataEscolhida.getDate().toString().padStart(2, '0');
    const mes = (dataEscolhida.getMonth() + 1).toString().padStart(2, '0');
    const ano = dataEscolhida.getFullYear();
    return `${dia}/${mes}/${ano}`;
}