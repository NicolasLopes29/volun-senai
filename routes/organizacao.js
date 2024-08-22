const express = require('express');
const router = express.Router();
const db = require('../firebase-config');

// Criação de uma Organização
router.post('/', async (req, res) => {
  const { id, nome_org, razao_social, endereco_id, cnpj, telefone, ddd, associados_array_id, datetime } = req.body;

  try {
    await db.collection('organizacao').doc(id.toString()).set({
      nome_org,
      razao_social,
      endereco_id,
      cnpj,
      telefone,
      ddd,
      associados_array_id,
      datetime
    });
    res.status(201).send('Organização criada com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao criar organização: ' + error.message);
  }
});

// Listagem de Organizações
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('organizacao').get();
    const organizacoes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(organizacoes);
  } catch (error) {
    res.status(500).send('Erro ao listar organizações: ' + error.message);
  }
});

// Atualização de uma Organização
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    await db.collection('organizacao').doc(id).update(data);
    res.status(200).send('Organização atualizada com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao atualizar organização: ' + error.message);
  }
});

// Deleção de uma Organização
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.collection('organizacao').doc(id).delete();
    res.status(200).send('Organização deletada com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao deletar organização: ' + error.message);
  }
});

module.exports = router;
