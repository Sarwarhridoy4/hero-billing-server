const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();

const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());


const uri = process.env.uri
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const userCollections = client.db("hero-billing").collection("userCollections");
        const billingList = client.db("hero-billing").collection("billingList");
        
        //add consumers while registering
        app.put('/registration', async (req, res) => {
            const user = req.body
            const email = user.email
            const filter = { email: email }
            const options = { upsert: true }
            const updateDoc = {
                $set: user,
            }
            const result = await userCollections.updateOne(filter, updateDoc, options);
            res.send(result);
        }); 
        app.get('/login', async (req, res) => {
            const query ={}
            const cursor = await userCollections.find(query);
            const users = await cursor.toArray();
            res.send(users);
        }); 
        app.get('/billing-list', async (req, res) => {
            const query ={}
            const cursor = await billingList.find(query);
            const billings = await cursor.toArray();
            const count = billingList.estimatedDocumentCount();
            res.send(billings);
        }); 
        app.post('/add-billing', async (req, res) => {
            const body = req.body;
            const result = billingList.insertOne(body);
            res.send(result);
        }); 

        app.get('/update-billing/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            // console.log(query);
            const result = await billingList.findOne(query);
            res.send(result);
        });
        app.put('/update-billing/:id', async (req, res) => {
            const id = req.params.id;
            const updatedbill = req.body;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: updatedbill,
            }
            const result = await billingList.updateOne(filter, updateDoc, options)
            res.send(result)
        }); 

        
    }
    finally {
        
    }
}

run().catch(err => console.log(err))



app.get('/', async (req, res) => {
    res.send('Hero-BillingHero-Billing server is running');
})

app.listen(port, () => console.log(`Hero-Billing server running on ${port}`))