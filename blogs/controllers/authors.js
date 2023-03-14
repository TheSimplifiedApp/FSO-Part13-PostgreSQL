const router = require('express').Router()
const { sequelize } = require('../models/blog')
const { Blog } = require('../models')

router.get('/', async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('id')), 'articles'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
    ],
    group: 'author',
    order: [["likes", "DESC"]],
  })

  res.json(authors)
})

module.exports = router