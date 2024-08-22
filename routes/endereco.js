const express = require('express');
const router = express.Router();
const db = require('../firebase-config');

// Criação de um Endereço
router.post('/', async (req, res) => {
  const { id, logradouro, bairro, numero, complemento, cep, estado, cidade } = req.body;

  try {
    await db.collection('endereco').doc(id.toString()).set({
      logradouro,
      bairro,
      numero,
      complemento,
      cep,
      estado,
      cidade
    });
    res.status(201).send('Endereço criado com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao criar endereço: ' + error.message);
  }
});

// Listagem de Endereços
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('endereco').get();
    const enderecos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(enderecos);
  } catch (error) {
    res.status(500).send('Erro ao listar endereços: ' + error.message);
  }
});

// Atualização de um Endereço
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    await db.collection('endereco').doc(id).update(data);
    res.status(200).send('Endereço atualizado com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao atualizar endereço: ' + error.message);
  }
});

// Deleção de um Endereço
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.collection('endereco').doc(id).delete();
    res.status(200).send('Endereço deletado com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao deletar endereço: ' + error.message);
  }
});

module.exports = router;
