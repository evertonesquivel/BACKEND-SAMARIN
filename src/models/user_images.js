const { DataTypes } = require('sequelize');

const UserImage = sequelize.define('UserImage', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    image: {
        type: DataTypes.BLOB('long'), // LONGBLOB para imagens grandes
        allowNull: false
    }
});

module.exports = UserImage;