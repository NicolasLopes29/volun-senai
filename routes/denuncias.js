const express = require('express');
const router = express.Router();
const db = require('../firebase-config');

// Criação de uma Denúncia
router.post('/', async (req, res) => {
  const { id, usuario_id, comentario_id, evento_id, tipo_denuncia, descricao, status, datetime } = req.body;

  try {
    await db.collection('denuncias').doc(id.toString()).set({
      usuario_id,
      comentario_id,
      evento_id,
      tipo_denuncia,
      descricao,
      status,
      datetime
    });
    res.status(201).send('Denúncia criada com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao criar denúncia: ' + error.message);
  }
});

// Listagem de Denúncias
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('denuncias').get();
    const denuncias = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(denuncias);
  } catch (error) {
    res.status(500).send('Erro ao listar denúncias: ' + error.message);
  }
});

// Atualização de uma Denúncia
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    await db.collection('denuncias').doc(id).update(data);
    res.status(200).send('Denúncia atualizada com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao atualizar denúncia: ' + error.message);
  }
});

// Deleção de uma Denúncia
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.collection('denuncias').doc(id).delete();
    res.status(200).send('Denúncia deletada com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao deletar denúncia: ' + error.message);
  }
});

module.exports = router;
