const express = require('express');
const router = express.Router();
const db = require('../firebase-config');

// Criação de um Login
router.post('/', async (req, res) => {
  const { id, usuario_id, senha, email, provedor, datetime } = req.body;

  try {
    await db.collection('login').doc(id.toString()).set({
      usuario_id,
      senha,
      email,
      provedor,
      datetime
    });
    res.status(201).send('Login criado com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao criar login: ' + error.message);
  }
});

// Listagem de Logins
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('login').get();
    const logins = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(logins);
  } catch (error) {
    res.status(500).send('Erro ao listar logins: ' + error.message);
  }
});

// Atualização de um Login
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    await db.collection('login').doc(id).update(data);
    res.status(200).send('Login atualizado com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao atualizar login: ' + error.message);
  }
});

// Deleção de um Login
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.collection('login').doc(id).delete();
    res.status(200).send('Login deletado com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao deletar login: ' + error.message);
  }
});

module.exports = router;
