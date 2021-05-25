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
});