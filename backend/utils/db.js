const {connect} = require('mongoose');
const url = process.env.DB_URL;

exports.connectWithDB = (app,port)=>{connect(url).then(()=>{
    console.log("Database connection stablished");
    console.log("Starting Server .... ");

    app.listen(port,()=>console.log('server running on http://localhost:'+port));

    })
    .catch((err)=>{
        console.log("Something went worng to connect with DB"+ err);
    })
}