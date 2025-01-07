// src/models/Message.js
module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define('Message', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        content: {
            type: DataTypes.JSONB, // JSONB para armazenar conteúdo da mensagem
            allowNull: false
        },
        is_read: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0 // Mensagens não lidas por padrão
        },
        sentAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        chat_room_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'chat_rooms',
                key: 'id'
            }
        },
        sender_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        receiver_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        }
    }, {
        tableName: 'messages',
        timestamps: false
    });

    // Definindo associações (relacionamentos)
    Message.associate = (models) => {
        Message.belongsTo(models.ChatRoom, { foreignKey: 'chat_room_id' });
    };

    return Message;
};
