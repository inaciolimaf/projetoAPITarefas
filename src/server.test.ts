import request from "supertest"
import {app} from './server'
import { prismaC } from "./prisma"

describe("Criar Tarefa API Test", ()=>{
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
})

describe("Get Tarefas API", ()=>{
    it("Deve ler tarefa por ID", async ()=>{
        await request(app).post('/tarefas/create').send({
            "titulo": "Your Title",
            "descricao": "Your Description"
          })
        const tarefa = await prismaC.tarafas.findFirst()
        const result = await request(app).get('/tarefas/show/'+tarefa?.id)
        expect(result.statusCode).toEqual(200)
        expect(result.body).toHaveProperty('id')
        expect(result.body.id).toEqual(tarefa?.id)
    })
    it("Deve retornar erro Tarefa não encontrada",async () => {
        const result = await request(app).get('/tarefas/show/'+1)
        expect(result.statusCode).toEqual(400)
        expect(result.body).toHaveProperty('message')
        expect(result.body.message).toEqual("Tarefa não encontrada")
    })
})
describe("List Tarefas API", ()=>{
    beforeAll(async ()=>{
        await prismaC.tarafas.deleteMany({})
    })
    it("Deve listar as tarefas", async ()=>{
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
describe("Update Tarefa API Test", ()=>{
    beforeEach(async ()=>{
        await prismaC.tarafas.deleteMany({})
        const result = await request(app).post('/tarefas/create').send({
            "titulo": "Your Title",
            "descricao": "Your Description"
        })
    })
    it('Deve modificar uma tarefa completa', async ()=>{
        await request(app).post('/tarefas/update').send({
            "titulo": "Your Title",
            "descricao": "Your Description"
          })
        const tarefa = await prismaC.tarafas.findFirst()
        const result = await request(app).put('/tarefas/update/'+tarefa?.id).send({
            "titulo": "Your Title new",
            "descricao": "Your Description new"
        })
        expect(result.statusCode).toEqual(200)
        expect(result.body).toHaveProperty('id')
        expect(result.body.titulo).toEqual("Your Title new")
        expect(result.body.descricao).toEqual("Your Description new")
    })
    it('Deve modificar uma tarefa apenas título', async ()=>{
        await request(app).post('/tarefas/update').send({
            "titulo": "Your Title",
            "descricao": "Your Description"
          })
        const tarefa = await prismaC.tarafas.findFirst()
        const result = await request(app).put('/tarefas/update/'+tarefa?.id).send({
            "titulo": "Your Title new"
        })
        expect(result.statusCode).toEqual(200)
        expect(result.body).toHaveProperty('id')
        expect(result.body.titulo).toEqual("Your Title new")
        expect(result.body.descricao).toEqual("Your Description")
    })
    it("Deve retornar erro Tarefa não encontrada",async () => {
        await request(app).post('/tarefas/create').send({
            "titulo": "Your Title",
            "descricao": "Your Description"
        })
        const result = await request(app).put('/tarefas/update/'+1).send({
            "titulo": "Your Title new",
            "descricao": "Your Description new"
        })
        expect(result.statusCode).toEqual(400)
        expect(result.body).toHaveProperty('message')
        expect(result.body.message).toEqual("Tarefa não encontrada")
    })
})
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
