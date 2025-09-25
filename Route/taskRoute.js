const express= require('express')
const {isAuthenticate}=require('../Middleware/AuthMiddleware')
const { createTask, getTasks, getTaskById, updateTask, deleteTask } = require('../Controller/taskContrller')

const router=express.Router()


router.post("/create",isAuthenticate, createTask)
router.get('/getTask',isAuthenticate, getTasks)
router.get('/getTaskBy/:id',isAuthenticate,getTaskById)
router.put('/updateTask/:id',isAuthenticate,updateTask)
router.delete('/delete/:id',isAuthenticate,deleteTask)


module.exports=router