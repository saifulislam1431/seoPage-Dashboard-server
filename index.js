const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.8cnv71c.mongodb.net/?retryWrites=true&w=majority`;
// const multer = require('multer');

app.use(cors());
app.use(express.json());

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });





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

    const allClients = client.db("seoPage").collection("allClients")
    const attachmentsCollection = client.db("seoPage").collection("attachments")



    app.get("/all-clients", async (req, res) => {
      const result = await allClients.find({}).toArray();
      res.send(result)
    })

    app.patch("/clients/:clientId",  async(req, res) => {

      const clientId = req.params.clientId;
      const newData = req.body;
      const filter = {_id: new ObjectId(clientId)};
      const user = await allClients.findOne(filter);
      if(user){
        const mergedAttachments = [...user.attachments, ...newData];

        const userUpdate = {
          $set: {
            attachments: mergedAttachments
          }
        };
       
        const result = await allClients.updateOne(filter, userUpdate);
      res.send(result);
      }
      else{
        res.json("Something Wrong")
      }

    })


    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Server successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get("/", (req, res) => {
  res.send("SeoPage Dashboard Server Running")
})

app.listen(port, () => {
  console.log(`Server listen at port ${port}`);
})