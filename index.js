const express = require("express");
const mongoose = require("mongoose");
const app = express();

const port = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// connect Database
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/KongkonDb");
    console.log("Database is connected");
  } catch (error) {
    console.log("Database is not connected");
    console.log(error.message);
    process.exit(1);
  }
};

// create user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  roll: {
    type: Number,
    require: true,
  },
  createOn: {
    type: Date,
    default: Date.now,
  },
});

// create user model
const userModel = mongoose.model("userDatabase", userSchema);

// get user data 
app.get("/user", async (req, res)=>{
    try {
        const userData = await userModel.find();
        res.status(200).send(userData)
    } catch (error) {
        res.status(500).send({message : error.message})
    }
})

// get single user data 
app.get("/user/:id", async (req, res)=>{
    try {
        const id = req.params.id;
        
        const userData = await userModel.findOne({_id:id});
        res.status(200).send(userData)
    } catch (error) {
        res.status(500).send({message : error.message})
    }
})

// post user data
app.post("/user", async (req, res) => {
  try {
        const name = req.body.name;
        const email = req.body.email;
        const roll = req.body.roll;
        const newUser = new userModel({
            name : name,
            email : email,
            roll : roll
        });
       const userData = await newUser.save();
    // const userData = await userModel.insertMany([
    //   {
    //     name: "dalim",
    //     email: "dalim@gamil.com",
    //     roll: 34567,
    //   },
    //   {
    //     name: "mehedi",
    //     email: "mehedi@gamil.com",
    //     roll: 345670,
    //   },
    //   {
    //     name: "dalim Kazi",
    //     email: "dalimkazi@gamil.com",
    //     roll: 342345,
    //   }
    // ]);
    res.status(202).send(userData);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// home route
app.get("/", (req, res) => {
  res.send("This is home route");
});
// page not found
app.use((req, res, next) => {
  res.status(404).send({ message: "This url is not found" });
});
// server error
app.use((err, req, res, next) => {
  res.status(500).send({ message: "Server is somethings broke" });
});
app.listen(port, async (req, res) => {
  console.log(`Server is running successfully at http://localhost:${port}`);
  await connectDB();
});
