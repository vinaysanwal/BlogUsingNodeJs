const express=require('express');
const router=express.Router();
const Post = require('../../models/Post');
const { isEmpty, uploadDir } = require('../../helper/upload-helper');
const fs = require('fs');
const path = require('path');
const Category = require('../../models/Category');

router.all('/*',(req,res,next)=>{
    req.app.locals.layout= 'admin';
    next();
});
 
router.get('/',(req,res)=>{
    Post.find({}).populate('category')
    .then(posts=>{
        res.render('admin/posts', {posts: posts});
    });
    
});
 
 
router.get('/create',(req,res)=>{

    Category.find({}).then(categories=>{
        res.render('admin/posts/create', {categories: categories});
    });
    
});

router.post('/create',(req,res)=>{
    let errors = [];

    if(!req.body.title){
        errors.push({message: 'please add a title'});
    }

    if(!req.body.status){
        errors.push({message: 'please add a status'});
    }

    if(!req.body.body){
        errors.push({message: 'please add a body'});
    }

    if(errors.length > 0){
        res.render('admin/posts/create', {

            errors: errors
        });
    }
    else{

    let filename = 'hello';

    if(!isEmpty(req.files)){
        let file = req.files.file;
            filename = Date.now() + "-" + file.name;
    
        file.mv('./public/uploads/' + filename, (err)=>{
             if(err) throw err;
        });
    }

   

    let allowComments = true;

    if(req.body.allowComments){
        allowComments = true;
    }else {
        allowComments = false;
    }

   const newPost =   new Post({

        title: req.body.title,
        status: req.body.status,
        allowComments : allowComments,
        body: req.body.body,
        category: req.body.category,
        file: filename

    });

    newPost.save().then(savedPost => {
        
        req.flash('success_message', 'Post was created Successfully' + savedPost.title);

        res.redirect('/admin/posts');

    }).catch(error => {
        console.log('Unable to work');
    });

}
});
 
router.get('/edit/:id', (req, res)=>{
     
    Post.findOne({_id: req.params.id}).then(post=>{
        Category.find({}).then(categories=>{
            res.render('admin/posts/edit', {post: post,categories: categories});
        });
        
    });

});

router.put('/edit/:id' , (req ,res)=> {

    
    Post.findOne({_id: req.params.id}).then(post=>{       

    let allowComments = true;

        if(req.body.allowComments)
        {
            allowComments = true;
        }else 
        {
            allowComments = false;
        }

        post.title = req.body.title;
        post.status = req.body.status;
        post.allowComments = allowComments;
        post.body = req.body.body;
        post.category = req.body.category;
        if(!isEmpty(req.files)){
            let file = req.files.file;
                filename = Date.now() + "-" + file.name;
                post.file = filename
        
            file.mv('./public/uploads/' + filename, (err)=>{
                 if(err) throw err;
            });
        }

        post.save().then(updatedPost=>{


            req.flash('success_message', "Post successfully updated");
        
            res.redirect('/admin/posts');

        });
    });

   });

router.delete('/:id', (req, res)=>{

    Post.findOne({_id: req.params.id})
    .then(post =>{
        post.remove();
        fs.unlink(uploadDir + post.file, (err)=>{
         res.redirect('/admin/posts');
        });
    });
 });

module.exports=router;
