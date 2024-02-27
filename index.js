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
  rating: {
    type: Number,
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

// get all user data
app.get("/user", async (req, res) => {
  try {
    const roll = req.query.roll;
    const rating = req.query.rating;
    let userData;
    if (roll && rating) {
      // userData = await userModel.find({roll : {$gte:roll}});
      userData = await userModel
        .find({
          $nor: [{ roll: { $eq: roll } }, { rating: { $eq: rating } }],
        })
        .sort({ roll: -1 });
    } else {
      userData = await userModel.find().sort({ roll: -1 }).select({ roll: 0 });
    }

    if (userData) {
      res.status(200).send({
        success: true,
        message: "return all users",
        data: userData,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "user is not found",
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// get single user data
app.get("/user/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const userData = await userModel.findOne({ _id: id });
    if (userData) {
      res.status(200).send({
        message: "return single product",
        success: true,
        data: userData,
      });
    } else {
      res.status(404).send({
        message: "This user is not found",
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// post user data
app.post("/user", async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const rating = req.body.rating;
    const roll = req.body.roll;
    const newUser = new userModel({
      name: name,
      email: email,
      rating: rating,
      roll: roll,
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

// update user data
app.put("/user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const name = req.body.name;
    const email = req.body.email;
    const rating = req.body.rating;
    const roll = req.body.roll;
    const userData = await userModel.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
           name: name,
           email: email,
           rating: rating,
           roll : roll
          },
      },
      { new: true }
    );
    if (userData) {
      res
        .status(200)
        .send({ success: true, message: "this user is updated", userData });
    } else {
      res
        .status(404)
        .send({ success: false, message: "this user is not found" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// delete single ussr
app.delete("/user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const userData = await userModel.findByIdAndDelete({ _id: id });
    if (userData) {
      res
        .status(200)
        .send({
          message: "this user was deleted",
          data: userData,
          success: true,
        });
    } else {
      res.status(404).send({ message: "This id is not found", success: false });
    }
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
