import { app, port } from './config/app'

app.listen(port, () => console.info(`Server at runnint http://localhost:${port}`))
