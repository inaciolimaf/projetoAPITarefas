import request from "supertest"
import { app } from './server'
import { prismaC } from "./prisma"

describe("Get Tarefas API", () => {
    it("Deve ler tarefa por ID", async () => {
        await request(app).post('/tarefas/create').send({
            "titulo": "Your Title",
            "descricao": "Your Description"
        })
        const tarefa = await prismaC.tarafas.findFirst()
        const result = await request(app).get('/tarefas/show/' + tarefa?.id)
        expect(result.statusCode).toEqual(200)
        expect(result.body).toHaveProperty('id')
        expect(result.body.id).toEqual(tarefa?.id)
    })
    it("Deve retornar erro Tarefa não encontrada", async () => {
        const result = await request(app).get('/tarefas/show/' + 1)
        expect(result.statusCode).toEqual(400)
        expect(result.body).toHaveProperty('message')
        expect(result.body.message).toEqual("Tarefa não encontrada")
    })
})
