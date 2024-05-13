const express = require("express")
const app = express()
const { MongoClient } = require("mongodb")
const dotenv = require("dotenv")
dotenv.config()
const url = process.env.DATABASE_URL
const ObjectId = require("mongodb").ObjectId


const client = new MongoClient(url)
//cria o banco de dados com o nome dPessoas (create database dPessoais)
const db = client.db("d-pessoais");
//cria uma collection com o nome crud (create table crud)
const collection = db.collection("crud")

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:true}))

app.get('/index', (req, res)=>{
    res.render('index.ejs')
})



app.listen(3003, function(){
    console.log("o nosso servidor está rodando na porta 3000")
})

app.get("/ver", (req, res) => {
    res.send("Olá mundo!")
})

app.post("/show", (req, res) => {
    collection.insertOne(req.body, (err, result)=> {
        if(err) return console.log(err)
        console.log("SALVOU COM SUCESSO NO NOSSO BANCO DE DADOS")
        res.redirect("/show")
        collection.find().toArray((err, results) =>{
            console.log(results)
        })
       })
    })

app.get('/', (req, res) => {
    console.log("cursor")
    let cursor = db.collection('crud').find(ObjectId(id))
})

app.get('/show', (req, res) => {
    collection.find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('show.ejs', {crud: results})
    })
})
//criando o nosso edit
app.route('/edit/:id')
.get((req, res) => {
    var id = req.params.id

    db.collection('crud').find(ObjectId(id)).toArray((err, result) => {
        if(err) return res.send(err)
        res.render('edit.ejs', {crud: result})
    })
})
.post((req, res) => {
    var id = req.params.id
    var name = req.body.name
    var surname = req.body.surname

    db.collection('crud')
    .updateOne({_id: ObjectId(id)}, {
        $set: {
            name: name,
            surname: surname
        }
    }, (err, result) => {
        if(err) return res.send(err)
        res.redirect('/show')
        console.log('Banco de dados atualizado')
    })
})

app.route ('/delete/:id')
.get((req, res) => {
    var id = req.params.id

    db.collection('crud')
    .deleteOne({_id: ObjectId(id)}, 
    (err, result) => {
        if(err) return res.send(500, err)
        console.log('deletou o banco!')
        res.redirect('/show')
    })
})


