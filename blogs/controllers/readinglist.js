const router = require('express').Router()
const { ReadingList } = require('../models');
const { tokenExtractor } = require('../util/middleware')

router.post('/', async (req, res) => {
  console.log(req.body)
  const readingList = await ReadingList.create({ ...req.body, read: false })
  return res.json(readingList)
})

// I assume this :id is the blog id. Otherwise, it doesn't make sense if this refers to the pk in readinglist
router.put('/:id', tokenExtractor, async (req, res) => {

  const blog = await ReadingList.findOne({
    where: {
      blogId: req.params.id
    }
  })

  if (blog.userId === req.decodedToken.id) {
    blog.read = req.body.read
    await blog.save()
    res.json(blog)
  } else {
    res.status(401).end()
  }
})

module.exports = router