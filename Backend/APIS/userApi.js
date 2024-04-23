const express = require("express");

const userApi = express.Router();

const bcryptjs = require('bcryptjs')

const jwt = require('jsonwebtoken')



// to extract body of request objects
userApi.use(express.json())
userApi.use(express.urlencoded())

// importing expressAsyncHandler
const expressAsyncHandler = require('express-async-handler');


// creating a middleware to send all available posts CODE VERIFIED✅
userApi.get('/all-users', expressAsyncHandler(async (request, response) => {
    let userCollection = request.app.get("allUserCollection")
    let users = await userCollection.find().toArray()
    response.send({ message: "ALL users", payload: users });
}))

// user details by MID
userApi.get('/user/:id', expressAsyncHandler(async (request, response) => {
    let databaseObject = request.app.get("databaseObject")
    let userId = request.params.id
    let userCollection = await databaseObject.collection(userId);
    let users = await userCollection.find().toArray()
    users = users[0]
    response.send({ message: "User by Mid", payload: users });
}))

// creating a new user CODE VERIFIED✅
userApi.post('/create-user', expressAsyncHandler(async (request, response) => {
    let databaseObject = request.app.get("databaseObject");
    //extracting userdata
    let newUser = request.body;
    // checking if user already exists
    await databaseObject.createCollection(newUser.Mid, function (err, res) {
        if (err.codeName === 'NamespaceExists') {
            response.send({ message: "User Already exists!" });
            throw err;
        }
    })
    let userCollection = databaseObject.collection(newUser.Mid);
    let hashedPassword = await bcryptjs.hash(newUser.password, 6);
    newUser.password = hashedPassword;
    await userCollection.insertOne(newUser);
    let allUserCollection = request.app.get("allUserCollection");
    await allUserCollection.insertOne({ Mid: newUser.Mid, name: newUser.name, type: "Student" });
    response.send({ message: "user created successfully" });

}))


// logging in CODE VERIFIED✅
userApi.post('/login', expressAsyncHandler(async (request, response) => {
    let databaseObject = request.app.get("databaseObject");
    //getting user credentials
    let currentUser = request.body;
    let collections = await databaseObject.collections();
    // validating the user
    let doesUserExists = await collections.some(
        (collection) => collection.collectionName === currentUser.Mid
    );
    if (doesUserExists) {
        //getting user collection and data into userOfDB
        let collectionObject = databaseObject.collection(currentUser.Mid);
        let userOfDB = await collectionObject.find().toArray();
        userOfDB = userOfDB[0];
        // checking if the passwords are correct
        let validate = await bcryptjs.compare(currentUser.password, userOfDB.password)

        if (validate === true) {
            //sending the token to the client along with his own information
            let token = jwt.sign({ username: userOfDB.username }, "eduprimeforvnr", { expiresIn: "2d" })
            response.send({ message: "Authentication Success", payload: token, userData: userOfDB, status: true })
        }
        else {
            response.send({ message: "Invalid Password", validate: false })
        }
    }
    else {
        response.send({ message: "No such user exists" })
    }
}))




// delete user route by name CODE VERIFIED✅
userApi.delete('/delete-user', expressAsyncHandler(async (request, response) => {
    let collectionName = request.body.Mid;
    let databaseObject = request.app.get("databaseObject");
    await databaseObject.collection(collectionName).drop(function (err, res) {
        if (err) {
            response.send("No such user exists");
        }
        else response.send("User deleted successfully");
    })
    let allUserCollection = request.app.get("allUserCollection");
    await allUserCollection.deleteOne({ Mid: collectionName });
    response.send({ message: "User deleted successfully" })
}))

// update existing userdetails
userApi.put("/update-details", expressAsyncHandler(async (request, response) => {
    // extracting updated object
    let modifiedUser = request.body;
    let databaseObject = request.app.get("databaseObject");
    let collections = await databaseObject.collections();
    // validating the user
    let doesUserExists = await collections.some(
        (collection) => collection.collectionName === modifiedUser.Mid
    );

    if (!doesUserExists) {
        response.send({ message: "No user exists" })
    }
    else {
        // get table of user
        let userCollection = databaseObject.collection(modifiedUser.Mid);
        await userCollection.updateOne({ Mid: modifiedUser.Mid }, { $set: { ...modifiedUser } })
        response.send({ message: "userUpdated successfully", payload: modifiedUser });
    }

}))

// expoting 
module.exports = userApi;
