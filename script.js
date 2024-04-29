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
    const li = document.createElement('li');
    li.classList.add('tarefa');
    li.innerHTML = `<strong>${formataData(tarefa.data)}</strong>: ${tarefa.descricao} | Prioridade: ${tarefa.prioridade}`;
    li.setAttribute('id', `${tarefa.id}`);
    listaTarefas.appendChild(li);
    console.log(JSON.stringify(tarefa));
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
    const dataEscolhida = new Date(data);
    const dia = dataEscolhida.getDate().toString().padStart(2, '0');
    const mes = (dataEscolhida.getMonth() + 1).toString().padStart(2, '0');
    const ano = dataEscolhida.getFullYear();
    return `${dia}/${mes}/${ano}`;
}