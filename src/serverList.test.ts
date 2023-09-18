import request from "supertest"
import { app } from './server'
import { prismaC } from "./prisma"

describe("List Tarefas API", () => {
    beforeAll(async () => {
        await prismaC.tarafas.deleteMany({})
    })
    it("Deve listar as tarefas", async () => {
        await request(app).post('/tarefas/create').send({
            "titulo": "Your Title",
            "descricao": "Your Description"
        })
        await request(app).post('/tarefas/create').send({
            "titulo": "Your Title",
            "descricao": "Your Description"
        })
        const result = await request(app).get('/tarefas/list/')
        expect(result.statusCode).toEqual(200)
        expect(result.body.length).toEqual(2)
    })
})
