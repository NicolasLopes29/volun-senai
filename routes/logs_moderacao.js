const express = require('express');
const router = express.Router();
const db = require('../firebase-config');

// Criação de um Log de Moderação
router.post('/', async (req, res) => {
  const { id, acao_moderacao_id, descricao, datetime } = req.body;

  try {
    await db.collection('logs_moderacao').doc(id.toString()).set({
      acao_moderacao_id,
      descricao,
      datetime
    });
    res.status(201).send('Log de moderação criado com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao criar log de moderação: ' + error.message);
  }
});

// Listagem de Logs de Moderação
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('logs_moderacao').get();
    const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).send('Erro ao listar logs de moderação: ' + error.message);
  }
});

// Atualização de um Log de Moderação
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    await db.collection('logs_moderacao').doc(id).update(data);
    res.status(200).send('Log de moderação atualizado com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao atualizar log de moderação: ' + error.message);
  }
});

// Deleção de um Log de Moderação
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.collection('logs_moderacao').doc(id).delete();
    res.status(200).send('Log de moderação deletado com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao deletar log de moderação: ' + error.message);
  }
});

module.exports = router;
