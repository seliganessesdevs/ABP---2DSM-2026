import { Router } from 'express'

import authRoutes from '../modules/auth/auth.routes'
import chatbotRoutes from '../modules/chatbot/chatbot.routes'

const router = Router()

router.use('/auth', authRoutes)

// Chatbot segue o contrato: /nodes/* e /sessions/log direto em /api/v1
router.use('/', chatbotRoutes)

export default router

