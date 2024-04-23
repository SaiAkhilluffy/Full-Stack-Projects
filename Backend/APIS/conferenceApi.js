const { compareSync } = require('bcryptjs');
const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const conferenceApi = express.Router();

conferenceApi.use(express.json())
conferenceApi.use(express.urlencoded())

// get the Conferences published by all users CODE VERIFIED✅
conferenceApi.get('/all-conferences', expressAsyncHandler(async (request, response) => {
    const conferenceCollection = request.app.get("conferenceCollection");
    let allConferences = await conferenceCollection.find().toArray();
    response.send({ message: "Arrays of all Conferences", payload: allConferences });
}))

// fetch the domains CODE VERIFIED✅
conferenceApi.get("/domains", expressAsyncHandler(async (request, response) => {
    let domainCollection = request.app.get("domainsCollection")
    let domains = await domainCollection.find().toArray()
    response.send({ message: "domains have been fetched", payload: domains })
}))

// fetch the domains CODE VERIFIED✅
conferenceApi.get("/IndexedIn", expressAsyncHandler(async (request, response) => {
    let IndexedInCollection = request.app.get("IndexedInCollection")
    let IndexedIn = await IndexedInCollection.find().toArray()
    response.send({ message: "IndexedIn has been fetched", payload: IndexedIn })
}))

// fetch the authors CODE VERIFIED✅
conferenceApi.get("/AllAuthors", expressAsyncHandler(async (request, response) => {
    let allUserCollection = request.app.get("allUserCollection")
    let Authors = await allUserCollection.find().toArray()
    response.send({ message: "All Authors has been fetched", payload: Authors })
}))

// fetch the Students CODE VERIFIED✅
conferenceApi.get("/Students", expressAsyncHandler(async (request, response) => {
    let allUserCollection = request.app.get("allUserCollection")
    let Students = await allUserCollection.find({ type: "Student" }).toArray()
    response.send({ message: "Students has been fetched", payload: Students })
}))

// fetch the Faculties CODE VERIFIED✅
conferenceApi.get("/Faculty", expressAsyncHandler(async (request, response) => {
    let allUserCollection = request.app.get("allUserCollection")
    let Faculty = await allUserCollection.find({ type: "Faculty" }).toArray()
    response.send({ message: "Faculty has been fetched", payload: Faculty })
}))

// SENDING FILTERED DATA CODE VERIFIED✅
conferenceApi.post('/filters', expressAsyncHandler(async (request, response) => {
    const filterData = request.body;
    const conferenceCollection = request.app.get("conferenceCollection")
    data = await conferenceCollection.find().toArray();
    if (filterData.indexedIn.length !== 0) {
        for (let i = 0; i < filterData.indexedIn.length; i++) {
            data = data.filter((conference) => {
                for (let j = 0; j < conference.indexedIn.length; j++) {
                    if (conference.indexedIn[j] === filterData.indexedIn[i]) {
                        return true;
                    }
                }
            }).map((conference) => conference);
        }
    }
    if (filterData.domain.length !== 0) {
        for (let i = 0; i < filterData.domain.length; i++) {
            data = data.filter((conference) => {
                for (let j = 0; j < conference.domain.length; j++) {
                    if (conference.domain[j] === filterData.domain[i]) {
                        return true;
                    }
                }
            }).map((conference) => conference);
        }
    }
    if (filterData.author !== []) {
        for (let i = 0; i < filterData.author.length; i++) {
            data = data.filter((conference) => {
                for (let j = 0; j < conference.authorsList.length; j++) {
                    if (conference.authorsList[j] === filterData.author[i]) {
                        return true;
                    }
                }
            }).map((conference) => conference);
        }
    }
    if (filterData.startDate !== '') {
        data = data.filter((conference) => {
            return conference.publicationDate >= filterData.startDate;
        }).map((conference) => conference);
    }
    if (filterData.endDate !== '') {
        data = data.filter((conference) => {
            return conference.publicationDate <= filterData.endDate;
        }).map((conference) => conference);
    }
    response.send({ message: "Filter Results", payload: data });
}))

// fetch the conferences created by a user
conferenceApi.get("/MyConferences/:mid", expressAsyncHandler(async (request, response) => {
    let userId = request.params.mid
    let conferences = request.app.get("conferenceCollection")
    let userConferences = await conferences.find({ createdBy: userId }).toArray()
    response.send({ message: `Conferences fetched by ${userId}`, payload: userConferences })
}))

// get Conferences published by a single user CODE VERIFIED✅
conferenceApi.get('/:Mid', expressAsyncHandler(async (request, response) => {
    let userId = request.params.Mid;
    let databaseObject = request.app.get("databaseObject");
    let conferenceCollection = request.app.get("conferenceCollection");
    // get the user collection from database
    let userCollection = await databaseObject.collection(userId);
    let conferenceList = await userCollection.find().toArray();
    //get the list of Conferences from the specific userr 
    conferenceList = conferenceList[0].conferences;
    //AlConferences store the Conferences published by a single user
    let AllConferences = [];
    for (let i = 0; i < conferenceList.length; i++) {
        let reqconference = await conferenceCollection.findOne({ doi: conferenceList[i] });
        AllConferences.push(reqconference);
    }
    response.send({ message: `All Conferences uploaded by ${userId}`, payload: AllConferences })
}))

// add a conference to the database CODE VERIFIED✅
conferenceApi.post('/add-conference', expressAsyncHandler(async (request, response) => {
    const conferenceCollection = request.app.get("conferenceCollection");
    const conference = request.body;
    let databaseObject = request.app.get("databaseObject");
    //if a conference is already uploaded send a message
    let isAlreadyThere = await conferenceCollection.findOne({ doi: conference.doi });
    if (isAlreadyThere) {
        response.send({ message: "Conference Already uploaded by other authors please check in your list" });
        // return;
    }
    else {
        //add to conference collection
        await conferenceCollection.insertOne(conference);
        //get the list of authors
        let authorsList = conference.authorsList;
        let usersThatExists = []
        for (let i = 0; i < authorsList.length; i++) {
            let collectionExists = await databaseObject.collection(authorsList[i])
            collectionExists = await collectionExists.find().toArray()
            collectionExists = collectionExists[0]
            if (collectionExists !== undefined) {
                usersThatExists.push(authorsList[i])
            }
        }
        authorsList = usersThatExists
        async function addTousers() {
            //add doi to every authors collection
            for (let i = 0; i < authorsList.length; i++) {
                let userCollection = await databaseObject.collection(authorsList[i])
                let userObject = await userCollection.find().toArray()
                userObject = userObject[0];
                userObject.conferences.push(conference.doi);
                await userCollection.updateOne({ Mid: userObject?.Mid }, { $set: { ...userObject } });
            }
        }
        addTousers();
        response.send({ message: "conference uploaded successfully" });
    }

}));


// delete a conference CODE VERIFIED✅
conferenceApi.post('/delete-conference', expressAsyncHandler(async (request, response) => {
    const conferenceCollection = request.app.get("conferenceCollection");
    const objectToDelete = request.body
    let databaseObject = request.app.get("databaseObject");
    //get the details of conference
    let authorsList = await conferenceCollection.findOne({ doi: objectToDelete.doi });
    authorsList = authorsList.authorsList;
    let usersThatExists = []
    for (let i = 0; i < authorsList.length; i++) {
        let collectionExists = await databaseObject.collection(authorsList[i])
        collectionExists = await collectionExists.find().toArray()
        collectionExists = collectionExists[0]
        if (collectionExists !== undefined) {
            usersThatExists.push(authorsList[i])
        }
    }
    authorsList = usersThatExists
    // remove doi from the authors collection
    async function deleteFromusers() {
        for (let i = 0; i < authorsList.length; i++) {
            let userCollection = databaseObject.collection(authorsList[i])
            let userObject = await userCollection.find().toArray()
            userObject = userObject[0]
            let modifiedObject = { ...userObject };
            //taking list of authors into userObject
            userObject = userObject.conferences;
            //removing entries form all authors
            let data = []
            for (let j = 0; j < userObject.length; j++) {
                if (userObject[j] === objectToDelete.doi) {
                    continue;
                }
                data.push(userObject[j]);
            }
            modifiedObject.conferences = data;
            await userCollection.updateOne({ Mid: modifiedObject.Mid }, { $set: { ...modifiedObject } });
        }
    }
    deleteFromusers();
    await conferenceCollection.deleteOne({ doi: objectToDelete.doi });
    response.send({ message: "conference deleted successfully" })
}));

// UPDATE CONFERENCE BY DOI CODE VERIFIED✅
conferenceApi.put('/update-conference', expressAsyncHandler(async (request, response) => {
    let databaseObject = request.app.get("databaseObject");
    const conferenceCollection = request.app.get("conferenceCollection");
    let modifiedConference = request.body;
    let doi = request.body.oldDoi;
    delete modifiedConference.oldDoi
    let oldConference = await conferenceCollection.findOne({ doi: doi })
    async function doOperation() {
        authorsList = oldConference.authorsList;
        let usersThatExists = []
        for (let i = 0; i < authorsList.length; i++) {
            let collectionExists = await databaseObject.collection(authorsList[i])
            collectionExists = await collectionExists.find().toArray()
            collectionExists = collectionExists[0]
            if (collectionExists !== undefined) {
                usersThatExists.push(authorsList[i])
            }
        }
        authorsList = usersThatExists
        //delete the doi from all previous authors
        async function deleteFromusers() {
            for (let i = 0; i < authorsList.length; i++) {
                let userCollection = databaseObject.collection(authorsList[i])
                let userObject = await userCollection.find().toArray()
                userObject = userObject[0]
                let modifiedObject = userObject;
                //taking list of authors into userObject
                userObject = userObject.conferences;
                //removing entries form all authors
                let data = []
                for (let j = 0; j < userObject.length; j++) {
                    if (userObject[j] === oldConference.doi) {
                        continue;
                    }
                    data.push(userObject[j]);
                }
                modifiedObject.conferences = data;
                await userCollection.updateOne({ Mid: modifiedObject.Mid }, { $set: { ...modifiedObject } });
            }
        }
        await deleteFromusers();
        //add the doi to new authors or modified authors
        async function addTousers() {
            authorsList = modifiedConference.authorsList
            let usersThatExists = []
            for (let i = 0; i < authorsList.length; i++) {
                let collectionExists = await databaseObject.collection(authorsList[i])
                collectionExists = await collectionExists.find().toArray()
                collectionExists = collectionExists[0]
                if (collectionExists !== undefined) {
                    usersThatExists.push(authorsList[i])
                }
            }
            authorsList = usersThatExists
            for (let i = 0; i < authorsList.length; i++) {
                let userCollection = databaseObject.collection(authorsList[i])
                let userObject = await userCollection.find().toArray()
                userObject = userObject[0]
                userObject.conferences.push(modifiedConference.doi);
                await userCollection.updateOne({ Mid: userObject.Mid }, { $set: { ...userObject } });
            }
        }
        await addTousers();
        await conferenceCollection.updateOne({ doi: oldConference.doi }, { $set: { ...modifiedConference } });
        response.send({ message: "Update Successful" });
    }
    let exists = await conferenceCollection.findOne({ doi: modifiedConference.doi })
    if (exists?.doi === undefined) {
        doOperation()
    }
    else {
        if (modifiedConference.doi === oldConference.doi) {
            doOperation()
        }
        else {
            response.send({ message: "Conference Exists" })
        }
    }
}))

module.exports = conferenceApi;
