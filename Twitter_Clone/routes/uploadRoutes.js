const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const router = express.Router();


router.get("/images/:path", async (req, res) => {
    res.sendFile(path.join(__dirname, `../uploads/images/${req.params.path}`))
})

module.exports = router;