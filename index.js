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
    const reviewCollection = client.db('services').collection('review')

    app.get('/services', async (req, res) => {
        const result = await serviceCollection.find({}).limit(3).toArray();
        res.send(result);
    })
    app.get('/allservices', async (req, res) => {
        const result = await serviceCollection.find({}).toArray();
        res.send(result)
    })

    app.get('/services/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) }
        const result = await serviceCollection.findOne(query)
        // console.log(result);
        res.send(result)
    })

    app.post('/services', async(req, res) => {
        const service = req.body;
        const result = await serviceCollection.insertOne(service)
        res.send(result)
    })

    app.post('/review', async (req, res) => {
        const review = req.body;
        const result = await reviewCollection.insertOne(review)
        res.send(result);
    })
    app.get('/review', async (req, res) => {
        let query = {};
        if (req.query.email) {
            query = {
                email: req.query.email
            }
        }
        const result = await reviewCollection.find(query).toArray()
        res.send(result);
    })
    app.delete('/review/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) }
        const result = await reviewCollection.deleteOne(query)
        res.send(result);
    })
}
run().catch(err => console.log(err))
app.listen(port, () => {
    console.log(`server are running on: ${port}`);
})