
// imports "process" and "mongoose" libraries(?)
const process = require('process')
const mongoose = require('mongoose')

// if the number of arguments passed when called 
// in the command-line ask the user to pass it the password
if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

// sets the password to the 2nd argument
// passed in the command-line
const password = process.argv[2]

// sets the url to the addres providewd by atlas
const url =
  `mongodb+srv://fullstack:${password}@cluster0.h3g38.mongodb.net/phonebook-app?retryWrites=true&w=majority`


  // tells mongoose to connect to the url with the settings provided
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })


// defines how an entry will be stored in the Atlas database
const numberSchema = new mongoose.Schema({
  name: String,
  number: String
})

// tells mongoose to use the schema above
const Number = mongoose.model('Number', numberSchema)



// handles creating a new entry with the 3rd and 4th arguments
// passed from the command-line
const number = new Number({
  name: process.argv[3],
  number: process.argv[4]
})

// if there isnt a third argument just print the phonebook
// otherwise saves the number created above
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