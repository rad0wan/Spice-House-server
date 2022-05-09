const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware 

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://db-spice:GPAqNg9sWfGEwhwb@spice-house0.ajwla.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();

        const spiceCollection = client.db('spice').collection('product')

        app.get('/products', async (req, res) => {
            const query = {}
            const cursor = spiceCollection.find(query)
            const products = await cursor.toArray()
            res.send(products);
            console.log(products);
        })

        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const product = await spiceCollection.findOne(query)
            res.send(product)
        })

        app.delete('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await spiceCollection.deleteOne(query)
            res.send(result)
            console.log(result);
        })

        app.post('/products', async (req, res) => {
            const newItem = req.body;
            const result = await spiceCollection.insertOne(newItem);
            res.send(result)

        })

        app.put('/inventory/:id', (req, res) => {
            const filter = req.body
            console.log(req.body);
        })

    }
    finally {

    }

}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Spice House Api is running')
})

app.listen(port, () => {
    console.log('Spice House Server is running', port);
})