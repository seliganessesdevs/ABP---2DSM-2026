import {env} from './config/env';
import app from './server';

const port = env.PORT;

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
})