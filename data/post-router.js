const router = require('express').Router();
const db = require('./db.js');

module.exports = router;

router.get('/', (req, res) => {
    db.find().then(post=> {
        res.status(200).json(post)
    })
    .catch(err => {
        res.status(500).json({error: "the posts information could not be retrieved."})
    })
})

router.get('/:id', (req, res) => {
const id = req.params.id;
db.findById(id).then(post=> {
    if(post.length === 0) {
        res.status(404).json({message: "The post with the specified ID does not exist."})
    }
    res.status(200).json(post)
})
.catch(err=> {
    res.status(500).json({ error: "The post information could not be retrieved." })
})
})

router.post('/',(req, res)=> {
    const body = req.body;
    if(!body.title || !body.contents){
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
    db.insert(body).then(post => {
        res.status(201).json(post)
    })
    .catch(err=> {
        res.status(500).json({error: "There was an error while saving the post to the database"})
    })
})

router.post('/:id/comments', (req, res)=> {
    const id = parseInt(req.params.id);
    const newBody = {...req.body, "post_id": id}
    if(!newBody.text || !newBody.post_id){
        res.status(404).json({message: "The post with the specified ID does not exist."})
    }
    db.insertComment(newBody).then(obj=> {
          res.status(201).json(newBody)  
    })
    .catch(err => {
        res.status(500).json({error: "There was an error while saving the comment to the database"})
    })
})

router.get('/:id/comments', (req, res)=> {
    const id = req.params.id;
    db.findCommentById(id).then(comment=>{
        if(!comment){
            res.status(404).json({message: "no comment found matching this id"})
        }
        res.status(200).json(comment)
    })
    .catch(err=> {
        res.status(500).json({ error: "The comments information could not be retrieved." })
    })
})

router.delete('/:id', (req,res)=> {
    const id = req.params.id;
    db.remove(id).then(post=> {
        if(!post){
            res.status(404).json({message: "The post with the specified ID does not exist."})
        }
        res.json("completed delete")
    })
    .catch(err=> {
        res.status(500).json({error: "The post could not be removed"})
    })
})

router.put('/:id', (req, res)=> {
    const id = req.params.id;
    const body = req.body;
    db.update(id, body).then(post=>{
        if(!post){
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }else if(!body.title || !body.contents){
            res.status(400).json({errorMessage: "Please provide title and contents for the post."})
        }else{
          res.status(200).json(req.body)  
        }
    })
    .catch(err=> {
        res.status(500).json({error: "The post information could not be modified."})
    })
})

