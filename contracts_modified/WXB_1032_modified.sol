pragma solidity ^0.4.26;

contract Ownership { //ownership pattern
    address public owner;
    event LogOwnershipTransferred(address indexed previousOwner, address indexed newOwner);

     constructor() public {
        owner = msg.sender;
    }

     modifier condition(bool _condition) { //access restriction pattern
        require(_condition); 
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner condition(newOwner != address(0)) {
        //require(newOwner != address(0));
        emit LogOwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}

interface ERC20 {
function transferFrom(address _from, address _to, uint256 _value)
external returns (bool);
function transfer(address _to, uint256 _value)
external returns (bool);
function balanceOf(address _owner)
external constant returns (uint256);
function allowance(address _owner, address _spender)
external returns (uint256);
function approve(address _spender, uint256 _value)
external returns (bool);
event Approval(address indexed _owner, address indexed _spender, uint256  _val);
event Transfer(address indexed _from, address indexed _to, uint256 _val);
}

contract WXB is ERC20, Ownership {
uint256 public totalSupply;
uint public decimals;
string public symbol;
string public name;
mapping (address => mapping (address => uint256)) approach;
mapping (address => uint256) holders;

constructor() public {
    name = "Five currency";
    symbol = "WXB";
    decimals = 18;
    totalSupply =  100000 * 10000 * 100 * 10**uint(decimals);
    holders[msg.sender] = totalSupply;
}

function () public {
revert();
}

function balanceOf(address _own)
public view returns (uint256) {
return holders[_own];
}

function transfer(address _to, uint256 _val)
public returns (bool) {
require(holders[msg.sender] >= _val);
require(msg.sender != _to);
assert(_val <= holders[msg.sender]);
holders[msg.sender] = holders[msg.sender] - _val;
holders[_to] = holders[_to] + _val;
assert(holders[_to] >= _val);
emit Transfer(msg.sender, _to, _val);
return true;
}

function transferFrom(address _from, address _to, uint256 _val)
public returns (bool) {
require(holders[_from] >= _val);
require(approach[_from][msg.sender] >= _val);
assert(_val <= holders[_from]);
holders[_from] = holders[_from] - _val;
assert(_val <= approach[_from][msg.sender]);
approach[_from][msg.sender] = approach[_from][msg.sender] - _val;
holders[_to] = holders[_to] + _val;
assert(holders[_to] >= _val);
emit Transfer(_from, _to, _val);
return true;
}

function approve(address _spender, uint256 _val)
public returns (bool) {
require(holders[msg.sender] >= _val);
approach[msg.sender][_spender] = _val;
emit Approval(msg.sender, _spender, _val);
return true;
}

function allowance(address _owner, address _spender)
public view returns (uint256) {
return approach[_owner][_spender];
}
}