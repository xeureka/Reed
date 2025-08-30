import express from 'express'
import cors from 'cors'
import forYou from './routes/foryou.routes'
import summery from './routes/summery.routes'

const app = express()

app.use(express.json())
app.use(cors())

app.use('/foryou',forYou)
app.use('/summarize',summery)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`server running at port ${PORT}`)
})