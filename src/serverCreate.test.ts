import request from "supertest"
import {app} from './server'
import { prismaC } from "./prisma"

describe("Create Tarefa API Test", ()=>{
    it('Deve criar uma tarefa', async ()=>{
        const result = await request(app).post('/tarefas/create').send({
            "titulo": "Your Title",
            "descricao": "Your Description"
          })
        expect(result.statusCode).toEqual(200)
        expect(result.body).toHaveProperty('id')
        expect(result.body.titulo).toEqual("Your Title")
    })
    it('Deve retornar erro sem descricao', async ()=>{
        const result = await request(app).post('/tarefas/create').send({
            "titulo": "Your Title"
          })
        expect(result.statusCode).toEqual(400)
        expect(result.body).toHaveProperty('message')
        expect(result.body.message).toEqual("Faltando descricao no body")
    })
    it('Deve retornar erro sem titulo', async ()=>{
        const result = await request(app).post('/tarefas/create').send({
            "descricao": "Your Description"
          })
        expect(result.statusCode).toEqual(400)
        expect(result.body).toHaveProperty('message')
        expect(result.body.message).toEqual("Faltando titulo no body")
    })
    it('Deve retornar erro titulo curto', async () => {
        const result = await request(app).post('/tarefas/create').send({
            "titulo": "Yo"
          })
        expect(result.statusCode).toEqual(500)
        expect(result.body).toHaveProperty('issues')
        expect(result.body.issues[0].code).toEqual("too_small")
    })
})

