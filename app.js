const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');
const {mongoDbUrl} = require('./config/database');
const passport = require('passport');

//creating a databae connection ......

mongoose.connect(mongoDbUrl, {useNewUrlParser: true}).then(db=>{

console.log(' database connected');
}).catch(err => console.log(error));




app.use(express.static(path.join(__dirname, 'public')));

const {select, GenerateDate} = require('./helper/handlebars-helpers');



//set view engine
app.engine('handlebars', exphbs({defaultLayout: 'home' , helpers:{select: select , GenerateDate: GenerateDate}}));
app.set('view engine', 'handlebars');

//Upload Middleware 

app.use(upload());

//Body Parser ....

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//method override 

app.use(methodOverride('_method'));


app.use(session({
     secret: 'vinaysanwal@123',
     resave : true,
     saveUninitialized: true
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req,res, next)=>{
    res.locals.success_messgae =  req.flash('success_message');

    next();
});

//load routes
const home = require('./routes/home/index');
const  admin = require('./routes/admin/index');
const  posts = require('./routes/admin/posts');
const categories = require('./routes/admin/categories');
const comments = require('./routes/admin/comments');

//view routes
app.use('/' , home);
app.use('/admin', admin);
app.use('/admin/posts' , posts);
app.use('/admin/categories' , categories);
app.use('/admin/comments', comments);

app.listen(4501, ()=>{
  
    console.log(`Server is up on port 4501`);

});


