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

}