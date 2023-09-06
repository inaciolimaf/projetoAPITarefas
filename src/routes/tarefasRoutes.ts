import {Router} from 'express';
import { TarefasController } from '../controllers/TarefasController';

const tarefasRoutes = Router();
const controller = new TarefasController();
tarefasRoutes.get('/show/:id', controller.show)
tarefasRoutes.get('/list/', controller.list)
tarefasRoutes.post('/create/', controller.create)
export { tarefasRoutes }