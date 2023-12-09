//SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
//Hello  fffHelllo GUY
import "hardhat/console.sol";

contract AVAXGods {

    struct Mail {

        address _from;
        address _to;
        string  _subject;
        string  _markdown;
        uint256 _timeStamp;
        uint256 _index  ;
        uint256 _idx  ;

        bool    _inbox  ;
        bool    _starred;
        bool    _archive;
        bool    _sent   ;
        bool    _read   ;
        bool    _spam   ;
        bool    _trash  ;
        bool    _unTracked;
        bool    _isTop;
        address _sender;

    }

    mapping(address => mapping(uint=>Mail[]))  replies;
    mapping(address => Mail[])  public mails;
    mapping(address => uint256) uid;
    mapping(address => bool)    scam;
    mapping(address => uint)    indexTrack;
    mapping(address => uint)    idxTrack;
    mapping(address => Mail[]) sentMails;

    function compose(address _to,string calldata _subject,string calldata _markdown, uint256 time) external{

        uint256 index = indexTrack[msg.sender];
        uint256 idx = indexTrack[_to];

        Mail memory _fromMail = Mail(
            msg.sender,_to,_subject,_markdown,time,index,idx,false,false,false,false,false,false,false,false,false, msg.sender
        );
        Mail memory _toMail = Mail(
            _to,msg.sender,_subject,_markdown,time,idx,index,false,false,false,false,false,false,false,false,false, msg.sender
        );

        _fromMail._sent = true;
        _toMail._inbox = true;

        mails[msg.sender].push(_fromMail);
        mails[_to].push(_toMail);

        indexTrack[msg.sender] ++;
        indexTrack[_to] ++;
    }

    function move(string calldata _to,uint256[] memory _indexes) external {
        
            
            if(keccak256(abi.encodePacked(_to)) == keccak256(abi.encodePacked("STAR"))){
                uint256 size = _indexes.length;
                for(uint256 i=0;i<size;i++){
                    uint position = _indexes[i];
                    mails[msg.sender][position]._starred = !mails[msg.sender][position]._starred;
                }

            }
            else if(keccak256(abi.encodePacked(_to)) == keccak256(abi.encodePacked("ARCHIVE"))){
                uint256 size = _indexes.length;
                for(uint256 i=0;i<size;++i){
                    uint index = _indexes[i];
                    mails[msg.sender][index]._inbox   = false;
                    mails[msg.sender][index]._spam    = false;
                    mails[msg.sender][index]._archive = !mails[msg.sender][index]._archive;
                }
            }
            else if(keccak256(abi.encodePacked(_to)) == keccak256(abi.encodePacked("SPAM"))){
                uint256 size = _indexes.length;
                for(uint256 i=0;i<size;++i){
                    uint index = _indexes[i];
                    mails[msg.sender][index]._inbox   = false;
                    mails[msg.sender][index]._archive = false;
                    mails[msg.sender][index]._spam    = !mails[msg.sender][index]._spam;
                }
            }
            else if(keccak256(abi.encodePacked(_to)) == keccak256(abi.encodePacked("READ"))){
                uint256 size = _indexes.length;
                for(uint256 i=0;i<size;++i){
                    uint index = _indexes[i];
                    mails[msg.sender][index]._read    = !mails[msg.sender][index]._read;

                }
            }
            else if(keccak256(abi.encodePacked(_to)) == keccak256(abi.encodePacked("TRASH"))){
                uint256 size = _indexes.length;
                for(uint256 i=0;i<size;++i){
                    uint index = _indexes[i];
                    mails[msg.sender][index]._inbox   = false;

                    if(mails[msg.sender][index]._trash == false){
                        mails[msg.sender][index]._trash   = true;
                    }else{
                        mails[msg.sender][index]._trash   = true;
                        mails[msg.sender][index]._unTracked = true;
                    }
                }
            }
            
        
    }

    function reply(uint256 _index,address _to,string calldata _subject,string calldata _markdown, address _from, uint256 time, uint256 idx) external{
        Mail memory _fromMail = Mail(
            msg.sender,_to,_subject,_markdown,time,_index,idx,false,false,false,false,false,false,false,false, false, msg.sender
        );
        Mail memory _toMail = Mail(
            _to,msg.sender,_subject,_markdown,time,idx,_index,false,false,false,false,false,false,false,false, false, msg.sender
        );

        if(mails[_to][idx]._trash == true) {
            _toMail._inbox = true;
            mails[_to][idx] = _toMail;

            replies[_to][idx] = new Mail[](0);
            replies[_from][_index].push(_fromMail);
        } else if(mails[_to][idx]._sent == true) {
            mails[_to][idx]._sent = false;
            mails[_to][idx]._inbox = true;
            mails[_to][idx]._subject = _fromMail._subject;
            mails[_to][idx]._read = false;

            replies[_from][_index].push(_fromMail);
            replies[_to][idx].push(_toMail);
            mails[_from][_index]._timeStamp = time;
            mails[_to][idx]._timeStamp = time;
        } else if(mails[_to][idx]._read == true) {
            mails[_to][idx]._read = false;

            replies[_from][_index].push(_fromMail);
            replies[_to][idx].push(_toMail);
            mails[_from][_index]._timeStamp = time;
            mails[_to][idx]._timeStamp = time;
        } else {
            replies[_from][_index].push(_fromMail);
            replies[_to][idx].push(_toMail);
            mails[_from][_index]._timeStamp = time;
            mails[_to][idx]._timeStamp = time;
        }
    }

    function getReply(address _address, uint256 index) external view returns(Mail[] memory){
        return replies[_address][index];
    }

    function forward(address _to,string calldata _subject,string calldata _markdown,uint256 _index, uint256 time, uint256 idx) external returns(Mail[] memory){

        uint256 indexx = indexTrack[msg.sender];
        uint256 idxx = indexTrack[_to];
        

        Mail memory _fromMail = Mail(
            msg.sender,_to,_subject,_markdown,time,indexx,idxx,false,false,false,false,false,false,false,false,false, msg.sender
        );
        Mail memory _toMail = Mail(
            _to,msg.sender,_subject,_markdown,time,idxx,indexx,false,false,false,false,false,false,false,false,false, msg.sender
        );

        _fromMail._sent = true;
        _toMail._inbox = true;

        mails[msg.sender].push(_fromMail);
        mails[_to].push(_toMail);

        if(replies[msg.sender][_index].length > 0){
            uint256 _len = replies[msg.sender][_index].length;
            for(uint256 i=0;i<_len;++i){
                replies[msg.sender][indexx].push(replies[msg.sender][_index][i]);
                replies[_to][idxx].push(replies[msg.sender][_index][i]);
            }
        }

        indexTrack[msg.sender] ++;
        indexTrack[_to] ++;

        return replies[msg.sender][_index];
    }

    function inbox()   external view returns(Mail[] memory){
        
        Mail[] storage _mails = mails[msg.sender];
        uint size = _mails.length;
        uint validSize = 0;

        // Count the number of valid elements
        for (uint i = 0; i < size; i++) {
            if (_mails[i]._inbox && _mails[i]._timeStamp != 0 
                && _mails[i]._unTracked == false &&
                   _mails[i]._archive   == false &&
                   _mails[i]._spam      == false &&
                   _mails[i]._trash     == false &&
                   _mails[i]._sent      == false 

            ) {
                validSize++;
            }
        }

        Mail[] memory data = new Mail[](validSize);

        // Add only the valid elements to the data array
        uint j = 0;
        for (uint i = 0; i < size; i++) {
            if (_mails[i]._inbox && _mails[i]._timeStamp != 0 
                && _mails[i]._unTracked == false &&
                   _mails[i]._archive   == false &&
                   _mails[i]._spam      == false &&
                   _mails[i]._trash     == false &&
                   _mails[i]._sent      == false 
            ) {
                data[j] = _mails[i];
                j++;
            }
        }

        return data;
    }

    function sent() external view returns (Mail[] memory) {
        Mail[] storage _mails = mails[msg.sender];
        uint size = _mails.length;
        uint validSize = 0;

        // Count the number of valid elements
        for (uint i = 0; i < size; i++) {
            if (_mails[i]._sent && _mails[i]._timeStamp != 0 
                && _mails[i]._unTracked == false &&
                   _mails[i]._archive   == false &&
                   _mails[i]._spam      == false &&
                   _mails[i]._trash     == false &&
                   _mails[i]._inbox      == false 

            ) {
                validSize++;
            }
        }

        Mail[] memory data = new Mail[](validSize);

        // Add only the valid elements to the data array
        uint j = 0;
        for (uint i = 0; i < size; i++) {
            if (_mails[i]._sent && _mails[i]._timeStamp != 0 
                && _mails[i]._unTracked == false &&
                   _mails[i]._archive   == false &&
                   _mails[i]._spam      == false &&
                   _mails[i]._trash     == false &&
                   _mails[i]._inbox      == false 
            ) {
                data[j] = _mails[i];
                j++;
            }
        }

        return data;
    }

    function archive() external view returns(Mail[] memory){
        
        Mail[] storage _mails = mails[msg.sender];
        uint size = _mails.length;
        uint validSize = 0;

        // Count the number of valid elements
        for (uint i = 0; i < size; i++) {
            if (_mails[i]._archive && _mails[i]._timeStamp != 0 && 
                _mails[i]._unTracked == false &&
                _mails[i]._inbox     == false &&
                _mails[i]._spam      == false &&
                _mails[i]._trash     == false 

            ) {
                validSize++;
            }
        }

        Mail[] memory data = new Mail[](validSize);

        // Add only the valid elements to the data array
        uint j = 0;
        for (uint i = 0; i < size; i++) {
            if (_mails[i]._archive && _mails[i]._timeStamp != 0 && 
                _mails[i]._unTracked == false &&
                _mails[i]._inbox     == false &&
                _mails[i]._spam      == false &&
                _mails[i]._trash     == false 
            ) {
                data[j] = _mails[i];
                j++;
            }
        }

        return data;
    }

    function star()    external view returns(Mail[] memory){
        
        Mail[] storage _mails = mails[msg.sender];
        uint size = _mails.length;
        uint validSize = 0;

        // Count the number of valid elements
        for (uint i = 0; i < size; i++) {
            if (_mails[i]._starred && _mails[i]._timeStamp != 0 && _mails[i]._unTracked == false) {
                validSize++;
            }
        }

        Mail[] memory data = new Mail[](validSize);

        // Add only the valid elements to the data array
        uint j = 0;
        for (uint i = 0; i < size; i++) {
            if (_mails[i]._starred && _mails[i]._timeStamp != 0 && _mails[i]._unTracked == false) {
                data[j] = _mails[i];
                j++;
            }
        }

        return data;
    }
    
    function spam()    external view returns(Mail[] memory){
        
        Mail[] storage _mails = mails[msg.sender];
        uint size = _mails.length;
        uint validSize = 0;

        // Count the number of valid elements
        for (uint i = 0; i < size; i++) {
            if (_mails[i]._spam && _mails[i]._timeStamp != 0 && 
                _mails[i]._unTracked == false &&
                _mails[i]._inbox     == false &&
                _mails[i]._archive   == false &&
                _mails[i]._trash     == false 

            ) {
                validSize++;
            }
        }

        Mail[] memory data = new Mail[](validSize);

        // Add only the valid elements to the data array
        uint j = 0;
        for (uint i = 0; i < size; i++) {
            if (_mails[i]._spam && _mails[i]._timeStamp != 0 && 
                _mails[i]._unTracked == false &&
                _mails[i]._inbox     == false &&
                _mails[i]._archive   == false &&
                _mails[i]._trash     == false 
            ) {
                data[j] = _mails[i];
                j++;
            }
        }

        return data;
    }

    function trash()   external view returns(Mail[] memory){
        
        Mail[] storage _mails = mails[msg.sender];
        uint size = _mails.length;
        uint validSize = 0;

        // Count the number of valid elements
        for (uint i = 0; i < size; i++) {
            if (_mails[i]._trash && _mails[i]._timeStamp != 0 && 
                _mails[i]._unTracked == false &&
                _mails[i]._inbox     == false &&
                _mails[i]._archive   == false &&
                _mails[i]._spam     == false 
            ) {
                validSize++;
            }
        }

        Mail[] memory data = new Mail[](validSize);

        // Add only the valid elements to the data array
        uint j = 0;
        for (uint i = 0; i < size; i++) {
            if (_mails[i]._trash && _mails[i]._timeStamp != 0 && 
                _mails[i]._unTracked == false &&
                _mails[i]._inbox     == false &&
                _mails[i]._archive   == false &&
                _mails[i]._spam     == false 
            ) {
                data[j] = _mails[i];
                j++;
            }
        }

        return data;
    }

    function chain()   external view returns(Mail[] memory){
        return mails[msg.sender];
    }

}
