var express=require("express")
var bodyParser=require("body-parser")
var mongoose=require("mongoose")
var bcrypt = require('bcrypt')

const app=express();
app.use(express.json());

app.use(express.urlencoded({extended: false}));

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))



mongoose.connect('mongodb://127.0.0.1:27017/Database')
var db=mongoose.connection
db.on('error',()=> console.log("Error in Connecting to Database"))
db.once('open',()=> console.log("Connected to Database"))
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const User = mongoose.model('users', userSchema);

app.post("/sign_up", async(req,res) => {
    var name= req.body.name
    var email=req.body.email
    var password=req.body.password

    var data={
        "name":name,
        "email":email,
        "password":password
    }

    //check if the user already exists in the database
    /*const existingUser = await collection.findOne({email: data.email});
    if(existingUser){
        res.send("Email already exists.Please choose a different email.");
    }else{
        //hash the password using bcrypt
        const saltRounds=10;//Number of salt round for bcrypt
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword;

        const userdata = await collection.insertMany(data);
        console.log(userdata);

    }*/

    db.collection('users').insertOne(data,(err,collection) => {
        if(err){
            throw err;
        }
        console.log("Record Inserted Succesfully")
    })
    return res.redirect('login.html')
});

//Login user
app.post("/login",async(req,res)=>{
    console.log("ttt")
    var email = req.body.email;
    var password = req.body.password;

    db.collection('users').findOne({email:email},(err,user)=>{
        if(err){
            console.error('Error while finding user',err);
            return res.status(500).send('Internal server error');
        }

        if(!user){
            return res.status(401).send('Invalid email');
        }

        if(user.password !== password){
            return res.status(401).send('Invalid password');
        }

        console.log("User Logged in Successfully");
        return res.redirect('signup_successful.html');
    });

});
app.post("/forgot_password", async (req, res) => {
    try {
        var email = req.body.email;
        var newPassword = req.body.newPassword;

        // Find the user by email
        let user = await User.findOne({ email: email });
        console.log(user);
        if (!user) {
            return res.status(401).send('Invalid email');
        }

        // Hash the new password
        const saltRounds = 10;
        const hashedPassword = newPassword;

        // Update the password
        user.password = hashedPassword;
        await user.save();

        console.log("Password updated successfully");
        return res.redirect('login.html');
    } catch (err) {
        console.error('Error while updating password', err);
        return res.status(500).send('Internal server error');
    }
});

app.get("/",(req,res) => {
    res.set({
        "Allow-acces-Allow-Origin":'*'
    })
    return res.redirect('index.html')
}).listen(3000);

console.log("Listening on port 3000")