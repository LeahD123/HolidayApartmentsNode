import express from 'express';
import {
    getAll,
    getByCategory,
    getByCity,
    getByUser,
    create,
    getById,
    remove,
    update,
    getByLess,
    getByGreat,
    getByEqeul,
    getByLessBeds,
    getByGreatBeds,
    getByEqeulBeds,
    print
} from '../controllers/apartment.js';
import { checkAuth, getWeather } from '../middlewares.js';

const router = express.Router();

router.get('', getAll);
router.get('/getById/:id', getWeather, getById)
router.get('/getByCategory/:id', getByCategory)
router.get('/getByLess', getByLess)
router.get('/getByGreat', getByGreat)
router.get('/getByEqeul', getByEqeul)
router.get('/getByLessBeds', getByLessBeds)
router.get('/getByGreatBeds', getByGreatBeds)
router.get('/getByEqeulBeds', getByEqeulBeds)
router.get('/getByCity/:city', getByCity)
router.get('/getByUser/:id',checkAuth, getByUser)
router.post('/create', checkAuth, create)
router.delete('/remove/:id',checkAuth, remove)
router.put('/update/:id', checkAuth,update)

export default router;