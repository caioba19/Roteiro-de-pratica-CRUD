"use strict";
// Código TypeScript do Front-end
// Gerencia a interface, eventos do usuário e chamadas à API
// Elementos da interface capturados do DOM
const formCadastro = document.querySelector('#form-cadastro');
const formBusca = document.querySelector('#form-busca');
const inputIdEdicao = document.querySelector('#id-edicao');
const inputNome = document.querySelector('#nome');
const inputEmail = document.querySelector('#email');
const inputCurso = document.querySelector('#curso');
const inputBusca = document.querySelector('#busca-nome');
const btnSalvar = document.querySelector('#btn-salvar');
const btnCancelarEdicao = document.querySelector('#btn-cancelar-edicao');
const btnLimparBusca = document.querySelector('#limpar-busca');
const tabelaAlunos = document.querySelector('#lista-alunos');
const mensagemFeedback = document.querySelector('#mensagem');
const estadoLista = document.querySelector('#estado-lista');
const boxConfirmacao = document.querySelector('#confirmacao');
const btnConfirmarExclusao = document.querySelector('#confirmar-exclusao');
const btnCancelarExclusao = document.querySelector('#cancelar-exclusao');
// Guarda o ID do aluno selecionado para exclusão
let idAlunoParaExcluir = null;
// Função para exibir mensagens com estilos (sucesso, erro ou aviso)
function exibirMensagem(elemento, texto, tipo) {
    elemento.textContent = texto;
    elemento.className = `mensagem ${tipo}`;
}
// -----------------------------------------------------------------
// 1. CARREGAR E LISTAR ALUNOS (READ)
// -----------------------------------------------------------------
async function carregarAlunos(nomeFiltro = '') {
    exibirMensagem(estadoLista, 'Carregando lista de alunos...', 'aviso');
    try {
        const url = nomeFiltro ? `/api/alunos?nome=${encodeURIComponent(nomeFiltro)}` : '/api/alunos';
        const resposta = await fetch(url);
        const dados = await resposta.json();
        if (!resposta.ok) {
            throw new Error(dados.mensagem || 'Erro ao carregar alunos.');
        }
        renderizarTabela(dados.alunos || []);
    }
    catch (erro) {
        exibirMensagem(estadoLista, erro.message || 'Erro de conexão com o servidor.', 'erro');
    }
}
// Monta as linhas da tabela HTML com os dados retornados
function renderizarTabela(alunos) {
    tabelaAlunos.innerHTML = '';
    if (alunos.length === 0) {
        exibirMensagem(estadoLista, 'Nenhum aluno encontrado.', 'aviso');
        return;
    }
    exibirMensagem(estadoLista, `Total: ${alunos.length} aluno(s) encontrado(s).`, 'aviso');
    for (const aluno of alunos) {
        const linha = document.createElement('tr');
        linha.innerHTML = `
      <td>${aluno.id}</td>
      <td>${aluno.nome}</td>
      <td>${aluno.email}</td>
      <td>${aluno.curso}</td>
      <td>
        <button type="button" class="editar" data-id="${aluno.id}">Editar</button>
        <button type="button" class="perigo" data-id="${aluno.id}">Excluir</button>
      </td>
    `;
        // Evento do botão Editar
        const btnEditar = linha.querySelector('button.editar');
        btnEditar.addEventListener('click', () => iniciarEdicao(aluno));
        // Evento do botão Excluir
        const btnExcluir = linha.querySelector('button.perigo');
        btnExcluir.addEventListener('click', () => abrirConfirmacaoExclusao(aluno.id, aluno.nome));
        tabelaAlunos.appendChild(linha);
    }
}
// -----------------------------------------------------------------
// 2. SALVAR ALUNO (CADASTRAR OU ATUALIZAR)
// -----------------------------------------------------------------
formCadastro.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const idEdicao = inputIdEdicao.value;
    const nome = inputNome.value.trim();
    const email = inputEmail.value.trim();
    const curso = inputCurso.value.trim();
    if (!nome || !email || !curso) {
        exibirMensagem(mensagemFeedback, 'Por favor, preencha todos os campos.', 'erro');
        return;
    }
    btnSalvar.disabled = true;
    try {
        // Se tiver ID preenchido no campo oculto, fazemos UPDATE (PUT); senão, CREATE (POST)
        const ehEdicao = Boolean(idEdicao);
        const url = ehEdicao ? `/api/alunos/${idEdicao}` : '/api/alunos';
        const metodo = ehEdicao ? 'PUT' : 'POST';
        const resposta = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, curso })
        });
        const dados = await resposta.json();
        if (!resposta.ok) {
            throw new Error(dados.mensagem || 'Falha ao salvar aluno.');
        }
        exibirMensagem(mensagemFeedback, dados.mensagem || 'Operação realizada com sucesso!', 'sucesso');
        // Reseta o formulário e atualiza a listagem na tela
        cancelarEdicao();
        await carregarAlunos(inputBusca.value.trim());
    }
    catch (erro) {
        exibirMensagem(mensagemFeedback, erro.message || 'Erro ao comunicar com o servidor.', 'erro');
    }
    finally {
        btnSalvar.disabled = false;
    }
});
// -----------------------------------------------------------------
// 3. MODO DE EDIÇÃO
// -----------------------------------------------------------------
function iniciarEdicao(aluno) {
    inputIdEdicao.value = String(aluno.id);
    inputNome.value = aluno.nome;
    inputEmail.value = aluno.email;
    inputCurso.value = aluno.curso;
    btnSalvar.textContent = 'Salvar Alterações';
    btnCancelarEdicao.hidden = false;
    exibirMensagem(mensagemFeedback, `Editando dados do aluno ID ${aluno.id}...`, 'aviso');
    inputNome.focus();
}
function cancelarEdicao() {
    formCadastro.reset();
    inputIdEdicao.value = '';
    btnSalvar.textContent = 'Cadastrar';
    btnCancelarEdicao.hidden = true;
}
btnCancelarEdicao.addEventListener('click', () => {
    cancelarEdicao();
    exibirMensagem(mensagemFeedback, 'Edição cancelada.', 'aviso');
});
// -----------------------------------------------------------------
// 4. EXCLUSÃO COM CONFIRMAÇÃO (DELETE)
// -----------------------------------------------------------------
function abrirConfirmacaoExclusao(id, nome) {
    idAlunoParaExcluir = id;
    const texto = document.querySelector('#texto-confirmacao');
    texto.textContent = `Tem certeza de que deseja excluir o aluno "${nome}" (ID ${id})?`;
    boxConfirmacao.hidden = false;
}
btnCancelarExclusao.addEventListener('click', () => {
    idAlunoParaExcluir = null;
    boxConfirmacao.hidden = true;
});
btnConfirmarExclusao.addEventListener('click', async () => {
    if (idAlunoParaExcluir === null)
        return;
    btnConfirmarExclusao.disabled = true;
    try {
        const resposta = await fetch(`/api/alunos/${idAlunoParaExcluir}`, {
            method: 'DELETE'
        });
        const dados = await resposta.json();
        if (!resposta.ok) {
            throw new Error(dados.mensagem || 'Erro ao excluir aluno.');
        }
        exibirMensagem(mensagemFeedback, dados.mensagem || 'Aluno excluído!', 'sucesso');
        boxConfirmacao.hidden = true;
        idAlunoParaExcluir = null;
        // Atualiza a tabela
        await carregarAlunos(inputBusca.value.trim());
    }
    catch (erro) {
        exibirMensagem(mensagemFeedback, erro.message || 'Erro ao excluir.', 'erro');
    }
    finally {
        btnConfirmarExclusao.disabled = false;
    }
});
// -----------------------------------------------------------------
// 5. PESQUISA E FILTROS
// -----------------------------------------------------------------
formBusca.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const termo = inputBusca.value.trim();
    void carregarAlunos(termo);
});
btnLimparBusca.addEventListener('click', () => {
    inputBusca.value = '';
    void carregarAlunos();
});
// Carrega os alunos ao abrir a página
void carregarAlunos();
