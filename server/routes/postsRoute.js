




import {Router} from "express";

const PostRoute = new Router();



PostRoute.post('/', (req, res) => {
    console.log(req.body);
    console.log('I post controller');

    res.status(200).json({ message: 'Post received' });  // Send a success response
});



export default PostRoute;