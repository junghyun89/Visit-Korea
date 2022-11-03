const Sequelize = require('sequelize');

module.exports = class Site extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        contentId: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Site',
        tableName: 'sites',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    db.Site.hasMany(db.Review);
    db.Site.belongsToMany(db.User, { through: 'Zzim', as: 'Zzimer'});
    db.Site.belongsToMany(db.User, { through: 'Like', as: 'Liker'});
  }
};
