const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const faker = require('faker');
const {userAuthenticated} = require('../../helper/authentication');


router.all('/*', userAuthenticated ,(req, res, next)=>{
    //resting default layouts
    res.app.locals.layout = 'admin';
    next();
});


router.get('/', (req, res)=>{

    res.render('admin/index');
});

router.post('/generate-fake-posts' , (req, res) =>{
     
    for(let i=0 ; i < req.body.amount; i++){
          
       let post = new Post();
       post.title = faker.name.title();
       post.status = 'public';
       post.allowComments = faker.random.boolean();
       post.body = faker.lorem.sentence();

       post.save().then(savedPost =>{

       });

       res.redirect('/admin/posts');
    };
});



module.exports = router;