// Configuração da conexão com o banco de dados MySQL
// Utiliza o mysql2/promise para permitir o uso de async/await
import 'dotenv/config';
import mysql from 'mysql2/promise';

// Criamos o pool de conexões reutilizável para melhorar a performance da aplicação
export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'aula_mysql',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Função para testar a conexão logo na inicialização do servidor
export async function testarConexao(): Promise<void> {
  try {
    const conexao = await pool.getConnection();
    console.log(' Conexão com o banco de dados MySQL realizada com sucesso!');
    conexao.release(); // Libera a conexão de volta para o pool
  } catch (erro) {
    console.error(' Erro ao conectar no MySQL. Verifique o XAMPP e o arquivo .env:', erro);
    throw erro;
  }
}
