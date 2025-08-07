// router - controller

import express from 'express'
import {
    create,
    getAll,
} from '../controllers/category.js'

const router = express.Router()

router.get('', getAll)
router.post('/create', create)

export default router