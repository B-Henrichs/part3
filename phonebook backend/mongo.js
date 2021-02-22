const process = require('process')
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.h3g38.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const numberSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Number = mongoose.model('Number', numberSchema)

const number = new Number({
  name: process.argv[3],
  number: process.argv[4]
})

if(!process.argv[3]) {
  console.log('Phonebook:')
  Number.find({}).then(result => {
    result.forEach(res => {
      console.log(res.name, res.number)
    })
    mongoose.connection.close()
  })
} else {
  number.save().then(() => {
    console.log('number saved!')
    mongoose.connection.close()
  })
}