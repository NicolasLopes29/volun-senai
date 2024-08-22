const express = require('express');
const router = express.Router();
const db = require('../firebase-config');

// Criação de uma Advertência
router.post('/', async (req, res) => {
  const { id, usuario_id, motivo, data } = req.body;

  try {
    await db.collection('advertencias').doc(id.toString()).set({
      usuario_id,
      motivo,
      data
    });
    res.status(201).send('Advertência criada com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao criar advertência: ' + error.message);
  }
});

// Listagem de Advertências
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('advertencias').get();
    const advertencias = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(advertencias);
  } catch (error) {
    res.status(500).send('Erro ao listar advertências: ' + error.message);
  }
});

// Atualização de uma Advertência
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    await db.collection('advertencias').doc(id).update(data);
    res.status(200).send('Advertência atualizada com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao atualizar advertência: ' + error.message);
  }
});

// Deleção de uma Advertência
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.collection('advertencias').doc(id).delete();
    res.status(200).send('Advertência deletada com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao deletar advertência: ' + error.message);
  }
});

module.exports = router;
