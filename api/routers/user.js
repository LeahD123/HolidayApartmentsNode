// router - controller

import express from 'express'
import {
    login,
    register
    ,getAllUsers,
    getApartmentsFromArr
} from '../controllers/user.js'
import { checkEmail, checkAuth } from '../middlewares.js'

const router = express.Router()

router.post('/register',checkEmail, register)
router.post('/login',checkEmail, login)
router.get('/users', getAllUsers)
router.get('/checkAuth', checkAuth)
router.get('/apartments',checkAuth, getApartmentsFromArr)

export default router