// Servidor Express da Aplicação CRUD
// Conecta com o MySQL e serve os arquivos estáticos e rotas da API
import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { testarConexao } from './config/database';
import alunosRouter from './routes/alunos';

const app = express();
const porta = Number(process.env.PORT || 3000);
const pastaPublica = path.resolve(process.cwd(), 'public');

// Middlewares
app.use(express.json()); // Permite receber dados em formato JSON no body das requisições
app.use(express.static(pastaPublica)); // Serve os arquivos do front-end (HTML, CSS e JS)

// Rota de verificação do status da API
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', dataHora: new Date().toISOString() });
});

// Registra as rotas de alunos sob o prefixo /api
app.use('/api', alunosRouter);

// Rota principal: entrega a página inicial
app.get('/', (_req, res) => {
  res.sendFile(path.join(pastaPublica, 'index.html'));
});

// Função principal de inicialização
async function iniciarServidor(): Promise<void> {
  // 1. Testa a conexão com o banco de dados antes de subir o servidor
  await testarConexao();

  // 2. Inicia o servidor HTTP
  app.listen(porta, () => {
    console.log(` Servidor rodando com sucesso!`);
    console.log(` Acesse no navegador: http://localhost:${porta}`);
  });
}

// Inicializa a aplicação tratando possíveis erros de inicialização
iniciarServidor().catch((erro) => {
  console.error(' Falha ao inicializar o servidor:', erro);
  process.exitCode = 1;
});
