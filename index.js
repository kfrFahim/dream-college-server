const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

// Middlewere
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6eoz53h.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();

const collegeCollection = client.db("collegeDB").collection("colleges");
const admissionCollection = client.db("collegeDB").collection("admissions");
const reviewCollection = client.db("collegeDB").collection("reviews");

    // Colleges
    app.get("/colleges", async (req, res) => {
     const result = await collegeCollection.find().toArray();
     res.send(result);
   });

   app.get("/colleges/:id" ,async(req,res)=>{
     const id = req.params.id
     const query = {_id: new ObjectId(id)};
     const result = await collegeCollection.findOne(query)
     res.send(result)
   })

  //  Checkout for admission
   app.post("/admissions", async (req, res) => {
    const body = req.body;
    const result = await admissionCollection.insertOne(body);
    res.send(result);
    console.log(body);
  });

  // Get admission data
  app.get("/admission", async (req, res) => {
    const cursos = admissionCollection.find();
    const result = await cursos.toArray();
    res.send(result);
  });


   // review related apis
   app.get('/reviews', async (req, res) => {
    const result = await reviewCollection.find().toArray();
    res.send(result);
  })










    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
//     await client.close();
  }
}
run().catch(console.dir);



app.get("/", (req, res) => {
  res.send("Dream College Server Running");
});

app.listen(port, () => {
  console.log(`Dream College server is running on port ${port}`);
});