const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Content = require('../models/Content');


const PEPPER = process.env.PEPPER;


const submitContentController = async (req,res)=>{
    try{

        const {content,password} = req.body;
        
        if(!content || !password){
            return res.status(400).json({
                message:"Content or password is required",
            })
        }
    
        const sig = crypto.createHmac('sha256',PEPPER).update(password).digest('hex');
    
        const exists = await Content.findOne({passwordSig:sig}).lean();
        if(exists){
            // console.log(exists);
            return res.status(409).json({message:"Password already exists. Pic another one"});
        }
    
    
        const salt = await bcrypt.genSalt(10);
        const hassPass = await bcrypt.hash(password,salt);
    
        
    
    
        const createContent = new Content({
            content,
            password:hassPass,
            passwordSig:sig
        })
        
        await createContent.save();
    
        res.status(201).json({
            message:"Succcessfully Shared Content",
        })

    }catch(err){        
        console.log(err);
        return res.status(500).json({message:"Server error"});
    }
    
}








const getContentController = async(req,res)=>{
    try{    
       const password = req.method === 'GET' ? req.query.password : req.body.password;
        if(!password){
            return res.status(400).json({message:"Password is required"});
        }
        

        const sig =  crypto.createHmac('sha256',PEPPER).update(password).digest('hex');
        const content = await Content.findOne({passwordSig:sig}).select('password').lean();
        if(!content){
            return res.status(404).json({message:"content not found"})
        }


        const match = await bcrypt.compare(password, content.password);
        if(!match){
            return res.status(401).json({message:"content not found/Invalid Password"});
        }


        const safe = await Content.findOne({ passwordSig: sig }).select('-password -passwordSig -__v').lean();  

        return res.status(200).json({message:'success', data:safe});

    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Server error"});
    }
}




module.exports = {submitContentController,getContentController};