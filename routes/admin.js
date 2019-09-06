var express = require('express');
var router = express.Router();

router.get('/', function(req,res) {
  res.render('admin/admin-home', {
    title: 'Dashboard'
  });
});

//Exports
module.exports = router;