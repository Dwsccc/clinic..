module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.ENUM('Nam', 'Nữ', 'Khác'),
      defaultValue: 'Khác',
    },
    dob: {
      type: DataTypes.DATEONLY, // Dùng DATEONLY cho ngày sinh
    },
    address: {
      type: DataTypes.TEXT,
    },
    role: {
      type: DataTypes.ENUM('user', 'admin', 'doctor'),
      defaultValue: 'user',
    },
    image: {
      type: DataTypes.STRING,
    },
    // Các trường thời gian
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, {
    tableName: 'users',
    timestamps: true, // Bật tính năng tự động ghi giờ
    createdAt: 'created_at', // 👇 Ánh xạ createdAt (code) -> created_at (DB)
    updatedAt: 'updated_at', // 👇 Ánh xạ updatedAt (code) -> updated_at (DB)
  });

  User.associate = (models) => {
    User.hasMany(models.Appointment, {
      foreignKey: 'user_id',
      as: 'appointments',
    });
  };

  return User;
};