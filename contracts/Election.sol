pragma solidity ^0.5.0;

contract Election {
    struct Candidate {
        string name;
        string party;
        uint voteCount;
    }
    struct Voter {
        bool voted;
        uint weight;
    }
    address payable public owner;
    mapping(address => Voter) public voters;
    Candidate[] public candidates;
    event ElectionResult(string candidateName, uint voteCount);
    constructor() public {
        owner = msg.sender;
        candidates.push(Candidate("The Flash", "DC Comics", 0));
        candidates.push(Candidate("Avengers", "Marvel Cinematic Universe", 0));
    }
    function candidateCount() public view returns(uint){
        return candidates.length;
    }
    function authorize(address payable voter) public {
        require(msg.sender == owner, "Only for admin");
        require(voters[voter].weight == 0, "Already Autherized");
        voter.transfer(2200000000000000);
        voters[voter].weight = 1;
    }
    function vote(uint voteIndex) public {
        require(!voters[msg.sender].voted, "Already voted");
        require(voters[msg.sender].weight == 1,"Unautherized Voters not Allowed");
        voters[msg.sender].voted = true;
        candidates[voteIndex].voteCount += voters[msg.sender].weight;
    }
    function end() public {
        require(msg.sender == owner, "Only owner can distroy the contact");
        for(uint i = 0;i<candidates.length;i++) {
            emit ElectionResult(candidates[i].name, candidates[i].voteCount);
        }
        selfdestruct(owner);
    }
    function getBalance() public view returns(uint256) {
        return address(this).balance;
    }
    function() external payable {

    }
}