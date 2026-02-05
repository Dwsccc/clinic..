module.exports = (sequelize, DataTypes) => {
  const Doctor = sequelize.define('Doctor', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    // Sửa lại phần này:
    experience: {
      type: DataTypes.ENUM('1 Năm', '2 Năm', '3 Năm', '4 Năm', '5 Năm', '6 Năm', '7 Năm', '8 Năm', '9 Năm', '10 Năm'),
      allowNull: false,
      defaultValue: '1 Năm',
      comment: 'Years of experience as text'
    },
    fees: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    speciality: {
      type: DataTypes.ENUM(
        'Khoa Đa Khoa (Hô hấp/Chung)',
        'Khoa Tiêu Hóa',
        'Khoa Nhi (Trẻ em)',
        'Khoa Thần Kinh',
        'Khoa Da Liễu',
        'Khoa Cơ Xương Khớp',
        'Khoa Tim Mạch'
      ),
      allowNull: false
    },
    degree: {
      type: DataTypes.STRING(255),
    },
    address: {
      type: DataTypes.TEXT,
    },
    about: {
      type: DataTypes.TEXT,
    },
    avatar_url: {
      type: DataTypes.STRING(255),
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'doctors',
    timestamps: false,
  });

  Doctor.associate = (models) => {
    Doctor.hasMany(models.Appointment, {
      foreignKey: 'doctor_id',
      as: 'appointments',
    });
  };

  return Doctor;
};