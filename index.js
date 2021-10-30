const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

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

console.log(uri);

async function run() {
    try {
        await client.connect();
        console.log('database connecteed successfully');
        const database = client.db('trans_moon');
        const serviceCollection = database.collection('services');

        // GET services API
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const count = await cursor.count();

            const services = await cursor.toArray();

            res.send(services);
        });
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
