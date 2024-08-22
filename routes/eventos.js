const express = require('express');
const router = express.Router();
const db = require('../firebase-config');

// Criação de um Evento
router.post('/', async (req, res) => {
  const { id, titulo, descricao, tags, data_hora_inicio, data_hora_fim, vagas_limite, endereco_id, datetime } = req.body;

  try {
    await db.collection('eventos').doc(id.toString()).set({
      titulo,
      descricao,
      tags,
      data_hora_inicio,
      data_hora_fim,
      vagas_limite,
      endereco_id,
      datetime
    });
    res.status(201).send('Evento criado com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao criar evento: ' + error.message);
  }
});

// Listagem de Eventos
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('eventos').get();
    const eventos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(eventos);
  } catch (error) {
    res.status(500).send('Erro ao listar eventos: ' + error.message);
  }
});

// Atualização de um Evento
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    await db.collection('eventos').doc(id).update(data);
    res.status(200).send('Evento atualizado com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao atualizar evento: ' + error.message);
  }
});

// Deleção de um Evento
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.collection('eventos').doc(id).delete();
    res.status(200).send('Evento deletado com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao deletar evento: ' + error.message);
  }
});

module.exports = router;
