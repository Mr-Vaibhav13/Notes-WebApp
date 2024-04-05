const express = require('express')
const cors = require('cors')
const {PrismaClient} = require('@prisma/client')

const app = express()

const prisma = new PrismaClient()

app.use(express.json())
app.use(cors())


app.get('/api/notes',async (req,res)=>{

    const notes = await prisma.note.findMany();

    res.json(notes)
})



app.post('/api/notes',async (req,res)=>{

    const {title, content} = await req.body;

    if(!title || !content){
        return res.status(400).send("Title and content field required")
    }

    try{
        const note = await prisma.note.create({
            data:{title,content}
        })
    
        res.json(note)
    }
    catch (error) {
        res.status(500).send("Oops! something went wrong")
    }
})



app.put('/api/notes/:id', async (req,res)=>{
    
    const {title, content} = req.body
    const id =  parseInt(req.params.id)

    if(!id || isNaN(id)){
        return res.status(400).send("Id param have some problem")
    }

    if(!title || !content){
        return res.status(400).send("title and content fields required")
    }


    try{
        const UpdateNote = await prisma.note.update({
            where: {id},
            data: {title, content}
        })
        res.json(UpdateNote);
    }
    catch(error){
        res.status(500).send("Oops! something went wrong");
    }

    
})



app.delete('/api/notes/:id', async(req,res)=>{
    const id = parseInt(req.params.id)
    
    if (!id || isNaN(id)) {
        return res.status(400).send("Id param have some problem");
    }

    try {
        await prisma.note.delete({
        where:{id}
    })
        res.status(204).send();
    }

    catch(error){
        res.status(500).send("Oops! Something went wrong");
    }
})


app.listen(5000, ()=>{
    console.log("Server running on port 5000")
})