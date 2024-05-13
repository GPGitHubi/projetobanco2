const express = require ("express")
const app = express()
const { MongoClient } = require("mongodb-legacy")
const ObjectId = require("mongodb-legacy").ObjectId
const dotenv = require("dotenv")
dotenv.config()
const url = process.env.DATABASE_URL
const client = new MongoClient(url)
//ciria o banco de dados  ↓
const db = client.db("d-pessoais");
//cria uma collection com o nome crud  ↓
 const collection = db.collection('crud')

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:true}))

app.get('/index', (req, res) => {
    res.render('index.ejs')
})

app.listen(3000, function(){
    console.log("o nosso servidor está rodando na porta 3000")
})

app.get('/', (req, res) => {
    let cursor = db.collection('crud').find()
})

app.get("/ver",(req, res) => {
    res.send("olá, pessoas.")
})

app.post('/show', (req, res) => {
    collection.insertOne(req.body, (err, result) => {
        if(err) return console.log(err)
        console.log("Salvou com sucesso")
        res.redirect("/show")
        collection.find().toArray((err, result) =>{
            console.log(result)
        })
})

app.get('/show', (req, res) => {
   collection.find().toArray((err, results) =>{
     if(err) return console.log(err)
     res.render('show.ejs', {crud: results})
   
 })
}) 
})

app.route('/edit/:id')
.get((req, res)=> {
    var id = req.params.id

    db.collection('crud')
    .find(ObjectId(id))
    .toArray((err, result)=>{
        if(err) return res.send(err)
        res.render("edit.ejs", {crud: result})
    })
})
.post((req, res)=> {
    var id = req.params.id
    var name = req.body.name
    var surname = req.body.surname

    db.collection("crud")
    .updateOne({_id: ObjectId(id)},{
        $set:{
            name: name,
            surname: surname
        }
        }, (err, result) => {
            if(err) return res.send(err)
            res.redirect('/show')
            console.log('db atualizado')
        })
})

app.route('/delete/:id')
.get((req, res) => {
    var id = req.params.id

    db.collection('crud').deleteOne({_id: ObjectId(id)},
    (err, result)=> {
        if(err) return res.send(500, err)
            console.log(' do banco foi deletado.')
        res.redirect('/show')
    })
})