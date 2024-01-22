const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://cornersteel:comfac123@calendar.o4yqwwp.mongodb.net/comfac")
  .then(() => {
    console.log("mongodb connected");
  })
  .catch((e) => {
    console.log(e);
  });
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()
const userRoute = require('./routes/userRoute');
const projectRoute = require('./routes/projectRoute');
const peopleRoute = require('./routes/peopleRoute');
const eventsRoute = require('./routes/eventsRoute');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use('/', userRoute);
app.use('/', projectRoute);
app.use('/', peopleRoute);
app.use('/', eventsRoute);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log("port connected");
})
