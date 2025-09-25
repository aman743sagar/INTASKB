const express= require('express')
const {isAuthenticate}=require('../Middleware/AuthMiddleware')

const { login,register, fetchProfile, logout, updateProfile } = require('../Controller/UserController')


const router=express.Router()


router.post('/register',register)
router.post('/login', login)
router.get('/getProfile', isAuthenticate ,fetchProfile)
router.put("/updateprfile",isAuthenticate,updateProfile)
router.post('/logout',isAuthenticate,logout)


module.exports=router