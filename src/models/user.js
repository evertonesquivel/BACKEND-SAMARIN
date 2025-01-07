module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User ', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    birth_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    user_tag: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    bio: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    interest: {
      type: DataTypes.JSON,
      allowNull: false
    },
    sexual_orientation: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    gender_identity: {
      type: DataTypes.STRING,
      allowNull: false
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    profession: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pronouns: {
      type: DataTypes.STRING,
      allowNull: true
    },
    min_age_interest: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    max_age_interest: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    personality: {
      type: DataTypes.STRING,
      allowNull: true
    },
    hobbies: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    specific_interests: {
      type: DataTypes.STRING,
      allowNull: true
    },
    relationship_types: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'users',
    timestamps: true
  });

  User.associate = (models) => {
    User.hasMany(models.Match, { foreignKey: 'matcher_id' });
    User.hasMany(models.Match, { foreignKey: 'matchee_id' });
  };

  return User;
};