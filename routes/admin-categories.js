var express = require('express');
var router = express.Router();

//Get Category Model
var Category = require('../models/category');

const { check, validationResult } = require('express-validator');


/*
* GET Category index
*/

router.get('/', function(req,res) {
  Category.find(function(err, category){
    if(err) {
      return console.log("Error: " + err);
    } else {
      res.render('admin/categories', {
        category: category
      });
    }
  });
});


/*
* GET add category
*/
router.get('/add-category', function(req,res) {
  var title = "";

  res.render('admin/add-category', {
    title: title

  });
});

/*
* POST reorder pages
*/
router.post('/reorder-page', function(req,res) {
  var ids = req.body['id[]'];
  console.log(ids);

  var count = 0;

  for(var i = 0; i < ids.length; i ++) {
    var id = ids[i];
    count++;

    (function(count){
      Page.findById(id, function(err, page) {
        page.sorting = count;
        page.save(function(err) {
          if(err) {
            return console.log(err);
          }
        });
      });
    }) (count);

  }
});


/*
* POST add category
*/
router.post('/add-category', [
  check('title', 'Title must have a value.').isLength({min:1}),
], (req, res) => {

  var title = req.body.title;
  var slug = title.replace(/\s+/g, '-').toLowerCase();
  if (slug == "")
      slug = title.replace(/\s+/g, '-').toLowerCase();
  var content = req.body.content;

  var errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
      res.render('admin/add-category', {
          errors: errors,
          title: title
      });
  } else {
    console.log("working");
    Category.findOne({slug: slug}, function(err, category){
      if(category) {
        req.flash('danger', 'Category title exists, choose another.');
        res.render('admin/add-category', {
          title: title
        });
      } else {
        var category = new Category({
          title: title,
          slug: slug
        });
        category.save(function(err) {
          if(err) {
            return console.log(err);
          } else {
            req.flash('success', 'Category added!');
            res.redirect('/admin/categories');
          }
        });
      }
    });
  }
}
);

/*
* GET edit page
*/
router.get('/edit-page/:slug', function(req,res) {
  Page.findOne({slug : req.params.slug}, function(err, page) {
    console.log("page: " + page);
    if (err)
      return console.log("error: " + err);

    res.render('admin/edit-page', {
        title: page.title,
        slug: page.slug,
        content: page.content,
        id: page._id
    });
  });
});



/*
* POST edit page
*/
router.post('/edit-page/:slug', [
  check('title', 'Title must have a value.').isLength({min:1}),
  check('content', 'Content must have a value.').isLength({min:1})
], (req, res) => {
  var title = req.body.title;
  var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
  if (slug == "")
      slug = title.replace(/\s+/g, '-').toLowerCase();
  var content = req.body.content;
  var id = req.body.id;

  var errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
      res.render('admin/edit-page', {
          errors: errors,
          title: title,
          slug: slug,
          content: content,
          id: id
      });
  } else {
    Page.findOne({slug: slug, _id:{'$ne': id}}, function(err, page){
      if(page) {
        req.flash('danger', 'Page slug exists, choose another.');
        res.render('admin/edit-page', {
          title: title,
          slug: slug,
          content: content,
          id: id
        });
      } else {

        Page.findById(id, function(err, page) {
          if(err) {
            console.log("Error: " + err);
          } else {
            page.title = title;
            page.slug = slug;
            page.content = content;

            page.save(function(err) {
              if(err) {
                return console.log(err);
              } else {
                req.flash('success', 'Page saved!');
                res.redirect('/admin/pages/edit-page/' + page.slug);
              }
            });
          }
        });
      }
    });
  }
}
);


/*
* GET delete index
*/

router.get('/delete-page/:id', function(req,res) {
  Page.findByIdAndRemove(req.params.id, function(err){
    if(err) {
      return console.log("ERROR: " + err);
    } else {
      req.flash('success', 'Page Deleted!');
      res.redirect('/admin/pages/');
    }
  })
});

//Exports
module.exports = router;