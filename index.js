const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
dotenv.config();
const uri = process.env.MONGODB_URL;
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        await client.connect();
        const db = client.db("pet-plutform");
        const petCollection = db.collection("pet");
        const adapCollection = db.collection("adaptions");
        app.get("/pet", async (req, res) => {
            const result = await petCollection.find().limit(6).toArray();
            //console.log(result);
            res.json(result);
        });
        app.get("/pets", async (req, res) => {
            //const petData = res.body;
            const result = await petCollection.find().toArray();
            res.json(result);
            // console.log(result, "getPetData");
        });

        app.get("/pets/:userId", async (req, res) => {
            const { userId } = req.params;
            console.log(userId);
            const result = await petCollection.find({userId}).toArray();
            res.json(result);
        });
        app.get("/pet/:id", async (req, res) => {
            const { id } = req.params;
            const result = await petCollection.findOne({
                _id: new ObjectId(id),
            });
            res.json(result);
        });

        app.post("/pet", async (req, res) => {
            const petData = req.body;
            //console.log(petData);
            const result = await petCollection.insertOne(petData);
            res.json(result);
        });
        app.post("/adaption", async (req, res) => {
            const adaptionData = req.body;
            const result = await adapCollection.insertOne(adaptionData);
            res.json(result);
        });
        app.get("/adaption/:userId", async (req, res) => {
            const { userId } = req.params;
            //console.log(userId, "userID");
            const result = await adapCollection
                .find({ userId: userId })
                .toArray();

            res.json(result);
        });
        app.patch("/pet/:id", async (req, res) => {
            const { id } = req.params;
            //console.log(id, "id");
            const updateData = req.body;
            const result = await petCollection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: updateData,
                },
            );
            res.json(result);
        });
        app.delete("/adaption/:id", async (req, res) => {
            const { id } = req.params;
            const result = await adapCollection.deleteOne({
                _id: new ObjectId(id),
            });
            res.json(result);
        });

        await client.db("admin").command({ ping: 1 });
        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!",
        );
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
