const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: { 
        type: DataTypes.BIGINT.UNSIGNED, 
        primaryKey: true, 
        autoIncrement: true 
      },
      name: { 
        type: DataTypes.STRING(150), 
        allowNull: false 
      },
      slug: { 
        type: DataTypes.STRING, 
        allowNull: true, 
        set(val) { 
          if (val) this.setDataValue("slug", val.toLowerCase()); 
        } 
      },
      email: { 
        type: DataTypes.STRING(200), 
        allowNull: false, 
        unique: true, 
        validate: { isEmail: true } 
      },
      phone: { 
        type: DataTypes.STRING(32), 
        allowNull: true 
      },
      profile_img: { 
        type: DataTypes.STRING, 
        allowNull: true 
      },
      password: { 
        type: DataTypes.STRING, 
        allowNull: false 
      },
      password_confirm: { 
        type: DataTypes.STRING, 
        allowNull: false 
      },
      password_changed_at: { 
        type: DataTypes.DATE, 
        allowNull: true 
      },
      password_reset_token: { 
        type: DataTypes.STRING, 
        allowNull: true 
      },
      password_reset_expires: { 
        type: DataTypes.DATE, 
        allowNull: true 
      },
      role: { 
        type: DataTypes.ENUM("user", "admin"), 
        defaultValue: "user" 
      },
      active: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: true 
      },
      addresses: { 
        type: DataTypes.JSON, 
        allowNull: true, 
        defaultValue: [] 
      },
    },
    {
      tableName: "users",
      underscored: true,
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 12);
          }
          if (user.password_confirm) {
            user.password_confirm = await bcrypt.hash(user.password_confirm, 12);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            user.password = await bcrypt.hash(user.password, 12);
            user.password_changed_at = new Date();
          }
          if (user.changed("password_confirm")) {
            user.password_confirm = await bcrypt.hash(user.password_confirm, 12);
          }
        },
        afterFind: (result) => {
          const base = process.env.BASE_URL || "";
          const setImg = (u) => { 
            if (u && u.profile_img) {
              u.profile_img = `${base}/users/${u.profile_img}`;
            }
          };
          if (Array.isArray(result)) {
            result.forEach(setImg);
          } else {
            setImg(result);
          }
        },
      },
      defaultScope: {
        attributes: { exclude: ["password"] },
      },
      scopes: {
        withPassword: { attributes: {} },
      },
    }
  );

  User.prototype.correctPassword = async function (candidate) {
    return await bcrypt.compare(candidate, this.password);
  };

  User.prototype.createPasswordResetToken = function () {
    const otp = crypto.randomInt(100000, 999999).toString();
    
    this.password_reset_token = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");
    
    // 10 min OTP expiration
    this.password_reset_expires = new Date(Date.now() + 10 * 60 * 1000);
    
    // Return OTP plain
    return otp;
  };

  return User;
};