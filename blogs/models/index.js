const User = require('./user')
const Blog = require('./blog')
const ReadingList = require('./readinglist')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: ReadingList, as: 'readinglist' })
Blog.belongsToMany(User, { through: ReadingList, as: 'users_saved' })

// User.sync({ alter: true })
// Blog.sync({ alter: true })

module.exports = {
  User, Blog, ReadingList
}