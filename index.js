const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())


// userName: wow6071
// password: 78K64czvgGZpKBTp



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pcu2phw.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    await client.connect();
   
    const itemCollection = client.db("wowProduct").collection("item");
    console.log("connected wow db");

// get api
//http://localhost:5000/items
app.get('/items', async(req,res)=>{
    const query = req.query;
    const cursor = itemCollection.find(query);
    const result = await cursor.toArray();
    res.send(result)
})

//Post api
//http://localhost:5000/item
app.post('/item', async(req,res)=>{
    const newItem = req.body;
    console.log("new item is",newItem);
    const result = await itemCollection.insertOne(newItem);
    res.send(result)
})

// update api
app.put('/item/:id', async(req,res)=>{
    const id = req.params.id;
    const newItem = req.body;
    const filter = { _id: new ObjectId(id)};
    const options = { upsert: true };
    const updateDoc = {
        $set: newItem,
      };
      const result = await itemCollection.updateOne(filter, updateDoc, options);

    console.log("from put",id);
    res.send(result)
})

//delete api
app.delete('/item/:id', async(req,res)=>{
    const id = req.params.id;
    const query = { _id: new ObjectId(id)};
    const result = await itemCollection.deleteOne(query);
    res.send(result)
})

  } finally {
    
    // await client.close();
  }
}
run().catch(console.dir);
app.get('/', (req,res)=>{
    res.send('Running My Wow Server')
})
app.listen(port, ()=>{
    console.log("CRUD wow server running");
})

/* https://i.ibb.co/kQ93XL5/6-A13-C3-D4-5290-53-BC-8953-7-E5-CDCD7-B80-C.jpg
https://i.ibb.co/jr0VSKr/321-A18-CB-06-AD-A418-1-A89-4-BA06-E42-B186-800x800-85.jpg
https://i.ibb.co/k6nF1fQ/9713718-F-09-CC-729-B-8-A4-A-0-BC73-DAFCB91-800x800-85.jpg
https://i.ibb.co/KXnKDps/images.jpg */
