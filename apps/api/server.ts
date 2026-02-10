import express from 'express'
import cookieParser from 'cookie-parser'
import ownerUserauthRoutes from './modules/auth/owner/auth.routes'

const app = express()
app.use(express.json())
app.use(cookieParser())
const port = 3000

app.use("/api/owner-user", ownerUserauthRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
