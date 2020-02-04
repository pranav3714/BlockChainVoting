let App = {
    web3: {},
    contract: {},
    candidates: [],
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
        var ctx = document.getElementById('myChart').getContext('2d');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'doughnut',

            // The data for our dataset
            data: {
                labels: App.candidates.map(val => val.name),
                datasets: [{
                    label: 'My First dataset',
                    backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
                    borderColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
                    data: App.candidates.map(val => parseInt(val.voteCount))
                }]
            },
            // Configuration options go here
            options: {}
        })
    }
}
App.init()