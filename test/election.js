const _deploy_contracts = require("../migrations/2_deploy_contracts")

var Election = artifacts.require("./Election.sol")

contract("Election", function(accounts){
    var electionInstance;

    // test for right number of candidates
    it("The contract is initialized with three candidates", function(){
        return Election.deployed().then(function(instance){
            return instance.candidatesCount();
        }).then(function(count){
            assert.equal(count, 3);
        });
    });

    // test to check if each candidate is initialized to the correct values
    it("All the candidates are initialized with the right values", function(){
        return Election.deployed().then(function(instance){
            electionInstance = instance;
            return electionInstance.candidates(1);
        }).then(function(candidate){
            assert.equal(candidate[0],1, "contains the right id");
            assert.equal(candidate[1],"Steve","contains the right name");
            assert.equal(candidate[2],0,"contains the right vote count");
            return electionInstance.candidates(2);
        }).then(function(candidate){
            assert.equal(candidate[0],2, "contains the right id");
            assert.equal(candidate[1],"John","contains the right name");
            assert.equal(candidate[2],0,"contains the right vote count");
            return electionInstance.candidates(3);
        }).then(function(candidate){
            assert.equal(candidate[0],3, "contains the right id");
            assert.equal(candidate[1],"Heisenberg","contains the right name");
            assert.equal(candidate[2],0,"contains the right vote count");
        });
    });

    // test to check if a voter can vote and that the candidate's vote count is incremented
    it("The voter is allowed to vote", function(){
        return Election.deployed().then(function(instance){
            electionInstance = instance;
            candidateId = 1;
            return electionInstance.vote(candidateId,{ from: accounts[0] });
        }).then(function(receipt){
            return electionInstance.voters(accounts[0]);
        }).then(function(voted){
            assert(voted, "the voter's status was updated as voted");
            return electionInstance.candidates(candidateId);
        }).then(function(candidate){
            var voteCount = candidate[2];
            assert.equal(voteCount, 1, "increments the candidate's vote count");
        });
    });

    // test to check for invalid candidates
    it("Cannot vote for invalid candidates", function(){
        return Election.deployed().then(function(instance){
            electionInstance = instance;
            return electionInstance.vote(99, {from: accounts[1]})
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
            return electionInstance.candidates(1);
        }).then(function(candidate1){
            var voteCount = candidate1[2];
            assert.equal(voteCount, 1, "candidate 1 did not recieve any votes");
            return electionInstance.candidates(2);
        }).then(function(candidate2){
            var voteCount = candidate2[2];
            assert.equal(voteCount, 1, "candidate 2 did not recieve any votes");
            return electionInstance.candidates(3);
        }).then(function(candidate3){
            var voteCount = candidate3[2];
            assert.equal(voteCount, 1, "candidate 3 did not recieve any votes");
        });
    });

    // test to check for double voting
    it("A voter can't vote twice", function() {
        return Election.deployed().then(function(instance) {
          electionInstance = instance;
          candidateId = 2;
          electionInstance.vote(candidateId, { from: accounts[1] });
          return electionInstance.candidates(candidateId);
        }).then(function(candidate) {
          var voteCount = candidate[2];
          assert.equal(voteCount, 1, "accepts first vote");
          // Try to vote again
          return electionInstance.vote(candidateId, { from: accounts[1] });
        }).then(assert.fail).catch(function(error) {
          assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
          return electionInstance.candidates(1);
        }).then(function(candidate1) {
          var voteCount = candidate1[2];
          assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
          return electionInstance.candidates(2);
        }).then(function(candidate2) {
          var voteCount = candidate2[2];
          assert.equal(voteCount, 1, "candidate 2 did not receive any votes");
        });
      });
});