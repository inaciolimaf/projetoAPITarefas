import request from "supertest"
import {app} from './server'
import { prismaC } from "./prisma"

describe("Update Tarefa API Test", ()=>{
    beforeEach(async ()=>{
        await prismaC.tarafas.deleteMany({})
        const result = await request(app).post('/tarefas/create').send({
            "titulo": "Your Title",
            "descricao": "Your Description"
        })
    })
    it('Deve modificar uma tarefa completa', async ()=>{
        const tarefa = await prismaC.tarafas.findFirst()
        const result = await request(app).put('/tarefas/update/'+tarefa?.id).send({
            "titulo": "Your Title new",
            "descricao": "Your Description new",
            "status": "Em andamento"
        })
        expect(result.statusCode).toEqual(200)
        expect(result.body).toHaveProperty('status')
        expect(result.body.titulo).toEqual("Your Title new")
        expect(result.body.descricao).toEqual("Your Description new")
        expect(result.body.status).toEqual("Em andamento")
    })
    it('Deve modificar uma tarefa apenas título', async ()=>{
        const tarefa = await prismaC.tarafas.findFirst()
        const result = await request(app).put('/tarefas/update/'+tarefa?.id).send({
            "titulo": "Your Title new"
        })
        expect(result.statusCode).toEqual(200)
        expect(result.body).toHaveProperty('id')
        expect(result.body.titulo).toEqual("Your Title new")
        expect(result.body.descricao).toEqual("Your Description")
    })
    it('Deve modificar uma tarefa apenas descricao', async ()=>{
        const tarefa = await prismaC.tarafas.findFirst()
        const result = await request(app).put('/tarefas/update/'+tarefa?.id).send({
            "descricao": "Your Description new"
        })
        expect(result.statusCode).toEqual(200)
        expect(result.body).toHaveProperty('id')
        expect(result.body.titulo).toEqual("Your Title")
        expect(result.body.descricao).toEqual("Your Description new")
    })
    it("Deve retornar erro Tarefa não encontrada",async () => {
        const result = await request(app).put('/tarefas/update/'+1).send({
            "titulo": "Your Title new",
            "descricao": "Your Description new"
        })
        expect(result.statusCode).toEqual(400)
        expect(result.body).toHaveProperty('message')
        expect(result.body.message).toEqual("Tarefa não encontrada")
    })
    it('Deve retornar erro titulo curto', async () => {
        const tarefa = await prismaC.tarafas.findFirst()
        const result = await request(app).put('/tarefas/update/'+tarefa?.id).send({
            "titulo": "Yo"
        })
        expect(result.statusCode).toEqual(500)
        expect(result.body).toHaveProperty('issues')
        expect(result.body.issues[0].code).toEqual("too_small")
    })
})
