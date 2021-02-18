const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
require('../models/Post');
const Post = mongoose.model('posts');

//Post list
router.get('/',(req, res) => {
    Post.find().sort({title:"desc"}).lean().then((posts)=>{
    res.render("admin/index",{posts:posts})
})
})

//Post form
router.get('/posts',(req, res) => {
    res.render("admin/posts")
})

//Post validate & add
router.post('/posts/new',(req,res)=>{
     var errors = []

     if(!req.body.title || typeof req.body.title == undefined || req.body.title == null){
         errors.push({text:"Invalid title"})
         
     }
     if(!req.body.description || typeof req.body.description ==undefined || req.body.description ==null){
         errors.push({text: "Invalid description"})
         
     }
     if(errors.length > 0){
        res.render('admin/posts',{errors,errors})
     }else{
        const newPost = {
            title:req.body.title,
            description: req.body.description
        }
         new Post(newPost).save()
         .then(()=>{
            req.flash('success_msg',"Post Created") 
            res.redirect('/admin');
            }).catch((error)=>{
                req.flash('error_msg',`Error: ${error}`)
                res.redirect('/admin');
            })
        }
    })

//Post edit with parameter
router.get('/post/edit/:id',(req, res)=>{
    Post.findOne({_id:req.params.id}).lean().then((post)=>{    
        res.render('admin/postEdit',{post:post})
    }).catch((error)=>{
        req.flash('error_msg',`Erro:${error}`)
        res.redirect('/admin');
    })

})
//Sending form edited 
router.post('/post/edit',(req,res)=>{
    Post.findOne({id: req.body.id}).then((post)=>{
        post.title = req.body.title
        post.description = req.body.description

        post.save().then(()=>{
            req.flash('succes_msg',"Post updated")
            res.redirect('/admin');
        }).catch((error)=>{
            req.flash('error_msg',`Error: ${error}`)
            res.redirect('/admin');
        })
    }).catch((error)=>{
        req.flash('error_msg',`Finding error : ${error}`)
        res.redirect('/admin');
    })
}) 
//Delete post
router.post('/post/delete',(req,res)=>{
    Post.remove({_id:req.body.id}).then(()=>{
        req.flash('success_msg',"Post deleted")
        res.redirect('/admin')
    }).catch((error)=>{
        req.flash('error_msg',`Error:${error}`)
        res.redirect('/admin');
    })
})

module.exports = router