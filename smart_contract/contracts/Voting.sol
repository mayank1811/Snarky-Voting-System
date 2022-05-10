// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Voting{

    uint public voteCount = 0;
    uint public partyCount = 0;

    enum Status {notStarted, inProgress}
    Status electionStatus = Status.notStarted;

    struct Voter{
        bool isVoted;
        uint vote;
    }
    mapping(uint => Voter) public voters;

    struct Party{
        uint id;
        string name;
        uint voteCount;
    }
    Party[] public parties;

    address admin = 0xd81764e8563765259d1da8eC86C6e304d8CbAc1B;

    // MODIFIERS
    modifier onlyAdmin() {
        require(msg.sender == admin);
        _;
    }

    modifier isStatus(Status _expectedStatus){
        if(_expectedStatus == Status.notStarted){
            require(electionStatus == _expectedStatus, "Sorry, Voting is in progress.");
        }
        else{
            require(electionStatus == _expectedStatus, "Sorry, Voting has not started");
        }
        _;
    }

    // ADMIN ROLES
    function startElection() public onlyAdmin returns(Status){
        electionStatus = Status.inProgress;
        return electionStatus;
    }

    function endElection() public onlyAdmin returns(Status){
        electionStatus = Status.notStarted;
        return electionStatus;
    }

    function addParties(string memory name) isStatus(Status.notStarted) public onlyAdmin {
        incrementPartyCount();
        parties.push(Party(partyCount, name, 0));
    }


    // INTERNAL FUNCTIONS
    function incrementPartyCount() internal {
        partyCount++;
    }

    function incrementVoteCount() internal {
        voteCount++;
    }

    // VOTING FUNCTIONS
    function checkAdmin() public view returns(bool isAdmin){
        if(msg.sender == admin){
            isAdmin = true;
        }
        else{
            isAdmin = false;
        }
    }

    function vote(uint choice, uint UID) public isStatus(Status.inProgress) {
        require(voters[UID].isVoted == false, "You have already voted");
        require(choice < parties.length, "Please Enter Valid Party Choice");
        voters[UID].isVoted = true;
        incrementVoteCount();
        parties[choice].voteCount++;
    }

    function countMaxVotes() internal view returns(string memory winnerParty){
        uint maximum = 0;
        winnerParty = "DRAW";
        for(uint i = 0; i < parties.length; i++){
            if(parties[i].voteCount > maximum){
                maximum = parties[i].voteCount;
                winnerParty = parties[i].name;
            }
        } 
    }

    function getStatus() public view returns(Status) {
        return electionStatus;
    }

    function getVoteCount() public view returns(uint256){
        return voteCount;
    }

    function getParties() public view returns(Party[] memory){
        return parties;
    }

    function getWinnerParty() public isStatus(Status.notStarted) view returns(string memory winner){
        winner = countMaxVotes();
    }
}