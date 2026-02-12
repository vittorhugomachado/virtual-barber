import express from 'express';
import cookieParser from 'cookie-parser';
import ownerUserauthRoutes from './modules/auth/owner/auth.routes';
import ownerUserDataRoutes from './modules/user-data/owner/user.routes';
import ownerPasswordRoutes from './modules/password/owner/password.routes';
import barberShopAddressRoutes from './modules/address/barbershop/address.routes';
import YAML from 'yamljs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

const app = express();
app.use(express.json());
app.use(cookieParser());
const swaggerDocument = YAML.load(path.resolve(__dirname, '../../docs/swagger.yaml'));
const port = 3000;

app.use('/api/owner-user', ownerUserauthRoutes);
app.use('/api/owner-user', ownerUserDataRoutes);
app.use('/api/owner-user', ownerPasswordRoutes);
app.use('/api/barbershop', barberShopAddressRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
