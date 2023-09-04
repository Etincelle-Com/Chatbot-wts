const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require('dotenv').config();

const app = express().use(bodyParser.json());

const token = process.env.TOKEN;
const mytoken = process.env.MYTOKEN;

app.listen(process.env.PORT || 8000, () => {
   console.log("Webhook is listening");
});

app.get("/webhook", (req, res) => {
   let mode = req.query["hub.mode"];
   let challenge = req.query["hub.challenge"];
   let token = req.query["hub.verify_token"];
   
   if (mode && token){
    if(mode==="subscribe" && token === mytoken){
        res.status(200).send(challenge);   
    }else{
        res.status(403);
    }
   }
});

app.post("/webhook", (req,res)=> {
    let body_param=req.body;
    console.log(JSON.stringify(body_param, null,2));

    if(body_param.object){
        if(body_param.entry && 
            body_param.entry[0].changes[0].value.messages &&
            body_param.entry[0].changes[0].value.messages[0]){
                let phon_no_id = body.entry[0].changes[0].value.metadata.phone_number_id;
                let from = body.entry[0].changes[0].value.messages[0].from;
                let msg_body = body.entry[0].changes[0].value.messages[0].text.body;
                axios({
                    method:"POST",
                    url:"https://graph.facebook.com/v17.0/"+phon_no_id+"/messages?access_token"+token,
                    data:{
                        messaging_product: "whatsapp",
                        to: from,
                        recipient_type: "individual",
                        type: "interactive", 
                        interactive:{
                            type: "list",
                            header: {
                                type: "text",
                                text: "chose your question"
                            },
                            body: {
                                text: "chose your question"
                            },
                            /*footer: {
                                text: "your-footer-content"
                            },*/
                            action: {
                                button: "Send",
                                sections:[
                                {
                                    //title:"your-section-title-content",
                                    rows: [
                                    {
                                        id:"0",
                                        title: "Branches",
                                        //description: "row-description-content",           
                                    }
                                    ]
                                },
                                {
                                   // title:"your-section-title-content",
                                    rows: [
                                    {
                                        id:"unique-row-identifier",
                                        title: "the diplome that you have for every branch",
                                        //description: "row-description-content",           
                                    }
                                    ]
                                },
                                ]
                            }
                            }
                    },
                    headers:{
                        "Content-Type": "application/json"
                    }
                });
                res.sendStatus(200).send(challenge);
                }else{
                    res.sendStatus(404);
                }
       
            }
});

app.get("/",(req,res)=>{
    //res.sendFile('${publicPath}/wts.js')
    res.status(200).send("hello this webhook setup");
});
