const express = require('express');
const router = express.Router();
const db = require('../firebase-config');

// Criação de um Usuário
router.post('/', async (req, res) => {
  const { id, foto_perfil, nome, sobrenome, cpf, ddd, telefone, endereco_id, moderator_access, data_nascimento, latitude_locate, longitude_locate, suspenso_user, total_advertencia, datetime } = req.body;

  try {
    await db.collection('usuarios').doc(id.toString()).set({
      foto_perfil,
      nome,
      sobrenome,
      cpf,
      ddd,
      telefone,
      endereco_id,
      moderator_access,
      data_nascimento,
      suspenso_user,
      total_advertencia,
      datetime
    });
    res.status(201).send('Usuário criado com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao criar usuário: ' + error.message);
  }
});

// Listagem de Usuários
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('usuarios').get();
    const usuarios = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).send('Erro ao listar usuários: ' + error.message);
  }
});

// Atualização de um Usuário
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    await db.collection('usuarios').doc(id).update(data);
    res.status(200).send('Usuário atualizado com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao atualizar usuário: ' + error.message);
  }
});

// Deleção de um Usuário
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.collection('usuarios').doc(id).delete();
    res.status(200).send('Usuário deletado com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao deletar usuário: ' + error.message);
  }
});

module.exports = router;
