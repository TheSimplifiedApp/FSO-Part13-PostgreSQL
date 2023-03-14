const bcrypt = require('bcrypt')
const router = require('express').Router()

const { User, Blog, ReadingList } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ["passwordHash"] },
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })
  return res.json(users)
})

router.get('/:id', async (req, res) => {
  let where = {};

  if (req.query.read) {
    where = {
      read: req.query.read,
    };
  }

  const user = await User.findByPk(req.params.id, {
    attributes: ['name', 'username'],
    include: [
      {
        model: Blog,
        as: 'readinglist',
        attributes: { exclude: ['userId'] },
        through: {
          attributes: ['read', 'id'],
          where
        },
      }
    ]
  })
  
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.post('/', async (req, res) => {
  const { username, name, password } = req.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  try {
    const user = await User.create({ username, passwordHash, name, disabled: false })
    res.json(user)
  } catch (error) {
    return res.status(400).json({ error: error.errors[0].message })
  }
})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })

  if (user) {
    user.username = req.body.username
    try {
      await user.save()
      return res.json(user)
    } catch (error) {
      return res.status(400).json({ error })
    }
  }
  return res.status(400).json({ error: "user not found." })
})

module.exports = router