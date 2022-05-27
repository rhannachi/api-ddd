import express from 'express'

const app = express()
const port = process.env.PORT ?? 5050

app.listen(port, () => console.info(`Server at runnint http://localhost:${port}`))
