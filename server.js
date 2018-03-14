var express = require('express');

var app = express();                

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(express.static( __dirname + '/restfulangular/dist' ));

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/apidb');

mongoose.Promise = global.Promise;

var TaskSchema = new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,default:""},
    completed:{type:Boolean,default:false},
   },{timestamps:true});
   mongoose.model('Task', TaskSchema);
   var Task = mongoose.model('Task') 

var router = express.Router();
router.use(function(req, res, next) {
    console.log('Something is happening.');
    next();
});
router.get('/', function(req, res) {
    res.json({ message: 'welcome to our api!' });   
});


router.route('/tasks')
    .get(function(req,res){
        Task.find({},function(err,tasks){
            if(err){
                console.log(err);
                res.json({message:"Error",error:err})
            }
            else{
                res.json({data:tasks})
            }
        })
    })

    .post(function(req,res){
        var task = new Task();
        task.title=req.body.title;
        task.description=req.body.description;
        task.completed=req.body.completed;

        task.save(function(err){
            if(err){
                console.log(err);
                res.json({message:"Error",error:err})
            }
            else{
                res.json({message:"Create Success"})
            }
        })

    })
router.route('/tasks/:id')
    .get(function(req,res){
        Task.findOne({_id:req.params.id},function(err,task){
            if(err){
                console.log(err);
                res.json({message:"Error",error:err})
            }
            else{
                res.json({data:task})
            }
        })
    })

    .put(function(req,res){
        Task.findOne({_id:req.params.id},function(err,task){
            if(err){
                console.log(err);
                res.json({message:"Error",error:err})
            }
            else{
                task.title=req.body.title;
                task.description=req.body.description;
                task.completed=req.body.completed;
                task.save(function(err){
                    if(err){
                        console.log(err);
                        res.json({message:"Error",error:err})
                    }
                    else{
                        res.json({message:"Update Success"})
                    }
                })
            }
        })
    })
    .delete(function(req,res){
        Task.remove({_id:req.params.id},function(err,task){
            if(err){
                console.log(err);
                res.json({message:"Error",errors:err})
            }
            else{
                res.json({message:"Delete Success"})
            }
        })
    })
app.use('/', router);

app.listen(8000, function() {
    console.log("listening on port 8000");
})