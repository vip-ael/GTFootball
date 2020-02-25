const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json({
        msg: 'GT Football server is responsive'
    })
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`GT Football server running on port ${PORT}`));
