const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
`mongodb+srv://wwy880703:${password}@cluster0.nyjq2.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'HTML is easy',
  important: true,
})

const note2= new Note({
    content:"Browser can execute only JavaScript",
    important:false,
})

// note2.save().then(result=>{
//     console.log(result)
// })

// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })
Note.find({important:true}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })