require("express-async-errors");
const { errorHandler, unknownEndpoint } = require('./util/error')

const express = require('express')
const app = express()
app.use(express.json())

const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/users')
const blogsRouter = require('./controllers/blogs')
const authorRouter = require('./controllers/authors')
const readinglistRouter = require('./controllers/readinglist')

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/authors', authorRouter)
app.use('/api/readinglists', readinglistRouter)

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

app.use(unknownEndpoint)
app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()



// require('dotenv').config()
// const { Sequelize, Model, DataTypes } = require('sequelize')
// const express = require('express')
// const app = express()

// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false
//     }
//   },
// })

// class Blog extends Model { }
// Blog.init({
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   author: {
//     type: DataTypes.TEXT
//   },
//   url: {
//     type: DataTypes.TEXT,
//     allowNull: false
//   },
//   title: {
//     type: DataTypes.TEXT,
//     allowNull: false
//   },
//   likes: {
//     type: DataTypes.INTEGER,
//     defaultValue: 0
//   }
// }, {
//   sequelize,
//   underscored: true,
//   timestamps: false,
//   modelName: 'blog'
// })

// app.get('/api/blogs', async (req, res) => {
//   const blogs = await Blog.findAll()
//   res.json(blogs)
// })

// app.post('/api/blogs', async (req, res) => {
//   try {
//     console.log(req.body)
//     const blog = await Blog.create(req.body)
//     res.json(blog)
//   } catch (error) {
//     return res.return(400).json({ error })
//   }
// })

// app.delete('/api/blogs/:id', async (req, res) => {
//   try {
//     await Blog.findByPk(req.params.id).delete()
//   } catch (error) {
//     return res.return(400).json({ error })
//   }
// })

// const PORT = process.env.PORT || 3001
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })