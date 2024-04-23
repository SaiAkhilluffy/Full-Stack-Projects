const express=require('express');
const expressAsyncHandler = require('express-async-handler');

const combinedOpsApi=express.Router();
combinedOpsApi.use(express.json())
combinedOpsApi.use(express.urlencoded())

combinedOpsApi.get('/get-all',expressAsyncHandler(async(request,response)=>{
    const journalCollection=request.app.get("journalCollection")
    const conferenceCollection=request.app.get("conferenceCollection")
    let temp=[]
    temp=await journalCollection.find().toArray();
    temp.push(...(await conferenceCollection.find().toArray()))
    response.send({message:"All journals and conferences",payload:temp})
}))

//write for a single user

//Filter Computation 

combinedOpsApi.post('/apply-filters',expressAsyncHandler(async(request,response)=>{
    const filterObj=request.body;
    let temp=[]
    if(filterObj.type==='Journals'){
        const journalCollection=request.app.get("journalCollection")
        temp=await journalCollection.find().toArray();
    }
    else if(filterObj.type==='Conferences'){
        const conferenceCollection=request.app.get("conferenceCollection")
        temp=await conferenceCollection.find().toArray();
    }
    else{
        const journalCollection=request.app.get("journalCollection")
        const conferenceCollection=request.app.get("conferenceCollection")
        temp=await journalCollection.find().toArray();
        temp.push(...(await conferenceCollection.find().toArray()))
    }
    
    if(filterObj.domain!==''){
       temp=temp.filter((ele)=>{
            if(ele.domain===filterObj.domain) return true;
            return false;
       }).map((ele)=>ele);
    }
    if(filterObj.indexedIn!==''){
        temp=temp.filter((ele)=>{
            if(ele.indexedIn===filterObj.indexedIn) return true;
            return false;
        }).map((ele)=>ele);
    }
    if(filterObj.startDate!==''){
        temp=temp.filter((ele)=>{
            if(ele.publicationDate>=filterObj.startDate) return true;
            return false;
        }).map((ele)=>ele);
    }
    if(filterObj.endDate!==''){
        temp=temp.filter((ele)=>{
            return ele.publicationDate<=filterObj.endDate;
        }).map((ele)=>ele);
    }
    response.send({message:"Filter Results",payload:temp});
}))

//expoting 
module.exports=combinedOpsApi;