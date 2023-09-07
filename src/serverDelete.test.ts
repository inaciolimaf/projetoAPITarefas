import request from "supertest"
import {app} from './server'
import { prismaC } from "./prisma"

describe("Delete Tarefas API", ()=>{
    beforeAll(async ()=>{
        await prismaC.tarafas.deleteMany({})
    })
    it("Deve deletar tarefa por ID", async ()=>{
        await request(app).post('/tarefas/create').send({
            "titulo": "Your Title",
            "descricao": "Your Description"
          })
        const tarefa = await prismaC.tarafas.findFirst()
        const result = await request(app).delete('/tarefas/delete/'+tarefa?.id)
        expect(result.statusCode).toEqual(200)
        expect(result.body).toHaveProperty('id')
        expect(result.body.id).toEqual(tarefa?.id)
    })
    it("Deve retornar erro Tarefa não encontrada",async () => {
        await request(app).post('/tarefas/create').send({
            "titulo": "Your Title",
            "descricao": "Your Description"
        })
        const result = await request(app).delete('/tarefas/delete/'+1)
        expect(result.statusCode).toEqual(400)
        expect(result.body).toHaveProperty('message')
        expect(result.body.message).toEqual("Tarefa não encontrada")
    })
})
