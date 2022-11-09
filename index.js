const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('server are running')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.9wccxu2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const serviceCollection = client.db('services').collection('items')

    app.get('/services', async (req, res) => {
        const result = await serviceCollection.find({}).limit(3).toArray();
        res.send(result);
    })
    app.get('/allservices', async (req, res) => {
        const result = await serviceCollection.find({}).toArray();
        res.send(result);
    })

    app.get('/services/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) }
        const result = await serviceCollection.findOne(query)
        // console.log(result);
        res.send(result)
    })
}
run().catch(err => console.log(err))
app.listen(port, () => {
    console.log(`server are running on: ${port}`);
})