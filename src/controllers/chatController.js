const sequelize = require('../db/dbSequelize');
const jwt = require('jsonwebtoken');
const Match = require('../models/matchs');
sequelize.Match = Match;
const User = require('../models/user');

const secretKey = process.env.JWT_SECRET || 'seuSegredo'; // Utilize a variável de ambiente para maior segurança

// Função auxiliar para inserir mensagem no banco de dados
async function insertMessage(content, chatRoomId, senderId, receiverId) {
    const sentAt = new Date().toISOString().slice(0, 19).replace('T', ' '); // Formata a data para o MySQL
    try {
      const [result] = await sequelize.query(
        `INSERT INTO messages (content, is_read, sentAt, chat_room_id, sender_id, receiver_id, is_deleted)
         VALUES (:content, 0, :sentAt, :chatRoomId, :senderId, :receiverId, 0)`,
        {
          replacements: {
            content: JSON.stringify(content), // Converte o conteúdo para JSON
            sentAt,
            chatRoomId: parseInt(chatRoomId, 10), // Converte para número
            senderId: parseInt(senderId, 10), // Converte para número
            receiverId: parseInt(receiverId, 10), // Converte para número
          },
          type: sequelize.QueryTypes.INSERT,
        }
      );
  
      return {
        id: result.insertId,
        content,
        is_read: 0,
        sentAt,
        chatRoomId,
        senderId,
        receiverId,
        is_deleted: 0,
      };
    } catch (error) {
      console.error('Erro ao inserir mensagem:', error);
      throw error; // Lança o erro para ser tratado no método que chamou
    }
  }
// Inicializar WebSocket no controlador
exports.initializeWebSocket = (io) => {
    io.on('connection', async (socket) => {
        console.log('User connected');
        const token = socket.handshake.query.token;
        console.log('Token recebido no handshake query:', token);

        if (!token) {
            socket.emit('error', 'Token de autenticação não encontrado');
            socket.disconnect();
            return;
        }

        try {
            const user = await verifyToken(token);
            socket.user = user;
            console.log('User authenticated:', socket.user.id);

            socket.on('joinRoom', (chatRoomId) => {
                socket.join(chatRoomId);
                console.log(`User joined room: ${chatRoomId}`);
            });

            socket.on('sendMessage', async ({ content, chatRoomId, receiverId }) => {
                try {
                    const message = await insertMessage(content, chatRoomId, socket.user.id, receiverId);
                    io.to(chatRoomId).emit('newMessage', message);
                } catch (error) {
                    console.error('Error sending message:', error);
                    socket.emit('error', 'Falha ao enviar mensagem.');
                }
            });

            socket.on('disconnect', () => {
                console.log('User disconnected');
            });
        } catch (err) {
            console.error('Erro na verificação do token JWT:', err);
            socket.emit('error', 'Token inválido');
            socket.disconnect();
        }
    });
};

// Criar um novo chat, seja de match ou solicitação
exports.createChatRoom = async (req, res) => {
    const { receiverId } = req.body;
    const userId = req.user.id; // Obtém o ID do usuário autenticado a partir do middleware

    try {
        let chatRoom = await sequelize.query(`
            SELECT cr.id FROM chat_rooms cr
            WHERE cr.id IN (
                SELECT chat_room_id FROM chat_participants WHERE user_id = ?
            ) AND cr.id IN (
                SELECT chat_room_id FROM chat_participants WHERE user_id = ?
            )
        `, [userId, receiverId]);

        if (chatRoom.length > 0) {
            return res.status(200).json({ chatRoomId: chatRoom[0].id });
        }

        const [result] = await sequelize.query(`
            INSERT INTO chat_rooms (status, chat_type)
            VALUES ('active', 'individual')
        `);

        const chatRoomId = result.insertId;

        await sequelize.query(`
            INSERT INTO chat_participants (chat_room_id, user_id, role)
            VALUES (?, ?, 'owner'), (?, ?, 'member')
        `, [chatRoomId, userId, chatRoomId, receiverId]);

        return res.status(201).json({ chatRoomId });
    } catch (error) {
        console.error('Erro ao criar sala de chat:', error);
        res.status(500).json({ message: 'Erro ao criar chat.' });
    }
};

// Obter contatos (matches ou solicitações)
const getContacts = async (userId) => {
    try {
      const query = `
        SELECT DISTINCT
          u.id, 
          u.name, 
          u.email,
          u.images 
        FROM 
          users u
        INNER JOIN 
          matchs m 
        ON 
          u.id = m.matcher_id OR u.id = m.matchee_id
        WHERE 
          m.matcher_id = :userId OR m.matchee_id = :userId;
      `;
  
      const replacements = { userId }; // Passando o valor de userId
      const type = sequelize.QueryTypes.SELECT;
  
      const contacts = await sequelize.query(query, { replacements, type });
      return contacts;
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
      throw error;
    }
  };
  
  // Função para obter detalhes dos contatos
  exports.getContactsDetails = async (req, res) => {
    try {
      const userId = req.user.id; // ID do usuário autenticado
      const contacts = await getContacts(userId);
  
      // Retornar os contatos encontrados
      res.json(contacts);
    } catch (error) {
      console.error('Erro ao obter detalhes dos contatos:', error);
      res.status(500).json({ message: 'Erro ao obter detalhes dos contatos.' });
    }
  };
// Middleware de verificação do token JWT
function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
}

// Listar conversas para o usuário autenticado
exports.getConversations = async (req, res) => {
    const userId = req.user.id; // ID do usuário autenticado

    try {
        // Busca todas as salas de chat em que o usuário participa
        const [conversations] = await sequelize.query(
            `SELECT 
                cr.id AS chat_room_id,
                cr.status,
                cr.chat_type,
                cr.title,
                cr.image_url,
                m.content AS last_message,
                m.sentAt AS last_message_sent_at,
                m.sender_id AS last_message_sender_id
             FROM chat_rooms cr
             INNER JOIN chat_participants cp ON cr.id = cp.chat_room_id
             LEFT JOIN messages m ON cr.last_message_id = m.id
             WHERE cp.user_id = :userId
             ORDER BY m.sentAt DESC`,
            {
                replacements: { userId },
                type: sequelize.QueryTypes.SELECT
            }
        );

        // Retorna a lista de conversas
        res.status(200).json(conversations);
    } catch (error) {
        console.error('Erro ao buscar conversas:', error);
        res.status(500).json({ error: 'Falha ao buscar conversas.' });
    }
};
// Listar mensagens de uma sala de chat específica
exports.getMessages = async (req, res) => {
    const { chatRoomId } = req.params;

    // Verificação para garantir que o chatRoomId foi passado e é um número válido
    if (!chatRoomId || isNaN(chatRoomId)) {
        return res.status(400).json({ error: 'chatRoomId is required and must be a number.' });
    }

    try {
        // Realizando a consulta com a substituição do parâmetro chatRoomId
        const messages = await sequelize.query(
            `SELECT * FROM messages WHERE chat_room_id = :chatRoomId ORDER BY sentAt DESC`,
            {
                replacements: { chatRoomId }, // Passando o parâmetro corretamente
                type: sequelize.QueryTypes.SELECT
            }
        );

        // Verificando quantas mensagens foram retornadas e logando para depuração
        console.log('Número de mensagens retornadas:', messages.length);
        console.log('Mensagens carregadas:', messages);

        // Respondendo com as mensagens
        res.json(messages);
    } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
        res.status(500).json({ error: 'Falha ao buscar mensagens.' });
    }
};

// Enviar mensagem em tempo real para a sala de chat
exports.sendMessage = async (req, res) => {
    const { content, chatRoomId, receiverId } = req.body; // Extrai receiverId do corpo da requisição
    const userId = req.user.id; // ID do usuário autenticado
  
    // Verifica se todos os campos obrigatórios estão presentes
    if (!content || !chatRoomId || !receiverId) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando: content, chatRoomId ou receiverId.' });
    }
  
    try {
      const message = await insertMessage(content, chatRoomId, userId, receiverId);
  
      // Emite a mensagem para a sala de chat via WebSocket (se aplicável)
      if (io) {
        io.to(chatRoomId).emit('newMessage', message);
      }
  
      return res.status(201).json(message);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      return res.status(500).json({ error: 'Falha ao enviar mensagem.' });
    }
  };
