const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Post = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        require:true
    }
      
})
mongoose.model('posts',Post)