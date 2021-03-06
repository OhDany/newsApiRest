const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());

// Models
const { User } = require('./models/user');
const { Seccion } = require('./models/seccion');
const { Tag } = require('./models/tag');
const { Comment } = require('./models/comment');
const { News } = require('./models/news');

// Middlewares
const { auth } = require('./middleware/auth');
const { admin } = require('./middleware/admin');

//<><><><><><><><><><><><>
//         News
//<><><><><><><><><><><><>

// BY ARRIVAL
// /articles?sortBy=createdAt&order=desc&limit=4

// BY SELL
// /articles?sortBy=sold&order=desc&limit=100&skip=5

app.get('/api/news/articles',(req,res)=>{
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : 100;

    News.
    find().
    populate('seccion').
    populate('tag').
    sort([[sortBy,order]]).
    limit(limit).
    exec((err,articles)=>{
        if(err) return res.status(400).send(err);
        res.send(articles)
    })
})

app.get('/api/news/articles_by_id',(req,res)=>{
    let type = req.query.type;
    let items = req.query.id;

    if(type === "array"){
        let ids = req.query.id.split(',');
        items = [];
        items = ids.map(item=>{
            return mongoose.Types.ObjectId(item)
        })
    }

    News.
    find({'_id':{$in:items}}).
    populate('seccion').
    populate('tag').
    exec((err,docs)=>{
        return res.status(200).send(docs)
    })
});

app.post('/api/news/article',auth,admin,(req,res)=>{
    const news = new News(req.body);

    news.save((err,doc)=>{
        if(err) return res.json({success:false,err});
        res.status(200).json({
            success: true,
            article: doc
        })
    })
})

//<><><><><><><><><><><><>
//        Comments
//<><><><><><><><><><><><>

app.post('/api/news/comment',auth,admin,(req,res)=>{
    const comment = new Comment (req.body);
    
    comment.save((err,doc)=>{
        if(err) return res.json({success:false,err});
        res.status(200).json({
            success: true,
            comment: doc
        })
    }) 
});

app.get('/api/news/comments',(req,res)=>{
    Comment.find({},(err,comments)=>{
        if(err) return res.status(400).send(err);
        res.status(200).send(comments)
    })
});

//<><><><><><><><><><><><>
//         Tag
//<><><><><><><><><><><><>

app.post('/api/news/tag',auth,admin,(req,res)=>{
    const tag = new Tag (req.body);
    
    tag.save((err,doc)=>{
        if(err) return res.json({success:false,err});
        res.status(200).json({
            success: true,
            tag: doc
        })
    }) 
});

app.get('/api/news/tags',(req,res)=>{
    Tag.find({},(err,tags)=>{
        if(err) return res.status(400).send(err);
        res.status(200).send(tags)
    })
});

//<><><><><><><><><><><><>
//         Seccion
//<><><><><><><><><><><><>

app.post('/api/news/seccion',auth,admin,(req,res)=>{
    const seccion = new Seccion(req.body);

    seccion.save((err,doc)=>{
        if(err) return res.json({success:false,err});
        res.status(200).json({
            success: true,
            seccion: doc
        })
    })
})

app.get('/api/news/seccions',(req,res)=>{
    Seccion.find({},(err,seccions)=>{
        if(err) return res.status(400).send(err);
        res.status(200).send(seccions)
    })
})

//<><><><><><><><><><><><>
//         Users
//<><><><><><><><><><><><>

app.get('/api/users/auth',auth,(req,res)=>{
    res.status(200).json({
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        history: req.user.history
    })
})


app.post('/api/users/register',(req, res)=>{
    const user = new User(req.body);

    user.save((err,doc)=>{
        if(err) return res.json({success:false,err});
        res.status(200).json({
            success: true
            //userdata: doc
        })
    })
});

app.post('/api/users/login',(req,res)=>{
    // find the email
    User.findOne({'email':req.body.email},(err,user)=>{
        if(!user) return res.json({loginSuccess:false,message:'Auth failed, email not founf'});

        // Check the password
        user.comparePassword(req.body.password,(err,isMatch)=>{
            if(!isMatch) return res.json({loginSuccess:false,message:'Wrong password'});

            // generate a token
            user.generateToken((err,user)=>{
                if(err) return res.status(400).send(err);
                res.cookie('w_auth',user.token).status(200).json({
                    loginSuccess: true
                })
            })
        })
    })
})

app.get('/api/users/logout',auth,(req,res)=>{
    User.findOneAndUpdate(
        { _id:req.user._id },
        { token: ''},
        (err,doc)=>{
            if(err) return res.json({success:false,err});
            return res.status(200).send({
                success: true
            })
        }
    )
})


const port = process.env.port || 3002;

app.listen(port,() => {
    console.log(`Server Running at ${port}`)
})