

const userGet = (req, res) => {
    
    const { q, name = 'unknow', apikey } = req.query;

    res.json({
        ok: true,
        msg: 'get API - Controller',
        q,
        name,
        apikey
    });
} 

const userPost = (req, res) => {

    const { name, age } = req.body;

    res.status(201).json({
        ok: true,
        msg: 'post API - Controller',
        name,
        age
    });
} 

const userPut = (req, res) => {
    const { id, name } = req.params;
    res.json({
        ok: true,
        msg: 'put API - Controller',
        id,
        name
    });
} 

const userDelete = (req, res) => {
    res.json({
        ok: true,
        msg: 'delete API - Controller'
    });
} 



module.exports = {
    userGet,
    userPost,
    userPut,
    userDelete
}