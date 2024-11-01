const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://goobyn:dovah1337@cluster0.zp2le.mongodb.net/newsApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Atlas connected'))
.catch(err => console.log('Database connection error:', err));

module.exports = mongoose;
