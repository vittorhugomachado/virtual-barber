import express from 'express'
import ownerUserauthRoutes from './modules/auth/owner/auth.routes'

const app = express()
app.use(express.json())
const port = 3000

app.use("/api/owner-user", ownerUserauthRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
