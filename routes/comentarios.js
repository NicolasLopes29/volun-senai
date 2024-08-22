const express = require('express');
const router = express.Router();
const db = require('../firebase-config');

// Criação de um Comentário
router.post('/', async (req, res) => {
  const { id, usuario_id, evento_id, texto, datetime } = req.body;

  try {
    await db.collection('comentarios').doc(id.toString()).set({
      usuario_id,
      evento_id,
      texto,
      datetime
    });
    res.status(201).send('Comentário criado com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao criar comentário: ' + error.message);
  }
});

// Listagem de Comentários
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('comentarios').get();
    const comentarios = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(comentarios);
  } catch (error) {
    res.status(500).send('Erro ao listar comentários: ' + error.message);
  }
});

// Atualização de um Comentário
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    await db.collection('comentarios').doc(id).update(data);
    res.status(200).send('Comentário atualizado com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao atualizar comentário: ' + error.message);
  }
});

// Deleção de um Comentário
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.collection('comentarios').doc(id).delete();
    res.status(200).send('Comentário deletado com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao deletar comentário: ' + error.message);
  }
});

module.exports = router;
