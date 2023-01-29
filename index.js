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
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const UserCollection = client.db("hero-billing").collection("userCollections");
        
        //add consumers while registering
        app.put('/user', async (req, res) => {
            const user = req.body
            const email = user.email
            const filter = { email: email }
            const options = { upsert: true }
            const updateDoc = {
                $set: user,
            }
            const result = await UserCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        }); 
    }
    finally {
        
    }
}

run().catch(err => console.log(err))



app.get('/', async (req, res) => {
    res.send('B-Commerce server is running');
})

app.listen(port, () => console.log(`Hero-Billing server running on ${port}`))