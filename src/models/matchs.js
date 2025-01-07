module.exports = (sequelize, DataTypes) => {
    const Match = sequelize.define('Match', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      matcher_id: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      matchee_id: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      is_active: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 1
      }
    }, {
      tableName: 'matchs',
      timestamps: false
    });
  
    Match.associate = (models) => {
      Match.belongsTo(models.User, { foreignKey: 'matcher_id', as: 'matcher' });
      Match.belongsTo(models.User, { foreignKey: 'matchee_id', as: 'matchee' });
    };
  
    return Match;
  };