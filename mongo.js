const mongoose = require('mongoose')

if (process.argv.length < 3){
  console.log('give password as argument')
  process.exit(1)
} else if (process.argv.length === 4){
  console.log('give name as second argument and number as third')
  process.exit(1)
}

const password = process.argv[2]
const dbName = 'phonebook-app'

const url = `mongodb+srv://usermine12:${password}@cluster0-ctfnr.mongodb.net/${dbName}?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 4){
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => console.log(person.name, person.number))
    mongoose.connection.close()
  })
} else if (process.argv.length < 6){
  const newPerson = new Person ({
    name: process.argv[3],
    number: process.argv[4]
  })

  newPerson.save().then(result => {
    console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
    mongoose.connection.close()
  })
}