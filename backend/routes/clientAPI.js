var express = require('express');
var cors = require('cors');
var router = express.Router();
const fetch = require("node-fetch")

const TOKEN = "4dacda19-bfa6-4660-8530-74e43565c502";

var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
  }

router.use(cors())
router.get('/programs', function(req, res, next) {
    fetch('https://welbi.org/api/programs?token='+TOKEN)
        .then(r => r.text())
        .then(data => {
            res.send(data);
        });
});

router.get('/residents', function(req, res, next) {
    fetch('https://welbi.org/api/residents?token='+TOKEN)
        .then(r => r.text())
        .then(data => {
            res.send(data);
        });
});

router.post('/programs', function(req, res, next) {
    fetch('https://welbi.org/api/programs?token='+TOKEN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(req.body)
      })
        .then(r => r.json())
        .then(data => {
            console.log('data:', data);
            res.send(data);
        });
});

router.post('/residents', function(req, res, next) {
    fetch('https://welbi.org/api/residents?token='+TOKEN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(req.body)
      })
        .then(r => r.json())
        .then(data => {
            console.log('data:', data);
            res.send(data);
        });
});

router.post('/attend', function(req, res, next) {
    console.log('test')
    console.log(req.query.program);
    console.log(req.body)
    fetch(`https://welbi.org/api/programs/${req.query.program}/attend?token=`+TOKEN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(req.body)
      })
        .then(r => r.json())
        .then(data => {
            console.log('data:', data);
            res.send(data);
        });
});

module.exports = router;