import {Router} from 'express';
import { TarefasController } from '../controllers/TarefasController';

const tarefasRoutes = Router();
const controller = new TarefasController();
tarefasRoutes.get('/show/:id', controller.show)
tarefasRoutes.get('/list/', controller.list)
tarefasRoutes.post('/create/', controller.create)
tarefasRoutes.put('/update/:id', controller.update)
tarefasRoutes.delete('/delete/:id', controller.delete)
export { tarefasRoutes }