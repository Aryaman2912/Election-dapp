// SPDX-License-Identifier: MIT
pragma solidity >= 0.4.2 < 0.9.0;

contract Election{
    // struct representing a candidate
    struct Candidate {
        uint id;        // id of the candidate
        string name;    // name of the candidate
        uint voteCount; // no. of votes for the candidate
    }

    // hashmap to store the candidates' data
    // key - unsigned int, value - Candidate struct
    mapping(uint => Candidate) public candidates;

    // boolean mapping to keep track of voters that have already voted
    mapping(address => bool) public voters;
    // number of candidates
    uint public candidatesCount;

    // constructor for the contract
    constructor() public {
        addCandidate("Steve");
        addCandidate("John");
        addCandidate("Heisenberg");
    }
    
    // function to add candidates
    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0); // create instance of Candidate struct using given data
    }

    // function to implement voting
    function vote(uint _candidateId) public {

        // ensure that the voter hasn't already voted
        require(!voters[msg.sender]);

        // check if the candidate is valid
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        // update the state for the voter who just voted
        voters[msg.sender] = true;

        // increment the vote count for the candidate
        candidates[_candidateId].voteCount++;
    }
}