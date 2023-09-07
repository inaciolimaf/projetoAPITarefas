import { Request, Response } from "express";
import { prismaC } from '../prisma'
import { AppError } from "../errors/AppError";

export class TarefasController {
    public async list(request: Request, response: Response) {
        const tarefas = await prismaC.tarafas.findMany();
        return response.status(200).json(tarefas)
    }

    public async show(request: Request, response: Response) {
        const { id } = request.params;
        const tarefa = await prismaC.tarafas.findUnique({
            where: { id }
        });
        if (!tarefa) throw new AppError("Tarefa não encontrada")
        return response.status(200).json(tarefa)
    }

    public async create(request: Request, response: Response) {
        const { titulo, descricao } = request.body;
        if (!titulo) throw new AppError("Faltando titulo no body")
        if (!descricao) throw new AppError("Faltando descricao no body")
        const tarefa = await prismaC.tarafas.create({
            data: {
                titulo,
                descricao
            }
        });
        return response.status(200).json(tarefa)
    }
    public async update(request: Request, response: Response) {
        const { id } = request.params
        const { titulo, descricao } = request.body;
        let tarefa = null;
        try {
            tarefa = await prismaC.tarafas.update({
                where: {
                    id
                },
                data: {
                    titulo,
                    descricao
                }
            });
        } catch (PrismaClientKnownRequestError) {
            throw new AppError("Tarefa não encontrada")
        }
        return response.status(200).json(tarefa)
    }
    public async delete(request: Request, response: Response) {
        const { id } = request.params;
        let tarefa = null;
        try {
            tarefa = await prismaC.tarafas.delete({
                where: { id }
            });
        } catch (PrismaClientKnownRequestError) {
            throw new AppError("Tarefa não encontrada")
        }
        return response.status(200).json(tarefa)
    }
}