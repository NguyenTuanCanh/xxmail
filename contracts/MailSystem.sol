//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;


contract MailSystem{

    struct Mail{

        address _from;
        address _to;
        string  _subject;
        string  _markdown;
        uint256 _timeStamp;
        bool    _read;

        bool    _onInbox;
        bool    _onStarred;
        bool    _onTrashed;
    }

    struct Mails{
        Mail[] _inbox;
        Mail[] _starred;
        Mail[] _sent;
        Mail[] _allMail;
        Mail[] _untrusted;
        Mail[] _trash;
    }

    mapping(address => Mails) users;
    mapping(address => uint256) uid;
    mapping(address => bool)   scam;

    function compose(
        address _to,string calldata _subject,string calldata _markdown
    )external{
        Mail memory _newMail = Mail(msg.sender,_to,_subject,_markdown,block.number,false,false,false,false);
        users[msg.sender]._sent.push(_newMail);
        users[_to]._inbox.push(_newMail);
    }

    function star(Mail calldata _mail) external {
        users[msg.sender]._starred.push(_mail);
    }
    
    function deleteMail(string calldata _key,uint256[] memory _indexes) external{
        require(_indexes.length >= 1,"INDEX NOT FOUND");
        if(keccak256(abi.encodePacked(_key)) == keccak256(abi.encodePacked("INBOX"))){
            for(uint256 i=0;i<_indexes.length;i++){

                uint256 _mailIndex = _indexes[i];
                uint256 sizeInbox  = users[msg.sender]._inbox.length;
                users[msg.sender]._trash.push(users[msg.sender]._inbox[_mailIndex]);
                users[msg.sender]._inbox[_mailIndex] = users[msg.sender]._inbox[sizeInbox -1];
                users[msg.sender]._inbox.pop();
            }
        }else if(keccak256(abi.encodePacked(_key)) == keccak256(abi.encodePacked("SENT"))){
            for(uint256 i=0;i<_indexes.length;i++){
                uint256 _mailIndex = _indexes[i];
                uint256 sizeSent   = users[msg.sender]._sent.length;
                users[msg.sender]._trash.push(users[msg.sender]._sent[_mailIndex]);
                users[msg.sender]._sent[_mailIndex] = users[msg.sender]._sent[sizeSent -1];
                users[msg.sender]._sent.pop();
            }
        }
        
    }   
    function inbox() external view returns(Mail[] memory){
        return users[msg.sender]._inbox;
    }
    function trash() external view returns(Mail[] memory){
        return users[msg.sender]._trash;
    }

    function sent() external view returns(Mail[] memory){
        return users[msg.sender]._sent;
    }
   
}