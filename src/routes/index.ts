import { tarefasRoutes } from "./tarefasRoutes";
import { Router } from "express";

const routes = Router();

routes.use('/tarefas', tarefasRoutes);

export {routes};