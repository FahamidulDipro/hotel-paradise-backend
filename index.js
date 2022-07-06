const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

    const roomsCollection = client.db("hotel_db").collection("rooms");
    const userCollection = client.db("hotel_db").collection("users");

    app.get("/rooms", async (req, res) => {
      const rooms = await roomsCollection.find().toArray();
      res.send(rooms);
    });
    //Adding Reservation info to database
    app.post("/reservations", async (req, res) => {
      const reservationInfo = req.body;
      const result = await reservationCollection.insertOne(reservationInfo);
      res.send(result);
    });
    //Getting Reservation info
    app.get("/reservations", async (req, res) => {
      const reservations = await reservationCollection.find().toArray();
      res.send(reservations);
    });
    //Updating Reservation Status
    app.put("/rooms/:id", async (req, res) => {
      const id = req.params.id;
      const reservationInfo = req.body;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updatedDoc = {
        $set: reservationInfo,
      };
      const result = await roomsCollection.updateOne(
        filter,
        updatedDoc,
        option
      );
      res.send(result);
    });
    //Updating Users Registration Information
    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;

      const user = req.body;
      console.log(email, user);
      const filter = { email: email };
      const option = { upsert: true };

      const updatedDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(filter, updatedDoc, option);

      res.send(result);
    });
    //Getting all users
    app.get("/users", async (req, res) => {
      const users = await userCollection.find().toArray();
      res.send(users);
    });
    //Updating Price
    app.put("/updatePrice", async (req, res) => {
      const { roomId, price } = req.body;
      const filter = { _id: ObjectId(roomId) };
      const option = { upsert: false };
      const updateDoc = {
        $set: { price: price },
      };
      const result = await roomsCollection.updateOne(filter, updateDoc, option);
      res.send(result);
      console.log(roomId, price);
    });
    console.log("db connected!");
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(` listening on port ${port}`);
});
