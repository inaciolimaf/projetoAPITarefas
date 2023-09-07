import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'
import { prismaC } from '../prisma'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { tarefasRoutes } from "../routes/tarefasRoutes";
import { AppError } from "../errors/AppError";

export class TarefasController {
    public async list(request: Request, response: Response) {
        const tarefas = await prismaC.tarafas.findMany();
        return response.status(200).json(tarefas)
    }

    public async show(request: Request, response: Response) {
        const { id } = request.params;

        console.log("teste")
        const tarefa = await prismaC.tarafas.findUnique({
            where: { id }
        });
        if (tarefa==null) {
            throw new AppError("Tarefa não encontrado")
        }
        return response.status(200).json(tarefa)
    }

    public async create(request: Request, response: Response) {
        const { titulo, descricao } = request.body;

        const tarefas = await prismaC.tarafas.create({
            data: {
                titulo,
                descricao
            }
        });
        return response.status(200).json(tarefas)
    }
    public async update(request: Request, response: Response) {
        const { id } = request.params
        const { titulo, descricao } = request.body;

        const tarefas = await prismaC.tarafas.update({
            where: {
                id
            },
            data: {
                titulo,
                descricao
            }
        });
        return response.status(200).json(tarefas)
    }
    public async delete(request: Request, response: Response) {
        const { id } = request.params;

        const tarefa = await prismaC.tarafas.delete({
            where: { id }
        });
        return response.status(200).json(tarefa)
    }
}