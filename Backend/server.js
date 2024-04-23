
const exp = require('express');
const cors = require('cors')
const app = exp();
app.use(cors())
const PORT = 8080;


//connecting to database using database link
const DBURL = "mongodb://MiniProject:MiniProject123@ac-8lcygyf-shard-00-00.vbpnhom.mongodb.net:27017,ac-8lcygyf-shard-00-01.vbpnhom.mongodb.net:27017,ac-8lcygyf-shard-00-02.vbpnhom.mongodb.net:27017/?ssl=true&replicaSet=atlas-8ffhel-shard-0&authSource=admin&retryWrites=true&w=majority";

//importing mongo client
const mongoclient = require("mongodb").MongoClient;

//connecting to mongo client
mongoclient.connect(DBURL)
    .then((client) => {
        const databaseObject = client.db("MiniProjectBackend");
        const journalCollection = databaseObject.collection("Journals");
        const conferenceCollection = databaseObject.collection("Conferences");
        const allUserCollection = databaseObject.collection("AllUsers");
        const IndexedInCollection = databaseObject.collection("IndexedIn");
        const domainsCollection = databaseObject.collection("Domains");
        app.set("allUserCollection", allUserCollection);
        app.set("databaseObject", databaseObject);
        app.set("journalCollection", journalCollection);
        app.set("conferenceCollection", conferenceCollection);
        app.set("IndexedInCollection", IndexedInCollection);
        app.set("domainsCollection", domainsCollection);
        console.log("Connected to database successfully");
    })
    .catch((err) => {
        console.log("failed to connect database to the application", err)
    })

app.use(exp.json())

//importing userApis
const userApis = require('./APIS/userApi.js');
app.use('/users', userApis);

//importing journalApi
const journalApi = require('./APIS/journalApi')
app.use('/journal', journalApi);

//importing conferenceApi
const conferenceApi = require('./APIS/conferenceApi')
app.use('/conference', conferenceApi);

//importing and using adminOpsApi
// const adminOpsApi = require('./APIS/adminops')
// app.use('/adminOps', adminOpsApi)

//importing and using combinedOpsApi
const combinedOpsApi=require('./APIS/CombinedOps')
app.use('/combined',combinedOpsApi)

//Middleware to handle errors
app.use((error, request, response, next) => {
    response.send({ Message: `Error Occured`, Error_type: `${error}` })
})

//Middleware to handle invalid path
app.use((request, response, next) => {
    response.send({ Message: `Invalid path: The path ${request.url} is invalid` })
})
app.listen(PORT, () => console.log(`app is listening on ${PORT}`));