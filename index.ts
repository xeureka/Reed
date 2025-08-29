import express from 'express'
import cors from 'cors'
import forYou from './routes/foryou.routes'

const app = express()

app.use(express.json())
app.use(cors())

app.use('/foryou',forYou)

app.listen(3000, () => {
  console.log('server running at port 3000')
})