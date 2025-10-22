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
  
  
  databaseURL: "https://project-default-rtdb.asia-southeast1.firebasedatabase.app/"
});


/*
const auth = new authr.GoogleAuth({
    keyFile:"data.json",
    // Scopes can be specified either as an array or as a single, space-delimited string.
    scopes: ["https://www.googleapis.com/auth/androidpublisher"]
  })
  async function getClient(){
  const authClient = await auth.getClient();
  google.options({auth: authClient})
  }*/
  
  
//func.functions()
//functions.useEmulator("127.0.0.1", 5001);projects/pc-api-98/topics/Play-Store-Notifications
var h =false



exports.requestAd = onRequest(
  {timeoutSeconds: 10, region: ["asia-southeast1"]},
  async (req, res) => {
    if(req.header("api")==process.env.PWD)
    {
      const data =req.body
      let idp = data.UID
      //const id= idp.replace("$", "S")
      console.log(req.body)
      const ref = admin.database().ref("Users")
      if(data.request){
        //if(!(typeof userlist==='undefined')){userlist.delete(id)}
        
        if(!(typeof userlist==='undefined')&&userlist.has(id))
        {   console.log("dg")
            res.status(200).send({calcs: userlist.get(id).trial.val()})
        }else
        {
          
            
          let User = await ref.child(id).once("value", async (snapshot)=>{
            if (!snapshot.exists()) {
              h=true
              //console.log("nool")
                await ref.child(id).set({lastPurchaseTime: 0, lastTrxnID:"", TrxnIds: ["0"], calc: 5, data:{}}).catch(error=>{
                  res.status(502).send({})
                })
                
            }else
            {
              userlist= new Map()
              if(h){userlist.set(id, User)
                res.status(200).send({calcs: User.trial})}else{
                userlist.set(id, User.toJSON())
                res.status(200).send({calcs: User.child("calc").val()})
              }
            }
          }).catch(error=>{
            res.status(502).send({})
          })
          //if(h){User = {g:"", trial: 4}}
          //console.log(h)
          //console.log(User)
           
        }
      }
      else{
        console.log(id)
        let User2 = await ref.child(id).once("value", async (snapshot)=>{
          if (!snapshot.exists()) {
            h=true
            //console.log("nool")
              const UJ = {lastPurchaseTime: 0, lastTrxnID:"", TrxnIDs: ["0"], calc: 4, data:{}}
              await ref.child(id).set(UJ).catch(error=>{
                res.status(502).send({})
              })
              if(typeof userlist==='undefined'){userlist= new Map()}
              userlist.set(id, UJ)
              res.status(200).send({calcs: 4})
          }else{
            //console.log("pket "+a)
            //console.log("zket "+b)
            const val =Math.min(snapshot.child("calc").val()-1, data.calc-1)
            //User.child("jh")child("field").set(val)
            //console.log(val)
            const UJ=snapshot.toJSON()
            //console.log("ket "+UJ)
            //console.log("val "+val)
            UJ.calc=val
            //if(typeof userlist==='undefined'){userlist= new Map()}
            //userlist.set(id, UJ)
            await ref.child(id).update(UJ).catch(error=>{
              res.status(502).send({})
            })
            res.status(200).send({calcs: val})
              }
          
        }).catch(error=>{
          res.status(502).send({})
        })

      }
    }else{res.status(400).send({})}
});

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
                                       

                                     
exports.tid = onRequest(
                                        {timeoutSeconds: 20, region: ["asia-southeast1"]},
                                        async (req, res) => {
                                          var i;
                                          const userRef=admin.database().ref("Users")
                                          if(('reqs' in req.body)&&(req.header("api")==process.env.PWD||req.header("user-agent").charAt(0)=="A")){
                                          if('reqs' in req.body){ i=req.body}else{
                                          i =JSON.parse(atob(req.body.message.data))}
    const notification=i.oneTimeProductNotification;
    console.log(notification)
    
    //console.log("lldx "+req.body.message)
    try
    {
      const sanitisedpt2 =sanitize(notification.purchaseToken)
    oauth2Client.setCredentials({refresh_token:process.env.REF})
    const androidpublisher = google.androidpublisher({
      version: 'v3',
      auth: oauth2Client
    });
    const snaps=await userRef.child(sanitisedpt2).once("value")
    if(notification.notificationType==1&&!snaps.exists()){
    // Use the purchases.products.get method to check the purchase and consumption status of an inapp item
    const resl =await androidpublisher.purchases.products.get({
      packageName: "com.shrd.unicalc.free",
      productId: "unicalc_one",
      token: notification.purchaseToken    
    });
    
      
        // The response contains the purchasestate and other information
        var y=true
        console.log(resl.data);
     
      
      var user={}
      var q;
      if(!('quantity' in resl.data)){q=1}else{q=resl.data.quantity}
      user.orderId=  resl.data.orderId
       user.purchaseToken=notification.purchaseToken
       user.purchaseTime=resl.data.purchaseTimeMillis
       user.calcs=q*QUANTITY
       
       delete resl.data.purchaseToken
       //delete resl.data.kind
       delete resl.data.purchaseTimeMillis
       delete resl.data.orderId
       delete resl.data.regionCode
       delete resl.data.developerPayload                                      
       user.data=resl.data
      if(resl.data.purchaseState==0&&resl.data.consumptionState==0&&resl.data.acknowledgementState==0)
      {
        await androidpublisher.purchases.products.acknowledge({packageName:"com.shrd.unicalc.free",
                                                          productId: "unicalc_one",
                                                          token: notification.purchaseToken
                                                          },{})
       
       
                                                          user.data.acknowledgementState=1
      }else if(resl.data.acknowledgementState!=0){user.data.acknowledgementState=1}
      //TODO: pls replace corresponding values appropriately
      /*
      //if(notification.notificationType==1)
      //{
      //    userp.purchaseState=0;
      //}else if(notification.notificationType==1)
      //{
        userp.purchaseState=1;
      //}*/
      await userRef.child(sanitisedpt2).set(user)
      res.status(225).send({"calcs":-225/*QUANTITY*q*/})
      
    }else if(snaps.exists()){res.status(225).send({"calcs":-225/*snaps.child("calcs").val()*/})}
    else{
      console.log("alt "+notification)
      res.status(200).send({"calcs":-1000})
    }
  }catch(e){
    console.error(e)
    res.status(400).send()
  }
}else if((req.header("api")==process.env.PWD)&&('req2' in req.body)){
  try{
    oauth2Client.setCredentials({refresh_token:process.env.REF})
    const androidpublisher = google.androidpublisher({
      version: 'v3',
      auth: oauth2Client
    });
    const sanitisedpt =sanitize(req.body.purchaseToken)
    const snap =await userRef.child(sanitisedpt).once("value")
    var u=snap.toJSON()
    u.calcs=0
    u.purchaseToken=""
    const resl =await androidpublisher.purchases.products.get({
      packageName: "com.shrd.unicalc.free",
      productId: "unicalc_one",
      token: req.body.purchaseToken    
    });
    if(resl.data.consumptionState==0){
    await androidpublisher.purchases.products.consume({packageName:"com.shrd.unicalc.free",
    productId: "unicalc_one",
    token: req.body.purchaseToken
    })
    u.data.consumptionState=1
  }else if(resl.data.consumptionState==1){u.data.consumptionState=1}
    await userRef.child(sanitisedpt).update(u)
    res.status(200).send()
  }catch(e){console.error(e)
    res.status(400).send()}
}else{res.status(400).send()}
                                         
                                          
                                          
                   
                                         
                                      });
                                       


function sanitize(str)
{
 const st1=str.replaceAll(".","*")
 const st2=st1.replaceAll("/","@")
 return st2
}
