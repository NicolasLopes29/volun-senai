const express = require('express');
const router = express.Router();
const db = require('../firebase-config');

// Criação de um Evento Histórico
router.post('/', async (req, res) => {
  const { id, usuario_id, evento_id, data_participacao, datetime } = req.body;

  try {
    await db.collection('evento_historico').doc(id.toString()).set({
      usuario_id,
      evento_id,
      data_participacao,
      datetime
    });
    res.status(201).send('Histórico de evento criado com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao criar histórico de evento: ' + error.message);
  }
});

// Listagem de Eventos Históricos
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('evento_historico').get();
    const eventos_historicos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(eventos_historicos);
  } catch (error) {
    res.status(500).send('Erro ao listar históricos de eventos: ' + error.message);
  }
});

// Atualização de um Evento Histórico
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    await db.collection('evento_historico').doc(id).update(data);
    res.status(200).send('Histórico de evento atualizado com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao atualizar histórico de evento: ' + error.message);
  }
});

// Deleção de um Evento Histórico
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.collection('evento_historico').doc(id).delete();
    res.status(200).send('Histórico de evento deletado com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao deletar histórico de evento: ' + error.message);
  }
});

module.exports = router;
