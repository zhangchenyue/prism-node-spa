var express = require('express');
var router = express.Router();
router.settings = {};

router.get('/api/version', function (req, res) {
    res.json({
        'version': '1.0.0.0',
        'settings': router.settings
    });
});

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

module.exports = router;