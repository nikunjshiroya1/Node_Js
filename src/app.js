const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs')
const validator = require('email-validator');

// const uri = "mongodb://localhost:27017/";
// const client = new MongoClient(uri);

mongoose.connect('mongodb://127.0.0.1:27017/', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(11111111);
  }).catch(err => {//we will not be here...
    console.error('App starting error:', err.stackw);
    process.exit(1);
  });
app.set('view engine', 'hbs')

const templatePath = path.join(__dirname, '../templets')
const publicPath = path.join(__dirname, '../public')

app.set('views', templatePath);
app.use(express.static(publicPath));

const playList = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 200,
  },
  mo_no: {
    type: Number,
    required: true,
    min: [10, 'Phone number should contain at least ten digits!'],
    trim: true
  },

  address: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    validate(email) {
      if (!validator.validate(email)) {
        console.log("Please Enter Valid Email")
        throw "Please Enter Valid Email";
      }
    }
  },
  data: {
    type: Number,
    validate(value) {
      if (value <= 0) {
        console.log("Pleass Enter > 0")
        throw "Please Enter > 0";
      }
    }
  },
})

const PlayList = new mongoose.model('PlayList', playList);

app.get("/", (req, res) => {
  res.render('register');
})

app.get("/user/store", async (req, res) => {
  const name = req.query.name
  const email = req.query.email
  const mo_no = req.query.mo_no
  const data = req.query.data
  const address = req.query.address
  console.log(req.query);
  const user = new PlayList({
    name: name,
    mo_no: mo_no,
    address: address,
    email: email,
    data: data,
  })
  user.save();
  responseData = {
    "message": "Data Inserted Successfully.",
  }
  const jsonContent = JSON.stringify(responseData);
  res.end(jsonContent);
})

//Update user
app.get("/user/update,", async (req, res) => {
  var id = req.query.id
  var req = req.query;

  const update = await PlayList.updateOne({ _id: id }, {
    name: req.name,
    mo_no: req.mo_no,
    address: req.address,
    email: req.email,
    data: req.data,
  })
  res.redirect('list')
})

app.get("/user/list", async (req, res) => {
  const users = await PlayList.find();

  res.render('user-list', { users: users })
})


app.get("/user/edit", async (req, res) => {
  const id = req.query.id;
  const user = await playList.findById(id);

  res.render('user-edit', {user:user})
})


// saveData = async () => {
//   const data = new PlayList({
//     name: "aaaaa",
//     mo_no: "8888888888",
//     address: "test",
//     email: "aa@gmaila.com",
//     data: "765",
//   })
//   data.save();
// }
// saveData();

app.get("/user/delete", async (req, res) => {
  const id = req.query.id;
  const delete_data = await PlayList.findByIdAndDelete({ _id:id });
  res.redirect('back')
})
readData = async () => {

  // const readData = await PlayList.find().select({name:1,data:1});
  // const readData = await PlayList.find().limit(4);
  // const readData = eawait PlayList.find({data: {$gte:12}}).select({data:1});
  const readData = await PlayList.find({ $and: [{ data: { $ne: 10 } }, { name: "aaa" }] }).select({ data: 1 }).count();

  console.log('-------------------------------------------------------------------------------');
  console.log(readData);

}



// readData() 


// update

updateData = async (_id) => {
  const data = await PlayList.updateOne({ _id }, {
    name: "aabbccdd",
  })
}

// // updateData('64b7bc3349bdc20aeeb419bc');

// delete

deleteData = async (_id) => {
  const data = await PlayList.deleteOne({ _id });
}

// deleteData('64b7bc3349bdc20aeeb419bc');

app.listen(3000)