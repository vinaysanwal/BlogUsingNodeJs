const express = require('express');
const router  = express.Router();
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');


router.post('/', (req, res)=> {

    Post.findOne({_id: req.body.id}).then(post=>{
       
        const newComment = new Comment({
                
            user: req.user.id,
            body: req.body.body
        });

        post.comments.push(newComment);
        post.save().then(savedPost=>{

            newComment.save().then(savedComment=>{
               
                res.redirect(`/post/${post.id}`);

            });
        });

    });
      
     res.send('');  

});

module.exports = router;