const router = require('express').Router()
const { Op } = require('sequelize')
const { User, Blog } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: `%${req.query.search}%`
          },
        },
        {
          author: {
            [Op.iLike]: `%${req.query.search}%`
          },
        },
      ],
    };
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where,
    order: [['likes', 'DESC']]
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({ ...req.body, userId: user.id })
    res.json(blog)
  } catch (error) {
    next(error)
    // return res.status(400).json({ error })
  }
})

const noteFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.get('/:id', noteFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

router.delete('/:id', tokenExtractor, noteFinder, async (req, res) => {
  if (req.blog && req.blog.userId === req.decodedToken.id) {
    await req.blog.destroy()
    return res.status(204).end()
  }
  return res.status(401).json({ error: 'Unauthorized' })
})

router.put('/:id', noteFinder, async (req, res, next) => {
  if (req.blog) {
    req.blog.likes = req.blog.likes + 1
    await req.blog.save()
    res.json(req.blog.likes)
  } else {
    throw new Error('Blog not found')
  }
})

module.exports = router