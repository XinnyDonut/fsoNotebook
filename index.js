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
  
  app.get('/api/notes/:id', (request, response) => {
    const id=request.params.id
    const note=notes.find(x=>x.id===id)
    if(note){
        response.json(note)
    }else{
        response.status(404).end()
    }
  })

  app.get('/api/notes/', (request, response) => {
    if(notes){
        response.json(notes)
    }else{
        response.status(404).end()
    }
  })
  
  app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    notes = notes.filter(note => note.id !== id)
  
    response.status(204).end()
  })
  
  const generateId=()=>{
    const maxId=notes.length>0
    ?Math.max(...notes.map(x=>Number(x.id)))
    :0
    return String(maxId+1)
  }

  app.post('/api/notes',(request,response)=>{
    const body=request.body

    if(!body.content){
      return  response.status(400).json({error:'content missing'})
    }
    
    const note={
        content:body.content,
        important:Boolean(body.important)||false,
        id:generateId()
    }
    notes=notes.concat(note)
    console.log(request.get('Content-Type'));
    console.log(notes)
    response.json(note)
    
  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

  app.use(unknownEndpoint)
  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })