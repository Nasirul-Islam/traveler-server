const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.la6rz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("traveler");
        const servicescollection = database.collection("services");
        const newservicescollection = database.collection("newservices");
        const ordercollection = database.collection("order");
        console.log('connect to database')

        //GET API
        app.get('/serveces', async (req, res) => {
            const services = servicescollection.find({});
            const result = await services.toArray();
            res.send(result);
        })
        //GET API
        app.get('/allorder', async (req, res) => {
            const allorder = ordercollection.find({});
            const result = await allorder.toArray();
            res.send(result);
        })
        //GET API
        app.get('/myorder', async (req, res) => {
            const orders = ordercollection.find({
                email: { $regex: req.query.search },
            });
            const myorders = await orders.toArray();
            res.send(myorders);
        })
        //GET API
        app.get('/newservices', async (req, res) => {
            const newservices = newservicescollection.find({});
            const result = await newservices.toArray();
            res.send(result);
        })
        // POST API
        app.post('/addservices', async (req, res) => {
            const service = req.body
            console.log(service);
            const result = await newservicescollection.insertOne(service);
            res.json(result);
        })
        // POST API
        app.post('/addorder', async (req, res) => {
            const order = req.body
            const result = await ordercollection.insertOne(order);
            res.json(result);
        });
        // DELETE API
        app.delete('/cancelorder/:id', async (req, res) => {
            const item = req.params.id;
            const result = await ordercollection.deleteOne({
                purchaseId: { $regex: req.params.id },
            })
            res.send(result);
            console.log(result);
        });
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Hi I am ready Let's go!")
})

app.listen(port, () => {
    console.log(`My Server listening at http://localhost:${port}`)
})