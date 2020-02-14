const MongoClient = require('mongodb').MongoClient
require('dotenv').config()

//Make sure that the records of the user is present in the database (name, pan, phone)
<<<<<<< HEAD
=======

let imageone = "base64 encoded image goes here"
>>>>>>> 26ba68bb257eaeded4a7a680048077857be432fc
const url = process.env.DB_URL
const dbName = process.env.DB_NAME
const collName = process.env.DB_COLL

let imageone = ""

let main = async() => {
    let client = await MongoClient.connect(url,{ useUnifiedTopology: true }), coll = client.db(dbName).collection(collName)
    let result = await coll.updateOne({pan: "AAAPL1234C"}, {$set: {image: imageone}})
    console.log(result)
    client.close()
}
main()
