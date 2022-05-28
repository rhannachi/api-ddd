import app from './config/app'

const port = process.env.PORT ?? 5050

app.listen(port, () => console.info(`Server at runnint http://localhost:${port}`))
