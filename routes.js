import { Router } from 'express';
import { 
    listarUsuarios, 
    criarUsuario, 
    deletarUsuario, 
    buscarUsuarioPorId 
} from './controladores/users.controllers.js';

const routes = Router();

routes.get('/', listarUsuarios);
routes.post('/', criarUsuario);
routes.get('/:id', buscarUsuarioPorId);
routes.delete('/:id', deletarUsuario);

export default routes;