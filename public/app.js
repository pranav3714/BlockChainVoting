App = {
    web3: {},
    contract: {},
    candidates: [],
    account: {},
    init: async() => {
        return await App.initWeb3()
    },
    initWeb3: async() => {
        this.web3 = new Web3("https://ropsten.infura.io/v3/075dda323f9b4c29a2bc22fd96cb29e6")
        return await App.initContract()
    },
    initContract: async() => {
        this.contract = new this.web3.eth.Contract(abi, address)
        return await App.loadCandidates()
    },
    loadCandidates: async() => {
        // console.log(this.web3)
        // console.log(this.contract)
        let counter = await this.contract.methods.candidateCount().call();
        for(let i=0; i<counter ;i++){
            App.candidates.push(await this.contract.methods.candidates(i).call())
        }
        return await App.renderCandidates()
    },
    renderCandidates: async() => {
        var candidatesRow = $('#candidatesRow')
        var candidateTemplate = $('#candidateTemplate')
        for(i=0;i<App.candidates.length;i++){
            candidateTemplate.find('.displayChange').css('display', 'inline')
            candidateTemplate.find('.panel-title').text(App.candidates[i].name)
            candidateTemplate.find('img').attr('src', App.candidates[i].name.replace(/\s+/g, '').toLowerCase()+'.jpg')
            candidateTemplate.find('.candidate-party').text(App.candidates[i].party)
            candidateTemplate.find('.vote-count').text(App.candidates[i].voteCount)
            candidateTemplate.find('.candidate-id').text(i)
            candidateTemplate.find('.btn-adopt').attr('data-id', i)
            candidateTemplate.find('.btn-adopt').attr('data-name', App.candidates[i].name)
            candidateTemplate.find('.btn-adopt').attr('data-party', App.candidates[i].party)
            candidatesRow.append(candidateTemplate.html())
        }
        return await App.initAccount()
    },
    initAccount: async() => {
        if(localStorage.getItem('account') == null || localStorage.getItem('account') == ""){
            this.account = this.web3.eth.accounts.create()
            localStorage.setItem('account', JSON.stringify(this.account))
            //download('Voter ID', JSON.stringify(this.account))
            httpRequest('/publickey', {public: this.account.address, token: localStorage.getItem("token")}, (data, textStatus, jQxhr) => {
                if(data.status != "OK"){
                    alert(data.status)
                }
            })
            console.log(this.account)
        }
        else{
            this.account = this.web3.eth.accounts.privateKeyToAccount(JSON.parse(localStorage.getItem('account')).privateKey)
            //console.log(this.account)
        }
        $('#public').html("Account: "+this.account.address)
        let link = "https://ropsten.etherscan.io/address/"+this.account.address
        $('#etherscan').attr("href", link)
        return await App.eventBinder()
    },
    eventBinder: async() => {
        $(".vote-btn").click(async (e) => {
            let id = parseInt(e.currentTarget.attributes['data-id'].value)
            //this.contract.defaultAccount = this.account.address
            this.web3.eth.accounts.wallet.add(this.account)//0x3D0b5098A27565b4DE6f2A359de11F165aC7Fc4B
            recp = await this.contract.methods.vote(id).send({from: this.account.address, gas: 100000})//Replace from with this.account.address in production
            download("reciept", JSON.stringify(recp))
        })
    }
}
App.init()