import { Router } from 'express'

import authRoutes from '../modules/auth/auth.routes'
import chatbotRoutes from '../modules/chatbot/chatbot.routes'
import questionsRoutes from '../modules/questions/question.routes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/questions', questionsRoutes)

// Chatbot segue o contrato: /nodes/* e /sessions/log direto em /api/v1
router.use('/', chatbotRoutes)

export default router

