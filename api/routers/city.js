// router - controller

import express from 'express'
import {
    getAll,
    create
} from '../controllers/city.js'
// import { categoryExists } from '../middlewares.js'

const router = express.Router()

router.get('', getAll)
router.post ('/create', create)

export default router