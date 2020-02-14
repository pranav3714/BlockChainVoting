const MongoClient = require('mongodb').MongoClient
const jwt = require("jsonwebtoken")
const Web3 = require("web3")
const fs = require('fs')
const face = require('./face')
require('dotenv').config()


const secret = process.env.JWT_SECRET
//Global
const url = process.env.DB_URL
const dbName = process.env.DB_NAME
const collName = process.env.DB_COLL
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SEND_GRID)

let sendEmail = function (message, recepiant) {
    var email = {
        from: 'support@localhost.com',
        to: recepiant,
        subject: 'Email Verification',
        html: message
    };
    sgMail.send(email)
}

let otpMaker = function (length) {
    var result = '';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

//Globals
let burl = process.env.INFURA,
    contractJsonInterface = JSON.parse(fs.readFileSync("build/contracts/Election.json").toString()).abi,
    contractAddress = JSON.parse(fs.readFileSync("build/contracts/Election.json").toString()).networks['3'].address,
    web3 = new Web3(burl),
    contract = new web3.eth.Contract(contractJsonInterface, contractAddress),
    adminAccount = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
web3.eth.accounts.wallet.add(adminAccount)
let main = async () => {
    bal = await contract.methods.getBalance().call()
    if (bal == 0) {
        recipt = await web3.eth.sendTransaction({ from: adminAccount.address, to: contractAddress, value: web3.utils.toWei("1", "ether"), gas: 23000 })
        //console.log(recipt)
    }
}
main()
exports.userAuth = async (panNumber, phone, res, image) => {
    let client = await MongoClient.connect(url, { useUnifiedTopology: true }), coll = client.db(dbName).collection(collName)
    let result = await coll.findOne({ pan: panNumber, phone: phone })
    if (result == null) {
        res.status(200).json({ status: "Invalid Credentials" })
        client.close()
    }
    else {
        if(result.public){
            res.status(200).json({ status: "Already Voted" })
            return
        }
        let out = await face.faceVerify(result.image, image), otp = otpMaker(5)
        if (out == -1) {
            res.status(200).json({ status: "Try Again" })
            return
        }
        else if (out == 0) {
            res.status(200).json({ status: "Only one person in front of camera" })
            return
        }
        else if (out == "unknown") {
            res.status(200).json({ status: "Unknown Face" })
            return
        }
        await coll.updateOne({ pan: panNumber }, { $set: { otp } }) //emsg = `<h1>You otp is ${myobj.otp}</h1><br><p>Valid only for one hour</p>`
        emsg = `<h1>You otp is ${otp}</h1><br><p>Valid only for one hour</p>`
        sendEmail(emsg, result.email)
        res.status(200).json({ status: "OK" })
        client.close()
    }
}
exports.otpAuth = async (panNumber, otp, res) => {
    let client = await MongoClient.connect(url, { useUnifiedTopology: true }), coll = client.db(dbName).collection(collName)
    let result = await coll.findOne({ pan: panNumber, otp })
    if (result == null) {
        res.status(200).json({ status: "Invalid OTP" })
        client.close()
    }
    else {
        await coll.updateOne({ pan: panNumber }, { $unset: { otp: "" } })
        var token = jwt.sign({ id: panNumber }, secret)
        res.status(200).json({ status: "OK", name: result.name, token })
        client.close()
    }
}
exports.publicRegister = async (public, token, res) => {
    result = jwt.verify(token, secret)
    client = await MongoClient.connect(url, { useUnifiedTopology: true }), coll = client.db(dbName).collection(collName)
    doc = await coll.findOne({ pan: result.id })
    //console.log(doc)
    if (doc == null) {
        client.close()
        res.status(200).json({ status: "Invalid Records" })
        return
    }
    else if (doc.public != undefined) {
        client.close()
        res.status(200).json({ status: "Public key already registered" })
        return
    }
    else {
        recpt = await contract.methods.authorize(public).send({ from: adminAccount.address, gas: 80000 })
        console.log(recpt)
        coll.updateOne({ pan: result.id }, { $set: { public } })
        client.close()
        res.status(200).json({ status: "OK" })
    }
}