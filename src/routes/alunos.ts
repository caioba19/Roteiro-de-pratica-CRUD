import { Router } from 'express';
import type { Request, Response } from 'express';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../config/database';
import type { Aluno } from '../types/aluno';

const router = Router();

// Interface para tipar o retorno do SELECT no mysql2
interface AlunoRow extends RowDataPacket, Aluno {}

// Função auxiliar simples para validar formato do e-mail
function validarEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// -------------------------------------------------------------
// 1. CADASTRAR ALUNO (CREATE)
// -------------------------------------------------------------
router.post('/alunos', async (req: Request, res: Response): Promise<void> => {
  const { nome, email, curso } = req.body;

  // Validação básica dos campos obrigatórios
  if (!nome || !email || !curso) {
    res.status(400).json({ mensagem: 'Por favor, preencha todos os campos (nome, e-mail e curso).' });
    return;
  }

  const nomeLimpo = String(nome).trim();
  const emailLimpo = String(email).trim().toLowerCase();
  const cursoLimpo = String(curso).trim();

  // Validação do formato do e-mail
  if (!validarEmail(emailLimpo)) {
    res.status(400).json({ mensagem: 'Informe um endereço de e-mail válido.' });
    return;
  }

  try {
    // Usamos '?' para proteger a consulta contra ataques de SQL Injection
    const sql = 'INSERT INTO alunos (nome, email, curso) VALUES (?, ?, ?)';
    const [resultado] = await pool.execute<ResultSetHeader>(sql, [
      nomeLimpo,
      emailLimpo,
      cursoLimpo
    ]);

    res.status(201).json({
      mensagem: 'Aluno cadastrado com sucesso!',
      aluno: {
        id: resultado.insertId,
        nome: nomeLimpo,
        email: emailLimpo,
        curso: cursoLimpo
      }
    });
  } catch (erro: any) {
    console.error('Erro ao cadastrar aluno no banco:', erro);

    // Trata erro de chave única (UNIQUE) no banco de dados para e-mails repetidos
    if (erro.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ mensagem: 'Já existe um aluno cadastrado com este e-mail.' });
      return;
    }

    res.status(500).json({ mensagem: 'Erro interno ao salvar aluno no banco de dados.' });
  }
});

// -------------------------------------------------------------
// 2. CONSULTAR ALUNOS (READ)
// Permite listar todos ou filtrar por parte do nome
// -------------------------------------------------------------
router.get('/alunos', async (req: Request, res: Response): Promise<void> => {
  const buscaNome = typeof req.query.nome === 'string' ? req.query.nome.trim() : '';

  try {
    let sql = 'SELECT id, nome, email, curso FROM alunos';
    const params: string[] = [];

    // Se o usuário digitou algo na busca, filtramos com LIKE
    if (buscaNome) {
      sql += ' WHERE nome LIKE ? ORDER BY id DESC';
      params.push(`%${buscaNome}%`);
    } else {
      sql += ' ORDER BY id DESC';
    }

    const [linhas] = await pool.execute<AlunoRow[]>(sql, params);
    res.status(200).json({ alunos: linhas });
  } catch (erro) {
    console.error('Erro ao consultar alunos no banco:', erro);
    res.status(500).json({ mensagem: 'Erro ao buscar alunos no banco de dados.' });
  }
});

// -------------------------------------------------------------
// 3. ATUALIZAR DADOS DO ALUNO (UPDATE)
// -------------------------------------------------------------
router.put('/alunos/:id', async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const { nome, email, curso } = req.body;

  if (isNaN(id) || id <= 0) {
    res.status(400).json({ mensagem: 'ID de aluno inválido.' });
    return;
  }

  if (!nome || !email || !curso) {
    res.status(400).json({ mensagem: 'Preencha nome, e-mail e curso para atualizar.' });
    return;
  }

  const nomeLimpo = String(nome).trim();
  const emailLimpo = String(email).trim().toLowerCase();
  const cursoLimpo = String(curso).trim();

  if (!validarEmail(emailLimpo)) {
    res.status(400).json({ mensagem: 'Informe um e-mail válido.' });
    return;
  }

  try {
    const sql = 'UPDATE alunos SET nome = ?, email = ?, curso = ? WHERE id = ?';
    const [resultado] = await pool.execute<ResultSetHeader>(sql, [
      nomeLimpo,
      emailLimpo,
      cursoLimpo,
      id
    ]);

    if (resultado.affectedRows === 0) {
      res.status(404).json({ mensagem: 'Aluno não encontrado para atualização.' });
      return;
    }

    res.status(200).json({
      mensagem: 'Dados do aluno atualizados com sucesso!',
      aluno: { id, nome: nomeLimpo, email: emailLimpo, curso: cursoLimpo }
    });
  } catch (erro: any) {
    console.error('Erro ao atualizar aluno:', erro);

    if (erro.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ mensagem: 'Este e-mail já pertence a outro aluno.' });
      return;
    }

    res.status(500).json({ mensagem: 'Erro ao atualizar dados do aluno.' });
  }
});

// -------------------------------------------------------------
// 4. EXCLUIR ALUNO (DELETE)
// -------------------------------------------------------------
router.delete('/alunos/:id', async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    res.status(400).json({ mensagem: 'ID de aluno inválido para exclusão.' });
    return;
  }

  try {
    const sql = 'DELETE FROM alunos WHERE id = ?';
    const [resultado] = await pool.execute<ResultSetHeader>(sql, [id]);

    // Verifica se alguma linha foi de fato excluída
    if (resultado.affectedRows === 0) {
      res.status(404).json({ mensagem: 'Aluno não encontrado.' });
      return;
    }

    res.status(200).json({ mensagem: 'Aluno excluído com sucesso!' });
  } catch (erro) {
    console.error('Erro ao excluir aluno do banco:', erro);
    res.status(500).json({ mensagem: 'Erro ao excluir aluno do banco de dados.' });
  }
});

export default router;
