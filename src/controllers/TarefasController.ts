import { Request, Response } from "express";
import { prismaC } from '../prisma'
import { AppError } from "../errors/AppError";
import Zod from "zod"

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
        const bodySchema = Zod.object({
            titulo: Zod.string().min(3).nullish(),
            descricao: Zod.string().min(3).nullish()
        }).strict()
        const { titulo, descricao } = bodySchema.parse(request.body);
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
        const bodySchema = Zod.object({
            titulo: Zod.string().min(3).nullish(),
            descricao: Zod.string().min(3).nullish(),
            status: Zod.string().nullish()
        }).strict()
        const { titulo, descricao, status }: {
            titulo: string | undefined;
            descricao: string | undefined;
            status: string | undefined;
          } = {
            titulo: bodySchema.parse(request.body).titulo || undefined,
            descricao: bodySchema.parse(request.body).descricao || undefined,
            status: bodySchema.parse(request.body).status || undefined,
          };
        let tarefa = null;
        let data = {}
        if (titulo) data = {titulo}
        if (descricao) data = {...data, descricao}
        if (status) data = {...data, status}
        try {
            tarefa = await prismaC.tarafas.update({
                where: {
                    id
                },
                data: {
                    titulo,
                    descricao,
                    status
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