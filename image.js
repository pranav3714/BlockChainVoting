const MongoClient = require('mongodb').MongoClient
require('dotenv').config()

//Make sure that the records of the user is present in the database (name, pan, phone)

let imageone = "base64 encoded image goes here"
const url = process.env.DB_URL
const dbName = process.env.DB_NAME
const collName = process.env.DB_COLL

let main = async() => {
    let client = await MongoClient.connect(url,{ useUnifiedTopology: true }), coll = client.db(dbName).collection(collName)
    let result = await coll.updateOne({pan: "panNumber of user to upload image for"}, {$set: {image: imageone}})
    console.log(result)
    client.close()
}
main()
