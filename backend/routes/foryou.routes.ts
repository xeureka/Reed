import { fetchNewStories,fetchTopStories,fetchBestStories } from "../controllers/foryou.controller";
import express from 'express'

const router = express.Router()

router.get('/new', fetchNewStories)
router.get('/top', fetchTopStories)
router.get('/best',fetchBestStories)

export default router;