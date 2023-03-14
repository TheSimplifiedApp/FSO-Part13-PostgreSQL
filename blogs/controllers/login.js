const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const User = require('../models/user')
const Session = require('../models/session')

router.post('/', async (req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({
    where: {
      username: username,
      disabled: false,
    }
  })

  // console.log(user)

  const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username, id: user.id
  }

  const token = jwt.sign(userForToken, SECRET)
  await Session.create({ token })

  res
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

// Task 13.24. logout route
router.delete("/", async (req, res) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    const token = authorization.substring(7)
    await Session.destroy({ where: { token } })
    return response.status(204).end();
  }
})

module.exports = router