require('dotenv').config()
const Note=require('./models/note')
const express = require('express')
const app = express()
const cors=require('cors')
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())


let notes = [
    {
      id: "1",
      content: "HTML is easy",
      important: true
    },
    {
      id: "2",
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: "3",
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]


  const requestLogger = (request, response, next) => {
    console.log(`Here is the request requestLogger...`);
    
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }

  app.use(requestLogger)

  app.get('/', (request, response) => {
    response.send('<h1>Hello You!</h1>')
  })
  
  app.get('/api/notes/:id', (request,response,next) => {
    const id=request.params.id
    Note.findById(id).then(note=>{
      if(note){
        response.json(note)
      }else{
        response.status(404).end()
      }  
    })
    .catch(error=>next(error))
  })

  app.get('/api/notes/', (request, response) => {
    Note.find({}).then(notes=>{
      response.json(notes)
    })
  })
  
  app.delete('/api/notes/:id', (request,response,next) => {
    const id = request.params.id
    Note.findByIdAndDelete(id)
      .then(result=>response.status(204).end())
      .catch(error=>next(error))
  })
  
  const generateId=()=>{
    const maxId=notes.length>0
    ?Math.max(...notes.map(x=>Number(x.id)))
    :0
    return String(maxId+1)
  }

  app.post('/api/notes',(request,response,next)=>{
    const body=request.body
    if(!body.content){
      return  response.status(400).json({error:'content missing'})
    }
    
    const note=new Note({
        content:body.content,
        important:body.important||false,
    })

    note.save()
    .then(savedNote=>response.json(savedNote))
    .catch(error=>next(error))
  })
  
  app.put('/api/notes/:id',(req,res,next)=>{
    const{content,important}=req.body
    Note.findByIdAndUpdate(
      req.params.id,
      {content,important},
      {new:true,runValidators:true,context:'query'}
    )
      .then(updatedNote=>{
        res.json(updatedNote)
      })
      .catch(error=>next(error))
  })


  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  app.use(unknownEndpoint)

  const errorHandler=(error,request,response,next)=>{
    console.error(error.message)

    if(error.name==='CastError'){
      return response.status(400).send({error:'malformatted id'})
    }else if(error.name="ValidationError"){
      return response.status(400).json({error:error.message})
    }

    next(error)
  }
  app.use(errorHandler)



  const PORT = process.env.PORT||3000
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })