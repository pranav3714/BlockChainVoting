# BlockChainVoting
Special thanks to <a href="https://github.com/justadudewhohacks">Vincent Mühler</a> for open sourcing efforts on face recognision npm package <a href="https://github.com/justadudewhohacks/face-api.js">Face API</a>.

As the viewer of this repository you get an additional privilege to run this project without generating an infura ropsten network api key as it is already hardcoded into the code.

<h4>How to run(I personally love Debian Linux so the instructions are written accordingly.)</h4>

Step 1: Clone this repository using the command.<br>
git clone https://github.com/pranav3714/BlockChainVoting.git<br><br>

Step 2: Navigate to the cloned repository using.<br>
cd BlockChainVoting<br><br>

Step 3: Install the dependancies using.<br>
npm i<br><br>

Step 4: Use mongodb database.(This is a basic database architecture for test purposes only.)<br>
Database name:     panDatabase<br>
Collection name:   users<br>
Document schema:
{ _id: objectID, name : string, pan : string, phone : string, image: base64encodedImage}<br>
Document Sample:<br>
{ _id : ObjectId("5e07a89511fe041fb1668b97"), "name" : "Raman Raaj", "pan" : "AAAPL1234C", "phone" : "9324679902", image: base64encodedImage }<br><br>
Note: <br>
      &nbsp;&nbsp;&nbsp;&nbsp;Image of user can be encoded to base64 programmatically or using any online tool.(input image format expected is jpeg)<br>
      &nbsp;&nbsp;&nbsp;&nbsp;_id is automatically generated by Mongo<br>
      &nbsp;&nbsp;&nbsp;&nbsp;concepts like indexing and user authentication for efficiency and security respectively<br>
      &nbsp;&nbsp;&nbsp;&nbsp;Image can be inserted to the database using the image.js file in the project directory.<br>
<br>
Step 5: Run the app.js file using node<br>
node app.js<br><br>

Step 6: Open a web browser and type in URL:<br>
http://localhost:3000<br>

<h4>Developer dependency</h4>
NodeJS(v12.14.1)<br>
TruffleJS(v5.1.8)<br>
<h4>Environment Constants</h4>
Make sure to add a .env file that contains following properties.<br>
DB_URL = URL_TO_MONGODB<br>
DB_NAME = "panDatabase"<br>
DB_COLL = "users"<br>
PRIVATE_KEY = ERC_20_WALLET_PRIVATE_KEY<br>
MNEMONIC = ERC_20_WALLET_MNEMONIC_PHRASE<br>
INFURA = "https://ropsten.infura.io/v3/075dda323f9b4c29a2bc22fd96cb29e6"<br>
JWT_SECRET = SECURE_PASSWORD_TO_GENERATE_AND_AUTHERIZE_JWT<br>
<h4>Smart Contract deployment on ropsten test network</h4>
<a href="https://medium.com/coinmonks/5-minute-guide-to-deploying-smart-contracts-with-truffle-and-ropsten-b3e30d5ee1e">Click here</a> to see detailed tutorial on deploying smart contract
