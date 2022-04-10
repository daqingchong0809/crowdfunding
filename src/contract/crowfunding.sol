// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract CrowdFunding {
    struct Funding {
        address payable initiator; //众筹项目发起者
        string title; //标题
        string content; //内容
        uint256 goalMoney; //目标金额
        uint256 raisedMoney; //已筹集金额
        uint256 usedMoney; //已使用金额
        uint256 deadline; //众筹项目截止日期
        bool isSuccess; //是否筹集成功
        uint256 fundersLength; //投资人数量
        uint256 proposalsLength; //申请使用资金的次数
        mapping(uint256 => Funder) funders; //投资者
        mapping(uint256 => Proposal) proposals; //申请使用资金的记录
    }

    // 投资者信息
    struct Funder {
        address payable add; //投资者地址
        uint256 cost; //投资者的投资金额
    }

    uint256 public allFundingsLength; //众筹项目的总数量
    mapping(uint256 => Funding) public allFundings; //所有众筹项目的map

    //申请使用资金的记录
    struct Proposal {
        string content; //申请说明
        uint256 amount; //申请金额
        uint256 agreeAmount; //持同意态度的投资者的金额之和
        uint256 disAmount; //持反对态度的投资者的金额之和
        uint256 goal; //可以转账的最低金额，数值上等于amount的一半
        mapping(uint256 => uint256) states; // 出资人是否同意 0: 还没决定，1：同意，2：不同意
        bool isAgreed; //是否通过
    }

    //投资项目的函数
    function contribute(uint256 _fundId) public payable {
        require(msg.value > 0);
        require(block.timestamp <= allFundings[_fundId].deadline);
        Funding storage funding = allFundings[_fundId];
        uint256 funderNum = funding.fundersLength + 1;
        funding.fundersLength += 1;
        Funder storage funder = funding.funders[funderNum];
        funder.add = payable(msg.sender);
        funder.cost = msg.value;
        funding.raisedMoney += msg.value;
        if (funding.raisedMoney >= funding.goalMoney) funding.isSuccess = true;
    }

    //创建众筹项目的函数
    function createFunding(
        address payable _initiator,
        string memory _title,
        string memory _content,
        uint256 _goalMoney,
        uint256 _remainingtime
    ) public returns (uint256) {
        uint256 num = allFundingsLength;
        allFundingsLength += 1;
        Funding storage funding = allFundings[num];
        funding.initiator = _initiator;
        funding.title = _title;
        funding.content = _content;
        funding.goalMoney = _goalMoney;
        funding.raisedMoney = 0;
        funding.deadline = _remainingtime;
        return num;
    }

    //创建申请资金的记录
    function createProposal(
        uint256 _fundId,
        string memory _content,
        uint256 _amount
    ) public {
        Funding storage funding = allFundings[_fundId];
        require(funding.initiator == msg.sender);
        uint256 proNum = funding.proposalsLength + 1;
        funding.proposalsLength += 1;
        Proposal storage proposal = funding.proposals[proNum];
        proposal.content = _content;
        proposal.amount = _amount;
        proposal.goal = funding.raisedMoney / 2;
    }

    //审批申请的函数
    function agreeProposal(
        uint256 _fundId,
        uint256 _proposalId,
        bool _isAgree
    ) public funderOfFunding(_fundId) {
        Funding storage funding = allFundings[_fundId];
        require(_proposalId >= 1 && _fundId <= funding.proposalsLength);
        Proposal storage proposal = funding.proposals[_proposalId];
        for (uint256 i = 1; i <= funding.fundersLength; i++) {
            Funder memory funder = funding.funders[i];
            if (funder.add == msg.sender) {
                if (_isAgree) {
                    proposal.states[i] = 1;
                    proposal.agreeAmount += funder.cost;
                } else {
                    proposal.states[i] = 2;
                    proposal.disAmount += funder.cost;
                }
            }
        }
        if (proposal.agreeAmount >= proposal.goal) {
            proposal.isAgreed = true;
            funding.initiator.transfer(proposal.amount);
            funding.usedMoney += proposal.amount;
        } else if (proposal.disAmount >= proposal.goal) {
            proposal.isAgreed = false;
        }
    }

    //获取的申请记录
    function getProposal(uint256 _fundId, uint256 _proposalId)
        public
        view
        returns (
            string memory,
            uint256,
            uint256,
            uint256,
            uint256,
            bool
        )
    {
        require(_fundId >= 0 && _fundId <= allFundingsLength);
        Funding storage funding = allFundings[_fundId];
        require(_proposalId >= 1 && _fundId <= funding.proposalsLength);
        Proposal storage proposal = funding.proposals[_proposalId];
        return (
            proposal.content,
            proposal.amount,
            proposal.agreeAmount,
            proposal.disAmount,
            proposal.goal,
            proposal.isAgreed
        );
    }

    //获取申请记录的数量
    function getProposalsLength(uint256 _fundId) public view returns (uint256) {
        return allFundings[_fundId].proposalsLength;
    }

    //获取合约地址的剩余资金
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    //make sure the funder is in this funding
    modifier funderOfFunding(uint256 _fundId) {
        require(_fundId >= 0 && _fundId <= allFundingsLength);
        Funding storage funding = allFundings[_fundId];
        bool isIn = false;
        for (uint256 i = 1; i <= funding.fundersLength; i++) {
            Funder memory funder = funding.funders[i];
            if (funder.add == msg.sender) isIn = true;
        }
        require(isIn == true);
        _;
    }

    function getMyFundings(uint256 _fundId) public view returns (uint256) {
        uint256 money = 0;
        Funding storage funding = allFundings[_fundId];
        for (uint256 j = 1; j <= funding.fundersLength; j++) {
            Funder memory funder = funding.funders[j];
            if (funder.add == msg.sender) money += funder.cost;
        }
        return money;
    }

    function getMyInitFundings(uint256 _fundId) public view returns (bool) {
        return (allFundings[_fundId].initiator == msg.sender ? true : false);
    }

    // function getAllFundingsList() public returns(Funding [] memory){
    //     return allFundingsList;
    // }

    // function getBalance() public view returns (uint) {
    //     return address(this).balance;
    // }
}
