const db = require('../db/connection');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');


exports.uploadProfileImage = async (req, res) => {
  try {
    const userId = req.body.user_id;
    const base64Image = req.body.image;

    if (!userId || !base64Image) {
      return res.status(400).json({ error: 'ID do usuário e imagem são obrigatórios.' });
    }

    // Converte a string base64 em um buffer (BLOB)
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, ''); // Remove o prefixo
    const imageBuffer = Buffer.from(base64Data, 'base64'); // Converte para buffer

    // Atualiza a primeira imagem do usuário (imagem de perfil)
    const [result] = await db.query(
      'UPDATE user_images SET image = ? WHERE user_id = ? ORDER BY id ASC LIMIT 1',
      [imageBuffer, userId]
    );

    return res.json({ message: 'Imagem de perfil atualizada com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar a imagem de perfil:', error);
    return res.status(500).json({ error: 'Erro ao atualizar a imagem de perfil.' });
  }
};
exports.uploadImages = async (req, res) => {
  const userId = req.body.user_id;
  const imageFiles = req.files; // Array de arquivos de imagem

  if (!userId || !imageFiles || imageFiles.length === 0) {
    return res.status(400).json({ error: 'ID do usuário e imagens são obrigatórios.' });
  }

  try {
    const imageIds = [];

    // Processa cada imagem
    for (const imageFile of imageFiles) {
      // Converte a imagem para BLOB
      const imageBuffer = imageFile.buffer;

      // Insere a imagem no banco de dados
      const [result] = await db.query(
        'INSERT INTO user_images (user_id, image) VALUES (?, ?)',
        [userId, imageBuffer]
      );

      imageIds.push(result.insertId); // Armazena o ID da imagem inserida
    }

    return res.json({ message: 'Imagens enviadas com sucesso.', imageIds });
  } catch (error) {
    console.error('Erro ao fazer upload das imagens:', error);
    return res.status(500).json({ error: 'Erro ao fazer upload das imagens.' });
  }
};

// Função para buscar as imagens de um usuário
exports.getUserImages = async (req, res) => {
    const userId = req.params.userId;
    try {
        const [images] = await db.query('SELECT id, image FROM user_images WHERE user_id = ?', [userId]);

        // Converte as imagens BLOB para URLs base64
        const imageUrls = images.map((image) => {
            const base64Image = Buffer.from(image.image).toString('base64');
            return `data:image/jpeg;base64,${base64Image}`;
        });

        return res.json(imageUrls);
    } catch (error) {
        console.error('Erro ao buscar imagens do usuário:', error);
        return res.status(500).json({ error: 'Erro ao buscar imagens do usuário.' });
    }
};

// Função para excluir uma imagem
exports.deleteImage = async (req, res) => {
  const { imageId } = req.params;
  const userId = req.user.id; // Obtendo ID do usuário autenticado (supondo que esteja no token)

  if (!imageId) {
      return res.status(400).json({ error: 'ID da imagem é obrigatório.' });
  }

  try {
      // Verifica se a imagem existe
      const image = await UserImage.findOne({ where: { id: imageId } });

      if (!image) {
          return res.status(404).json({ error: 'Imagem não encontrada.' });
      }

      // (Opcional) Garante que o usuário só possa excluir suas próprias imagens
      if (image.user_id !== userId) {
          return res.status(403).json({ error: 'Você não tem permissão para excluir esta imagem.' });
      }

      // Exclui a imagem
      await UserImage.destroy({ where: { id: imageId } });

      return res.json({ message: 'Imagem excluída com sucesso.' });
  } catch (error) {
      console.error('Erro ao excluir imagem:', error);
      return res.status(500).json({ error: 'Erro ao excluir imagem.' });
  }
};

// Função para atualizar o campo images na tabela users
exports.updateUserImages = async (userId) => {
    try {
        // Busca as imagens do usuário como BLOB
        const [images] = await db.query('SELECT image FROM user_images WHERE user_id = ?', [userId]);

        // Converte os BLOBs para base64
        const imageUrls = images.map((img) => `data:image/jpeg;base64,${Buffer.from(img.image).toString('base64')}`);

        // Atualiza o campo images na tabela users
        await db.query('UPDATE users SET images = ? WHERE id = ?', [JSON.stringify(imageUrls), userId]);

        console.log('Campo images atualizado com sucesso.');
    } catch (error) {
        console.error('Erro ao atualizar campo images:', error);
    }
    exports.uploadProfileImage = async (req, res) => {
      try {
        const userId = req.body.user_id;
        const imageFile = req.file;
    
        if (!userId || !imageFile) {
          return res.status(400).json({ error: 'ID do usuário e imagem são obrigatórios.' });
        }
    
        // Salva a imagem como BLOB no banco de dados
        const [result] = await db.query(
          'UPDATE user_images SET image = ? WHERE user_id = ? AND is_profile = 1',
          [imageFile.buffer, userId]
        );
    
        // Gera a URL temporária
        const imageName = `${uuidv4()}.jpg`;
        const imagePath = path.join(__dirname, '../assets/userimages', imageName);
        fs.writeFileSync(imagePath, imageFile.buffer);
    
        const imageUrl = `http://localhost:4200/src/assets/userimages/${imageName}`;
    
        return res.json({ message: 'Imagem de perfil atualizada com sucesso.', imageUrl });
      } catch (error) {
        console.error('Erro ao atualizar a imagem de perfil:', error);
        return res.status(500).json({ error: 'Erro ao atualizar a imagem de perfil.' });
      }
    };
};