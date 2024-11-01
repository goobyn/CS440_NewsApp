const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./src/presentation/routes/userRoutes');
const articleRoutes = require('./src/presentation/routes/articleRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('', userRoutes);
app.use('', articleRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
