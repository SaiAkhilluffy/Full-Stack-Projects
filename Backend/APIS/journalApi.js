const { compareSync } = require('bcryptjs');
const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const journalApi = express.Router();

journalApi.use(express.json())
journalApi.use(express.urlencoded())

// get the Journal published by all users CODE VERIFIED✅
journalApi.get('/all-journals', expressAsyncHandler(async (request, response) => {
    const journalCollection = request.app.get("journalCollection");
    let allJournals = await journalCollection.find().toArray();
    response.send({ message: "Arrays of all Journals", payload: allJournals });
}))

// fetch the domains CODE VERIFIED✅
journalApi.get("/domains", expressAsyncHandler(async (request, response) => {
    let domainCollection = request.app.get("domainsCollection")
    let domains = await domainCollection.find().toArray()
    response.send({ message: "domains have been fetched", payload: domains })
}))

// fetch the indexedin CODE VERIFIED✅
journalApi.get("/IndexedIn", expressAsyncHandler(async (request, response) => {
    let IndexedInCollection = request.app.get("IndexedInCollection")
    let IndexedIn = await IndexedInCollection.find().toArray()
    response.send({ message: "IndexedIn has been fetched", payload: IndexedIn })
}))

// fetch the authors CODE VERIFIED✅
journalApi.get("/AllAuthors", expressAsyncHandler(async (request, response) => {
    let allUserCollection = request.app.get("allUserCollection")
    let Authors = await allUserCollection.find().toArray()
    response.send({ message: "All Authors has been fetched", payload: Authors })
}))

// fetch the Students CODE VERIFIED✅
journalApi.get("/Students", expressAsyncHandler(async (request, response) => {
    let allUserCollection = request.app.get("allUserCollection")
    let Students = await allUserCollection.find({ type: "Student" }).toArray()
    response.send({ message: "Students has been fetched", payload: Students })
}))

// fetch the Faculties CODE VERIFIED✅
journalApi.get("/Faculty", expressAsyncHandler(async (request, response) => {
    let allUserCollection = request.app.get("allUserCollection")
    let Faculty = await allUserCollection.find({ type: "Faculty" }).toArray()
    response.send({ message: "Faculty has been fetched", payload: Faculty })
}))

// SENDING FILTERED DATA CODE VERIFIED✅
journalApi.post('/filters', expressAsyncHandler(async (request, response) => {
    const filterData = request.body;
    const journalCollection = request.app.get("journalCollection")
    data = await journalCollection.find().toArray();
    if (filterData.indexedIn.length !== 0) {
        for (let i = 0; i < filterData.indexedIn.length; i++) {
            data = data.filter((journal) => {
                for (let j = 0; j < journal.indexedIn.length; j++) {
                    if (journal.indexedIn[j] === filterData.indexedIn[i]) {
                        return true;
                    }
                }
            }).map((journal) => journal);
        }
    }
    if (filterData.domain.length !== 0) {
        for (let i = 0; i < filterData.domain.length; i++) {
            data = data.filter((journal) => {
                for (let j = 0; j < journal.domain.length; j++) {
                    if (journal.domain[j] === filterData.domain[i]) {
                        return true;
                    }
                }
            }).map((journal) => journal);
        }
    }
    if (filterData.author !== []) {
        for (let i = 0; i < filterData.author.length; i++) {
            data = data.filter((journal) => {
                for (let j = 0; j < journal.authorsList.length; j++) {
                    if (journal.authorsList[j] === filterData.author[i]) {
                        return true;
                    }
                }
            }).map((journal) => journal);
        }
    }
    if (filterData.startDate !== '') {
        data = data.filter((journal) => {
            return journal.publicationDate >= filterData.startDate;
        }).map((journal) => journal);
    }
    if (filterData.endDate !== '') {
        data = data.filter((journal) => {
            return journal.publicationDate <= filterData.endDate;
        }).map((journal) => journal);
    }
    response.send({ message: "Filter Results", payload: data });
}))

// fetch the journals created by a user CODE VERIFIED✅
journalApi.get("/MyJournals/:mid", expressAsyncHandler(async (request, response) => {
    let userId = request.params.mid
    let Journals = request.app.get("journalCollection")
    let userJournals = await Journals.find({ createdBy: userId }).toArray()
    response.send({ message: `Journals fetched by ${userId}`, payload: userJournals })
}))

// get Journals published by a single user CODE VERIFIED✅
journalApi.get('/:Mid', expressAsyncHandler(async (request, response) => {
    let userId = request.params.Mid;
    let databaseObject = request.app.get("databaseObject");
    let journalCollection = request.app.get("journalCollection");
    // get the user collection from database
    let userCollection = await databaseObject.collection(userId);
    let journalList = await userCollection.find().toArray();
    //get the list of Journals from the specific userr 
    journalList = journalList[0].journals;
    //AllJournals store the Journals published by a single user
    let AllJournals = [];
    for (let i = 0; i < journalList.length; i++) {
        let reqJournal = await journalCollection.findOne({ issn: journalList[i] });
        AllJournals.push(reqJournal);
    }
    response.send({ message: `All Journals uploaded by ${userId}`, payload: AllJournals })
}))

// add a journal to the database CODE VERIFIED✅
journalApi.post('/add-journal', expressAsyncHandler(async (request, response) => {
    const journalCollection = request.app.get("journalCollection");
    const journal = request.body;
    let databaseObject = request.app.get("databaseObject");
    //if a journal is already uploaded send a message
    let isAlreadyThere = await journalCollection.findOne({ issn: journal.issn });
    if (isAlreadyThere) {
        response.send({ message: "Journal Already uploaded by other authors please check in your list" });
        // return;
    }
    else {
        //add to journal collection
        await journalCollection.insertOne(journal);
        //get the list of authors
        let authorsList = journal.authorsList;
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
            //add issn to every authors collection
            for (let i = 0; i < authorsList.length; i++) {
                let userCollection = await databaseObject.collection(authorsList[i])
                let userObject = await userCollection.find().toArray()
                userObject = userObject[0];
                userObject.journals.push(journal.issn);
                await userCollection.updateOne({ Mid: userObject?.Mid }, { $set: { ...userObject } });
            }
        }
        addTousers();
        response.send({ message: "journal uploaded successfully" });
    }

}));


// delete a journal CODE VERIFIED✅
journalApi.post('/delete-journal', expressAsyncHandler(async (request, response) => {
    const journalCollection = request.app.get("journalCollection");
    const objectToDelete = request.body;
    let databaseObject = request.app.get("databaseObject");
    //get the details of journal
    let authorsList = await journalCollection.findOne({ issn: objectToDelete.issn });
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
    // remove issn from the authors collection
    async function deleteFromusers() {
        for (let i = 0; i < authorsList.length; i++) {
            let userCollection = databaseObject.collection(authorsList[i])
            let userObject = await userCollection.find().toArray()
            userObject = userObject[0]
            let modifiedObject = { ...userObject };
            //taking list of authors into userObject
            userObject = userObject.journals;
            //removing entries form all authors
            let data = []
            for (let j = 0; j < userObject.length; j++) {
                if (userObject[j] === objectToDelete.issn) {
                    continue;
                }
                data.push(userObject[j]);
            }
            modifiedObject.journals = data;
            await userCollection.updateOne({ Mid: modifiedObject.Mid }, { $set: { ...modifiedObject } });
        }
    }
    deleteFromusers();
    await journalCollection.deleteOne({ issn: objectToDelete.issn });
    response.send({ message: "journal deleted successfully" })
}));

// UPDATE JOURNAL BY ISSN CODE VERIFIED✅
journalApi.put('/update-journal', expressAsyncHandler(async (request, response) => {
    let databaseObject = request.app.get("databaseObject");
    const journalCollection = request.app.get("journalCollection");
    let modifiedJournal = request.body;
    let issn = request.body.oldIssn;
    delete modifiedJournal.oldIssn
    let oldJournal = await journalCollection.findOne({ issn: issn })
    async function doOperation() {
        authorsList = oldJournal.authorsList
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
        //delete the issn from all previous authors
        async function deleteFromusers() {
            for (let i = 0; i < authorsList.length; i++) {
                let userCollection = databaseObject.collection(authorsList[i])
                let userObject = await userCollection.find().toArray()
                userObject = userObject[0]
                let modifiedObject = userObject;
                //taking list of authors into userObject
                userObject = userObject.journals;
                //removing entries form all authors
                let data = []
                for (let j = 0; j < userObject.length; j++) {
                    if (userObject[j] === oldJournal.issn) {
                        continue;
                    }
                    data.push(userObject[j]);
                }
                modifiedObject.journals = data;
                await userCollection.updateOne({ Mid: modifiedObject.Mid }, { $set: { ...modifiedObject } });
            }
        }
        await deleteFromusers();
        //add the issn to new authors or modified authors
        async function addTousers() {
            authorsList = modifiedJournal.authorsList
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
                userObject.journals.push(modifiedJournal.issn);
                await userCollection.updateOne({ Mid: userObject.Mid }, { $set: { ...userObject } });
            }
        }
        await addTousers();
        await journalCollection.updateOne({ issn: oldJournal.issn }, { $set: { ...modifiedJournal } });
        response.send({ message: "Update Successful" });
    }
    let exists = await journalCollection.findOne({ issn: modifiedJournal.issn })
    if (exists?.issn === undefined) {
        doOperation()
    }
    else {
        if (modifiedJournal.issn === oldJournal.issn) {
            doOperation()
        }
        else {
            response.send({ message: "Journal Exists" })
        }
    }
}))

module.exports = journalApi;
