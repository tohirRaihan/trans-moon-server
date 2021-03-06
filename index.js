const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tqvty.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function run() {
    try {
        await client.connect();
        const database = client.db('trans_moon');
        const serviceCollection = database.collection('services');
        const orderCollection = database.collection('orders');

        // --------------------------Services API--------------------------
        // GET services
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // Find one service
        app.get('/services/:id', async (req, res) => {
            const serviceId = req.params.id;
            const query = { _id: ObjectId(serviceId) };
            const result = await serviceCollection.findOne(query);
            res.send(result);
        });

        // CREATE service
        app.post('/services', async (req, res) => {
            console.log(req.body);
            const newService = req.body;
            console.log(newService);
            const result = await serviceCollection.insertOne(newService);
            res.json(result);
        });

        // ---------------------------Orders API---------------------------
        // GET orders
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // FIND orders by a user id
        app.get('/orders/:userId', async (req, res) => {
            const userId = req.params.userId;
            console.log(userId);
            const query = { userId: userId };
            console.log(query);
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        });

        // CREATE order
        app.post('/orders', async (req, res) => {
            console.log(req.body);
            const newOrder = req.body;
            console.log(newOrder);
            const result = await orderCollection.insertOne(newOrder);
            res.json(result);
        });

        // UPDATE order
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);

            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: 'approved'
                }
            };
            const result = await orderCollection.updateOne(filter, updateDoc);
            res.json(result);
        });

        // DELETE order
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        });
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
