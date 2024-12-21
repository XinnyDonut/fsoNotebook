const usersRouter=require('express').Router()
const User=require('../models/user')
const bcrypt=require('bcrypt')

usersRouter.post('/',async (request,response,next) => {
  const { username, name, password } = request.body
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })
  try{
    const savedUser= await user.save()
    response.status(201).json(savedUser)
  }catch(error){
    next(error)
  }
})

usersRouter.get('/',async (request,response) => {
  const users =await User.find({})
  response.status(200).json(users)
})

module.exports=usersRouter
