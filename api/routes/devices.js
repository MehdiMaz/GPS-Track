const router = require("express").Router();
const Device = require("../models/Device");
const verify = require("../verifyToken");

//CREATE


router.post("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newDevice = new Device(req.body);
    try {
      const savedDevice = await newDevice.save();
      res.status(200).json(savedDevice);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed!");
  }
});

//UPDATE

router.put("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const updatedDevice = await Device.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedDevice);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed!");
  }
});

//DELETE

router.delete("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await Device.findByIdAndDelete(req.params.id);
      res.status(200).json("The movie has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed!");
  }
});

//GET

router.get("/find/:id", verify, async (req, res) => {  
  try {
    const device = await Device.findById(req.params.id);
    res.status(200).json(device);
  } catch (err) {
    res.status(500).json(err);
  }
});


//GET ALL

router.get("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const devices = await Device.find();
      res.status(200).json(devices.reverse());  // get the most recent
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed!");
  }
});



//Post Gps Data 

router.post("/addgpsdata/:id",(req,res) =>{
  const {assetnumber, latitude, longitude} = req.body;
  let errors = [];

  if(!assetnumber || !latitude || !longitude){
    errors.push({msg : "Parameters are missing"});
  }
  if(errors.length>0){
    res.json({Message : errors})
  }else{
    const newgpsdata = new gpsdata({
      assetnumber,
      latitude,
      longitude
    });

    newgpsdata
    .save()
    .then(newgpsdata => {
      res.json({ Message: "Data Inserted"});
    })
    .catch(err => console.log(err));
  }
});


 //get Gps Data 

router.get("/getdata/:assetnumber",(req,res) =>{
  var assetnumber = req.params.assetnumber;
  console.log(assetnumber);

  gpsdata.find({assetnumber: assetnumber}).exec((err, notenumber)=>{
       console.log(notenumber);
       res.json(notenumber);
  });
});





exports.pushOrderInPurchaseList = (req, res, next) => {
  
  let purchases = [];
  req.body.order.products.forEach(product => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id
    });
  });

  //store thi in DB
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchases } },
    { new: true }, // send the new object updated not the old one
    (err, purchases) => {
      if (err) {
        return res.status(400).json({
          error: "Unable to save purchase list"
        });
      }
      next();
    }
  );
};




module.exports = router;