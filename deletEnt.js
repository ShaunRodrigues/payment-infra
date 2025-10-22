/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
//const func = Firebase.functions
const {onRequest} = require("firebase-functions/v2/https");
//var authr=require("google-auth-library")
//const {onMessagePublished} =require("firebase-functions/v2/pubsub")
const logger = require("firebase-functions/logger");
const https=require("https")
//const express =require("express")
//const {google} = require("googleapis");
//const  androidpublisher=google.androidpublisher('v3')
const {google} = require('googleapis');
const process=require('process')

// Create an OAuth2 client with your credentials
const oauth2Client = new google.auth.OAuth2(
  {clientId:process.env.ID,
clientSecret:process.env.SEC,
redirectUri:"https://asia-southeast1-project.cloudfunctions.net/tid:8080"}
);
const QUANTITY=100;

// TODO: PLEASE UPSCALE LATER
//const {onValueUpdated} = require("firebase-functions/v2/database");
let userlist;



// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { databaseURL } = require("firebase-functions/params");
const { event } = require("firebase-functions/v1/analytics");
//const func= require("firebase/functions");
google.options({auth: oauth2Client});
//const {getDatabase }=require('firebase-admin/database');
//const { ref } = require("firebase-functions/lib/v1/providers/database");
//const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
//const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
admin.initializeApp({
  
  // The database URL depends on the location of the database
  //databaseURL:"project-default-rtdb.asia-southeast1.firebasedatabase.app/"
  //databaseURL:"http://127.0.0.1:9000/?ns=project"
  //credential: admin.credential.applicationDefault(),
  databaseURL: "https://project-default-rtdb.asia-southeast1.firebasedatabase.app/"
});



//func.functions()
//functions.useEmulator("127.0.0.1", 5001);projects/pc-api/topics/Play-Store-Notifications
var h =false



exports.id = onRequest(
  {timeoutSeconds: 10, region: ["asia-southeast1"]},
  async (req, res) => {
    if(req.header("api")==process.env.PWD)
    {
      const data =req.body
      const id= data.UID
      const meth =data.method
      const userRef=admin.database().ref("Users")
      const tempRef=admin.database().ref("temp")
      console.log(req.body)
      if(!meth)
      {
        const id =await genid(tempRef)
        console.log("cd"+id)
        if(id==0)
        {
          res.status(502).send()
        }else
        {
          res.status(200).send({"UID":id})
        }

      }
      else
      {
        console.log("ab"+id)
        const UJ = {lastPurchaseTime: "", lastTrxnID:"", TrxnIDs: ["0"], trial: 4, data:{"u":0}}
          await userRef.child(id).set(UJ).catch(error=>{
            res.status(502).send()
          })
          await tempRef.child(id).remove()
          res.status(200).send({"u":0})
      }
      
    }else{res.status(400).send()}
});


exports.deleteEnt = onRequest(
  {timeoutSeconds: 10, region: ["asia-southeast1"]},
  async (req, res) => {
    if(req.header("api")==process.env.PWD)
    {
      //oauth2Client.setCredentials({})
      //console.log(req.body)
      //let errflag=false;
      var succ=false;
      const data =req.body
      var id= data.purchaseToken
      id=sanitize(id)
      //const request =data.request
      const userRef=admin.database().ref("Users")
      try
      {
        const Userx=await userRef.child(id).once("value")
        var User = Userx.toJSON()
            if(Userx.exists()&&User.purchaseToken!="")
          {
              succ=true;
                if(data.calc<=0){val=0}else{
              val =Math.min(User.calcs, data.calc)
                }
              
            User.calcs=val
            //if(typeof userlist==='undefined'){userlist= new Map()}
            //userlist.set(id, UJ)
            await userRef.child(id).update(User)
            if(succ){res.status(225).send({calcs:val})}else{res.status(200).send({u: 0})}
          }
      }
      catch(e){console.log(e);res.status(400).send()}      
      
    }else{res.status(400).send()}
});

                                     

exports.getUser =functions.region("asia-southeast1").pubsub.schedule('0 0 * * *').timeZone('Asia/Kolkata')
                                       .onRun(async (context)=>
                                       {
                                       
                                       if(typeof users==='undefined'){users=new Map()}
                                       if(users.size==0){
                                        //console.log('no')
                                        
                                        const ref = admin.database().ref("Users")
                                        //const doc = await ref.set({"la":"lala"});
                                        //const updates = {};
                                        const snapshot = await ref.once('value').catch(error=>{
                                          console.error('User update error')
                                        })
                                        //const h =snapshot.child("a").exists();
                                        //const h =await ref.get("a").
                                        snapshot.forEach((childSnapshot) => {
                                          users.set(childSnapshot.child("UID").val(), childSnapshot.key); // Users can change the field according to their preference
                                        })
                                      }
                                       if(typeof userlist==='undefined'){userlist=new Map()}
                                       if(userlist.size!=0){
                                        //console.log('no')
                                        
                                        var i = userlist.size;
                                        for (var k of userlist.keys()) {
                                            if (i-- > 500) {
                                                break;
                                            }
                                            userlist.delete(k);
                                        }
                                      }
                                        //console.log(users)
                                       }
                                       
)

exports.resetFieldMon =functions.region("asia-southeast1").pubsub.schedule('00 00 01 * *').timeZone('Asia/Kolkata')
                                       .onRun(async (context)=>
                                       {
                                        //const ref = admin.getDatabase().collection("users").doc("test");
                                        //const ref = db.ref('project/Users'); // Users can change the node according to their preference
                                        const ref = admin.database().ref("Users")
                                        //const doc = await ref.set({"la":"lala"});
                                        const updates = {};
                                        const snapshot = await ref.once('value').catch(error=>{
                                          console.error('Monthly read error')
                                        })
                                        //const h =snapshot.child("a").exists();
                                        //const h =await ref.get("a").
                                        snapshot.forEach((childSnapshot) => {
                                          updates[childSnapshot.key + '/tries'] = 4; // Users can change the field according to their preference
                                        });
    
                                        await ref.update(updates).catch(error=>{
                                          console.error('Monthly write error')
                                        });
                                        if(typeof userlist==='undefined'){userlist=new Map()}
                                        if(userlist.size!=0){
                                          const ref = admin.database().ref("Users")
                                          if(typeof users==='undefined'){users=new Map()}
                                           if(users.size==0){
                                            //console.log('no')
                                            //const doc = await ref.set({"la":"lala"});
                                            //const updates = {};
                                            const snapshot = await ref.once('value').catch(error=>{
                                              console.error('User update error')
                                            })
                                            //const h =snapshot.child("a").exists();
                                           //const h =await ref.get("a").
                                        snapshot.forEach((childSnapshot) => {
                                          users.set(childSnapshot.child("UID").val(), childSnapshot.key); // Users can change the field according to their preference
                                        })
                                      }
                                      const x =new Map()
                                          userlist.forEach(async (user, val)=>{
                                            const snp = await ref.child(val).once('value');
                                            x.set(user, snp.toJSON())
                                          })
                                          userlist=x
                                        }
                                       }
                                       
                                       )
                                       

function sanitize(str)
{
 const st1=str.replaceAll(".","*")
 const st2=st1.replaceAll("/","@")
 return st2
}
