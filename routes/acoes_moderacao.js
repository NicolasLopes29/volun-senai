const express = require('express');
const router = express.Router();
const db = require('../firebase-config');

// Criação de uma Ação de Moderação
router.post('/', async (req, res) => {
  const { id, moderador_id, denuncia_id, acao, descricao, datetime } = req.body;

  try {
    await db.collection('acoes_moderacao').doc(id.toString()).set({
      moderador_id,
      denuncia_id,
      acao,
      descricao,
      datetime
    });
    res.status(201).send('Ação de moderação criada com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao criar ação de moderação: ' + error.message);
  }
});

// Listagem de Ações de Moderação
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('acoes_moderacao').get();
    const acoes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(acoes);
  } catch (error) {
    res.status(500).send('Erro ao listar ações de moderação: ' + error.message);
  }
});

// Atualização de uma Ação de Moderação
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    await db.collection('acoes_moderacao').doc(id).update(data);
    res.status(200).send('Ação de moderação atualizada com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao atualizar ação de moderação: ' + error.message);
  }
});

// Deleção de uma Ação de Moderação
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.collection('acoes_moderacao').doc(id).delete();
    res.status(200).send('Ação de moderação deletada com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao deletar ação de moderação: ' + error.message);
  }
});

module.exports = router;

