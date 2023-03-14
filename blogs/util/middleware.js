const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')
const Session = require('../models/session')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {

    // Task 13.24.
    const token = authorization.substring(7)
    const session = await Session.findOne({
      where: {token}
    })

    if (!session) {
      return res.status(401).json({error: 'invalid token'})
    }

    try {
      req.decodedToken = jwt.verify(token, SECRET)  
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

module.exports = { tokenExtractor }