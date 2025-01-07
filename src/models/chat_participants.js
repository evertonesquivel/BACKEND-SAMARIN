// src/models/ChatParticipant.js
module.exports = (sequelize, DataTypes) => {
    const ChatParticipant = sequelize.define('ChatParticipant', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        chat_room_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'chat_rooms',
                key: 'id'
            }
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('owner', 'member'),
            allowNull: false
        }
    }, {
        tableName: 'chat_participants',
        timestamps: false
    });

    // Definindo associações (relacionamentos)
    ChatParticipant.associate = (models) => {
        ChatParticipant.belongsTo(models.ChatRoom, { foreignKey: 'chat_room_id' });
    };

    return ChatParticipant;
};
