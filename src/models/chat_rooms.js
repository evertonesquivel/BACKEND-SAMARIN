// src/models/ChatRoom.js
module.exports = (sequelize, DataTypes) => {
    const ChatRoom = sequelize.define('ChatRoom', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        chat_type: {
            type: DataTypes.ENUM('individual', 'group'),
            allowNull: false
        }
    }, {
        tableName: 'chat_rooms',
        timestamps: false
    });

    // Definindo associações (relacionamentos)
    ChatRoom.associate = (models) => {
        // Relacionamento com a tabela ChatParticipants
        ChatRoom.hasMany(models.ChatParticipant, { foreignKey: 'chat_room_id' });
        // Relacionamento com a tabela Messages
        ChatRoom.hasMany(models.Message, { foreignKey: 'chat_room_id' });
    };

    return ChatRoom;
};
