// router - controller

import express from 'express'
import {
    login,
    register
} from '../controllers/user.js'
import { checkEmail } from '../middlewares.js'

const router = express.Router()

router.post('/register',checkEmail, register)
router.get('/login',checkEmail, login)

export default router