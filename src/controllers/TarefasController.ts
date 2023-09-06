import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'

export class TarefasController{
    public async list(request: Request, response: Response){

        const prisma = new PrismaClient();

        const tarefas = await prisma.tarafas.findMany();
        return response.status(200).json(tarefas)
    }
    
    public async show(request: Request, response: Response){
        const { id } = request.params;
        const prisma = new PrismaClient();

        const tarefa = await prisma.tarafas.findUnique({
            where: { id }
        });
        return response.status(200).json(tarefa)
    }

    public async create(request: Request, response: Response){
=        const {titulo, descricao} = request.body;
        const prisma = new PrismaClient();

        const tarefas = await prisma.tarafas.create({
            data:{
                titulo,
                descricao
            }
        });
        return response.status(200).json(tarefas)
    }
}