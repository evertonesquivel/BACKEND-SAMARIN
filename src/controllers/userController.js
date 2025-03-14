// src/controllers/userController.js
const db = require('../db/connection');
const jwt = require('jsonwebtoken');
const Location = require('../models/location');
const bcrypt = require('bcrypt');

exports.hello =  (req, res) => {
    res.send('Hello World, API!');
}

// Recupera todos os usuários
exports.getAllUsers = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM users'); // Ajuste conforme sua tabela
        return res.json(results);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar usuários.' });
    }
};

// Recupera um usuário pelo ID
exports.getUserById = async (req, res) => {
    const userId = req.params.id;
    try {
        const [results] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        return res.json(results[0]);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar o usuário.' });
    }
};


// Recupera o perfil do usuário autenticado
exports.getUserProfile = async (req, res) => {
    const userId = req.user.id; // O ID do usuário foi adicionado ao req.user pelo middleware
    try {
        const [user] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        return res.json(user);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao buscar perfil' });
    }
};


// Função para registrar like ou dislike
exports.likeOrDislike = async (req, res) => {
    const { userId, targetUserId, like } = req.body;
  
    try {
      // Registra o like ou dislike no banco de dados
      const [insertResult] = await db.query('INSERT INTO user_likes (user_id, liked_user_id, is_like) VALUES (?, ?, ?)', [userId, targetUserId, like]);
      const likeId = insertResult.insertId; // Obtém o ID do like inserido
  
      // Verifica se o outro usuário já deu like
      const [rows] = await db.query('SELECT * FROM user_likes WHERE user_id = ? AND liked_user_id = ? AND is_like = TRUE', [targetUserId, userId]);
  
      if (rows.length > 0) {
        // Se o outro usuário já deu like, é um like mútuo
        const mutualLikeId = rows[0].id;
  
        // Insere na tabela Matchs
        await db.query(
          'INSERT INTO Matchs (matcher_id, matchee_id, matcher_like_id, matchee_like_id, date) VALUES (?, ?, ?, ?, ?)', 
          [userId, targetUserId, likeId, mutualLikeId, new Date()]
        );
  
        return res.json({ isMutual: true });
      }
  
      // Se não, apenas retorna que foi registrado
      return res.json({ isMutual: false });
    } catch (error) {
      console.error('Erro ao registrar like ou dislike:', error);
      return res.status(500).json({ message: 'Erro ao registrar like ou dislike' });
    }
  };
  // Função para obter a localização do usuário autenticado
 
exports.getUserLocation = async (req, res) => {
    try {
        const userId = req.body.id; // Obtendo o ID do usuário do corpo da solicitação

        // Certifique-se de que o ID do usuário foi enviado
        if (!userId) {
            return res.status(400).json({ message: "User  ID is required." });
        }

        // Buscando a localização do usuário no banco de dados
        const location = await Location.findOne({
            where: { users_id: userId } // Usando o ID do usuário para buscar a localização
        });

        if (!location) {
            return res.status(404).json({ message: "Location not found." });
        }

        // Retornando a localização encontrada
        res.status(200).json(location);
    } catch (error) {
        console.error("Error retrieving location:", error);
        res.status(500).json({ message: "Error retrieving location." });
    }
};
// Função para atualizar o perfil do usuário
// src/controllers/userController.js

exports.updateUserProfile = async (req, res) => {
    const userId = req.user.id; // Obtém o ID do usuário autenticado
    const updatedData = req.body; // Dados atualizados enviados pelo frontend

    try {
        // Verifica se o usuário existe
        const [user] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (user.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        // Campos permitidos para atualização
        const allowedFields = [
            'name', 'surname', 'bio', 'sexual_orientation', 'gender_identity',
            'interest', 'profession', 'pronouns', 'min_age_interest', 'max_age_interest',
            'personality', 'hobbies', 'specific_interests', 'relationship_types'
        ];

        // Prepara a query de atualização
        const updateQuery = [];
        const updateValues = [];

        for (const field of allowedFields) {
            if (updatedData[field] !== undefined) {
                // Trata campos que devem ser armazenados como JSON
                if (field === 'interest' || field === 'hobbies') {
                    // Converte strings separadas por vírgulas em arrays JSON
                    if (typeof updatedData[field] === 'string') {
                        updatedData[field] = updatedData[field].split(',').map(item => item.trim());
                    }
                    // Garante que o valor seja um array antes de converter para JSON
                    if (Array.isArray(updatedData[field])) {
                        updateQuery.push(`${field} = ?`);
                        updateValues.push(JSON.stringify(updatedData[field]));
                    } else {
                        console.warn(`Campo ${field} não é um array válido. Ignorando.`);
                    }
                } else {
                    // Campos normais (não JSON)
                    updateQuery.push(`${field} = ?`);
                    updateValues.push(updatedData[field]);
                }
            }
        }

        if (updateQuery.length === 0) {
            return res.status(400).json({ error: 'Nenhum dado válido para atualização.' });
        }

        updateValues.push(userId); // Adiciona o ID do usuário ao final dos valores

        // Monta a query SQL
        const query = `UPDATE users SET ${updateQuery.join(', ')} WHERE id = ?`;
        await db.query(query, updateValues);

        return res.json({ message: 'Perfil atualizado com sucesso.' });
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        return res.status(500).json({ error: 'Erro ao atualizar o perfil.' });
    }
};
// Função para calcular a distância entre dois pontos geográficos usando a fórmula de Haversine
function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Raio da Terra em km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distância em km
}

// Função para recomendar usuários
exports.recommendUsers = async (req, res) => {
    const userId = req.user.id; // ID do usuário logado

    try {
        // Recupera a localização do usuário logado
        const [userLocation] = await db.query('SELECT latitude, longitude FROM locations WHERE users_id = ?', [userId]);
        if (!userLocation.length) {
            return res.status(404).json({ error: 'Localização do usuário não encontrada.' });
        }
        const { latitude: userLat, longitude: userLon } = userLocation[0];

        // Recupera a distância de filtragem do usuário logado
        const [user] = await db.query('SELECT filter_distance FROM users WHERE id = ?', [userId]);
        const maxDistance = user[0].filter_distance || 50; // Usa 50 km como valor padrão se não houver distância definida

        // Recupera os IDs dos usuários que já tiveram match ou dislike
        const [excludedUsers] = await db.query(
            'SELECT liked_user_id FROM user_likes WHERE user_id = ? UNION SELECT user_id FROM user_likes WHERE liked_user_id = ? AND is_like = FALSE',
            [userId, userId]
        );
        const excludedUserIds = excludedUsers.map(user => user.liked_user_id);
        console.log('IDs excluídos:', excludedUserIds);

        // Filtra os usuários com base nas características e exclui o próprio usuário e os já interagidos
        const [users] = await db.query(`
            SELECT 
                u.id, 
                u.name, 
                u.surname, 
                u.birth_date, 
                u.user_tag, 
                u.bio, 
                u.email, 
                u.interest, 
                u.sexual_orientation, 
                u.createdAt, 
                u.updatedAt, 
                u.gender_identity, 
                u.images, 
                u.phone, 
                u.profession, 
                u.pronouns, 
                u.min_age_interest, 
                u.max_age_interest, 
                u.personality, 
                u.hobbies, 
                u.specific_interests, 
                u.relationship_types, 
                l.latitude, 
                l.longitude
            FROM users u
            JOIN locations l ON u.id = l.users_id
            WHERE u.id != ?
            AND u.id NOT IN (?)
        `, [userId, excludedUserIds.length ? excludedUserIds : [0]]); // Evita SQL inválido se excludedUserIds estiver vazio
        console.log('Total de usuários encontrados:', users.length);

        // Calcula a distância para cada usuário e filtra pela distância máxima
        const usersWithDistance = users
            .map(user => {
                const distance = haversineDistance(userLat, userLon, user.latitude, user.longitude);
                return { ...user, distance };
            })
            .filter(user => user.distance <= maxDistance) // Filtra pela distância máxima
            .sort((a, b) => a.distance - b.distance); // Ordena por proximidade

        return res.json(usersWithDistance);
    } catch (error) {
        console.error('Erro ao recomendar usuários:', error);
        return res.status(500).json({ error: 'Erro ao recomendar usuários.' });
    }
};
exports.updateFilterDistance = async (req, res) => {
    const userId = req.user.id; // ID do usuário logado
    const { filterDistance } = req.body; // Nova distância de filtragem
  
    try {
      // Atualiza a distância de filtragem na tabela `users`
      await db.query(
        'UPDATE users SET filter_distance = ? WHERE id = ?',
        [filterDistance, userId]
      );
  
      return res.json({ message: 'Distância de filtragem atualizada com sucesso.' });
    } catch (error) {
      console.error('Erro ao atualizar distância de filtragem:', error);
      return res.status(500).json({ error: 'Erro ao atualizar distância de filtragem.' });
    }
  };

  exports.registerUser = async (req, res) => {
    const { userData, locationData, imagesData } = req.body;
  
    console.log('Dados recebidos:', req.body); // Depuração
  
    try {
      // Verifica se o e-mail já está cadastrado
      const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [userData.email]);
      if (existingUser.length > 0) {
        return res.status(400).json({ error: 'E-mail já cadastrado.' });
      }
  
      // Define a data e hora atuais para o campo createdAt
      const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
  
      // Insere os dados na tabela `users`
      const [userResult] = await db.query(
        `INSERT INTO users (
          name, surname, birth_date, user_tag, email, password, phone, profession,
          gender_identity, sexual_orientation, pronouns, min_age_interest, max_age_interest,
          personality, hobbies, specific_interests, relationship_types, interest, createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userData.name,
          userData.surname,
          userData.birth_date,
          userData.user_tag,
          userData.email,
          userData.password,
          userData.phone,
          userData.profession,
          userData.gender_identity,
          userData.sexual_orientation,
          userData.pronouns,
          userData.min_age_interest,
          userData.max_age_interest,
          userData.personality,
          userData.hobbies,
          userData.specific_interests,
          userData.relationship_types,
          userData.interest || '[]', // Define um valor padrão para o campo interest
          createdAt // Inclui o campo createdAt
        ]
      );
  
      const userId = userResult.insertId; // Obtém o ID do usuário inserido
  
      // Insere os dados na tabela `locations`
      await db.query(
        `INSERT INTO locations (city, state, latitude, longitude, users_id)
         VALUES (?, ?, ?, ?, ?)`,
        [
          locationData.city,
          locationData.state,
          locationData.latitude,
          locationData.longitude,
          locationData.country || 'Brasil',
          userId
        ]
      );
  
      // Insere a imagem de perfil na tabela `user_images`
      if (imagesData.profileImage) {
        await db.query(
          `INSERT INTO user_images (user_id, image, is_profile)
           VALUES (?, ?, 1)`,
          [userId, imagesData.profileImage]
        );
      }
  
      // Insere as imagens da galeria na tabela `user_images`
      if (imagesData.galleryImages && imagesData.galleryImages.length > 0) {
        for (const image of imagesData.galleryImages) {
          await db.query(
            `INSERT INTO user_images (user_id, image, is_profile)
             VALUES (?, ?, 0)`,
            [userId, image]
          );
        }
      }
  
      return res.status(201).json({ message: 'Usuário registrado com sucesso!', userId });
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      return res.status(500).json({ error: 'Erro ao registrar usuário.' });
    }
  };