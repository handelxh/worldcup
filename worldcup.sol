pragma solidity ^0.4.18;


/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {

  /**
  * @dev Multiplies two numbers, throws on overflow.
  */
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    if (a == 0) {
      return 0;
    }
    uint256 c = a * b;
    assert(c / a == b);
    return c;
  }

  /**
  * @dev Integer division of two numbers, truncating the quotient.
  */
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return c;
  }

  /**
  * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  /**
  * @dev Adds two numbers, throws on overflow.
  */
  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }
}

  /**
  * 
  */
contract team {

      struct Team {
      uint id;
      uint isKnockout;
      uint isChampion;
      uint supports;
  }
  Team[] public teams;
  function team() public{
      for (uint i = 1; i <= 32; i++) {
        teams.push(Team({
          id:i,
          isKnockout:0,
          isChampion:0,
          supports:0
        }));
      }
  }
}

contract WorldCup is  team{
  using SafeMath for uint256;
  uint256 private count_of_fans;
  uint256 private value_tick;
  uint256 private balance;
  uint256 private Champion_id;
  uint256 private isEND;
  uint256 private isPayFee;
  address public owner;

  address get_fee_addr;
  struct Fan{
    uint256 fan_id;
    uint256 inited;
    uint256 reward;

  }
  struct Fan_detail{
    uint256 support_team_id;
    uint256 ticks;
  }
  mapping(address => Fan) private fan;
  mapping(uint256 => Fan_detail) private fan_detail;

  function WorldCup() public{
    owner = msg.sender;
    count_of_fans = 0;
    balance = 0;
    value_tick = 100000000000000;
    Champion_id = 0;
    isEND = 0;
    isPayFee = 0;
    get_fee_addr = 0xdd870fa1b7c4700f2bd7f44238821c26f7392148;  // need modify !!!!!!!!!!!!!!
  }
  function init_fan() public{
    require(isEND == 0);
    require(fan[msg.sender].inited == 0);
    fan[msg.sender].reward = 0;
    fan[msg.sender].fan_id = count_of_fans;
    fan_detail[fan[msg.sender].fan_id].support_team_id = 0;
    fan_detail[fan[msg.sender].fan_id].ticks = 0;
    fan[msg.sender].inited = 1;
    count_of_fans= count_of_fans+1;
  }

  function support_team(uint256 _support_team) public  payable {
    uint256 _value;
    require(isEND == 0);
    require(msg.value >= value_tick);
    require(fan[msg.sender].inited == 1);
    require (_support_team > 0);

    fan_detail[fan[msg.sender].fan_id].support_team_id = _support_team;
    balance = balance + msg.value;
    _value = msg.value;
    fan_detail[fan[msg.sender].fan_id].ticks = _value.div(value_tick);
    teams[_support_team].supports = teams[_support_team].supports.add(fan_detail[fan[msg.sender].fan_id].ticks);
  }

  function ref_result(uint256 Champion_team)public payable {
    require(msg.sender == owner);
    Champion_id = Champion_team;
    isEND = 1;
    if (isPayFee == 0) {
      get_fee_addr.transfer(balance.div(100));
      isPayFee = 1;
      balance = balance - balance.div(100);
    }
  }
  function get_reward()public payable {
    require(Champion_id != 0);
    require(fan[msg.sender].inited == 1);
    require(fan_detail[fan[msg.sender].fan_id].support_team_id == Champion_id );
    require(teams[Champion_id].supports != 0);
    fan[msg.sender].reward = (balance.mul(fan_detail[fan[msg.sender].fan_id].ticks)).div(teams[Champion_id].supports);
    balance = balance - fan[msg.sender].reward;
    msg.sender.transfer(fan[msg.sender].reward);
    fan[msg.sender].inited = 0;
  }

}
