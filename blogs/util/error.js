const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  return response.status(400).send({ error: error.message })
}

// const errorHandler = (error, request, response, next) => {
//   console.error(error.name)

//   if (error.name === 'SequelizeValidationError') {
//     return response.status(400).send({ error: error.message })
//   }

//   next(error)
// }

module.exports = { unknownEndpoint, errorHandler }