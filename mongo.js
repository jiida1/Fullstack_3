const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://fullstack:${password}@cluster0.ldzfxff.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personsSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personsSchema)

/*const note = new Note({
    content: 'Helppoa ja kivaa',
    important: false,
})


note.save().then(result => {
    console.log('note saved!')
    mongoose.connection.close()
})
*/

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length === 5) {
  const person = new Person({
    id: Math.floor(Math.random() * 10000),
    name: process.argv[3],
    number: process.argv[4],
  })


  person.save().then(result => {
    console.log('Person saved! ', result)
    mongoose.connection.close()
  })
}
