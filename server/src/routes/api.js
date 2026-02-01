import express, { Router } from "express";
const router = Router();
import path from 'path';
import { fileURLToPath } from "url";

import roomRouter from './room.js';


router.use('/room', roomRouter);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
router.use('/images', express.static(path.join(__dirname, '../../images')));
router.use('/glbs', express.static(path.join(__dirname, '../../glbs')));


export default router;