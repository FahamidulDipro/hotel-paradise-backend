const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

require("dotenv").config();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello From Hotel Paradise");
});

//Connecting to the database

const uri = `mongodb+srv://${process.env.user}:${process.env.password}@cluster0.1b2pwnn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const reservationCollection = client
      .db("hotel_db")
      .collection("reservation");

    app.get("/reservations", async (req, res) => {
      const reservations = await reservationCollection.find().toArray();
      res.send(reservations);
    });
    console.log("db connected!");
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(` listening on port ${port}`);
});
