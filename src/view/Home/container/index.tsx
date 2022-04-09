import { useState, useCallback, useEffect } from "react";
import styles from "./styles.module.scss";
import Header from "./Header";
import TableList from "./AllTable";
import AddModal from "components/modal/AddFunding";
import ApplyModal from "components/modal/ApplyFunding";
import JoinModal from "components/modal/JoinFunding";
import { useCrowdFundingContract } from "request/contract//useContract";
import { message, Form } from "antd";
import { useWeb3React } from "@web3-react/core";
import { calculateGasMargin, dateFormat, FormatsEnums, parseAmount, formatAmount } from "utils/formatData";
import BigNumber from "bignumber.js";

export default function Container() {
  const [newVisible, setNewVisible] = useState(false);
  const [applyVisible, setApplyVisible] = useState(false);
  const [joinVisible, setJoinVisible] = useState(false);

  const [AddForm] = Form.useForm();
  const [applyForm] = Form.useForm();
  const [joinForm] = Form.useForm();

  const [time, setTime] = useState<number>(0);
  const [addLoading, setAddLoading] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);

  const [AlltableLoading, setAlltableLoading] = useState(false);
  const CrowdFundingInstance = useCrowdFundingContract();
  const [allFundingsList, setAllFundingsList] = useState([]);
  const { account, library, chainId } = useWeb3React();
  const [modalObject, setModalObject] = useState({});
  const callback = (key) => {
    console.log(key);
  };
  const handleAdd = () => {
    setNewVisible(true);
    onAddReset();
  };
  const handleAddCancel = () => {
    setNewVisible(false);
  };
  const handleApplyOk = () => {
    setApplyVisible(false);
  };
  const handleJoinOk = () => {
    setJoinVisible(false);
  };
  const handleApplyCancel = () => {
    setApplyVisible(false);
  };
  const handleJoinCancel = () => {
    setJoinVisible(false);
  };

  const onApplyFinish = async (values) => {
    let obj: any = modalObject;
    if (values.number <= 0) {
      message.error("不接受数量0");
      return;
    }
    setApplyLoading(true);
    const gasPrice = await library.getGasPrice();
    const gasLimit = await CrowdFundingInstance.estimateGas.createProposal(
      obj.id,
      values.reason,
      parseAmount(values.applyNumber.toString()),
    );
    const res = await CrowdFundingInstance.createProposal(
      obj.id,
      values.reason,
      parseAmount(values.applyNumber.toString()),
      {
        from: account,
        gasPrice: gasPrice,
        gasLimit: calculateGasMargin(gasLimit),
      },
    );
    if (res.hash) {
      getReceipt(res.hash);
    }
  };
  const onJoinFinish = async (values) => {
    setJoinLoading(true);
    let obj: any = modalObject;
    const gasPrice = await library.getGasPrice();
    const gasLimit = await CrowdFundingInstance.estimateGas.contribute(obj.id, {
      from: account,
      value: parseAmount(values.number.toString()),
    });

    const res = await CrowdFundingInstance.contribute(obj.id, {
      from: account,
      value: parseAmount(values.number.toString()),
      gasPrice: gasPrice,
      gasLimit: calculateGasMargin(gasLimit),
    });
    if (res.hash) {
      getReceipt(res.hash);
    }
  };
  const onApplyFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  };
  const onJoinFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  };
  const handleApply = (text: any) => {
    setModalObject(text);

    setApplyLoading(false);
    applyForm.resetFields();
    setApplyVisible(true);
  };
  const handleJoin = (text: any) => {
    setJoinLoading(false);
    setModalObject(text);

    setJoinVisible(true);
    joinForm.resetFields();
  };
  const onchangeAddTime = (date: any, dateString: any) => {
    let dateTime = 0;
    dateTime = new Date(dateString).getTime();
    setTime(dateTime);
  };
  const initData = useCallback(async () => {
    try {
      setAlltableLoading(true);
      let len = await CrowdFundingInstance.allFundingsLength();

      let arrLen = Number(new BigNumber(len._hex).toString());
      let allFundingLen = new Array(...new Array(arrLen).keys());

      let queue = allFundingLen.map((index) => {
        return CrowdFundingInstance.allFundings(index);
      });
      Promise.all(queue).then((res: any) => {
        let newArr: any[] = [];
        let id = 0;
        for (let i = 0; i < res.length; i++) {
          newArr.push({
            id: id++,
            title: res[i].title,
            content: res[i].content,
            deadline: dateFormat(Number(res[i].deadline._hex), FormatsEnums.YMDHIS),
            goalMoney: new BigNumber(res[i].goalMoney._hex).toString(),
            raisedMoney: new BigNumber(res[i].raisedMoney._hex).toString(),
            fundersLength: new BigNumber(res[i].fundersLength._hex).toString(),
            proposalsLength: new BigNumber(res[i].proposalsLength._hex).toString(),
            isSuccess: res[i].isSuccess,
          });
        }

        setAllFundingsList([...newArr]);
        setAlltableLoading(false);
      });
    } catch (error) {
      // setIsLoading1(true);
      setAllFundingsList([]);
    }
  }, [CrowdFundingInstance]);
  useEffect(() => {
    initData();
  }, [account, chainId, CrowdFundingInstance, initData]);
  const onFinish = async (values: any) => {
    let date = new Date().getTime();
    if (date >= time) {
      message.error("时间不是在未来");
      return;
    }
    setAddLoading(true);
    const gasPrice = await library.getGasPrice();
    const gasLimit = await CrowdFundingInstance.estimateGas.createFunding(
      account,
      values.title,
      values.content,
      parseAmount(values.goal.toString()),
      time,
    );
    const res = await CrowdFundingInstance.createFunding(
      account,
      values.title,
      values.content,
      parseAmount(values.goal.toString()),
      time,
      {
        gasLimit: calculateGasMargin(gasLimit),
        gasPrice: gasPrice,
        from: account,
      },
    );

    //轮询交易状态
    if (res.hash) {
      getReceipt(res.hash);
    }
  };
  const onFinishAddFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  const onAddReset = () => {
    AddForm.resetFields();
  };
  const getReceipt = (hash) => {
    let timeTake = 0;
    let timer = setInterval(() => {
      timeTake++;
      library
        .getTransactionReceipt(hash)
        .then((receipt: any) => {
          if (receipt) {
            initData();

            console.log("交易成功");
            clearInterval(timer);
            setAddLoading(false);
            setNewVisible(false);
            setApplyLoading(false);
            setApplyVisible(false);
            setJoinVisible(false);
            setJoinLoading(false);
          }
        })
        .catch((err: any) => {
          if (err) clearInterval(timer);
        });
      if (timeTake > 20) {
        console.log("轮训hash超时");
        clearInterval(timer);
      }
    }, 1000);
  };
  return (
    <div className={styles["container"]}>
      <Header callback={callback} handleAdd={handleAdd}></Header>
      <TableList
        AlltableLoading={AlltableLoading}
        allFundingsList={allFundingsList}
        handleJoin={handleJoin}
        handleApply={handleApply}
      ></TableList>
      <AddModal
        newVisible={newVisible}
        handleAddCancel={handleAddCancel}
        onFinish={onFinish}
        onFinishAddFailed={onFinishAddFailed}
        AddForm={AddForm}
        onAddReset={onAddReset}
        onchangeAddTime={onchangeAddTime}
        addLoading={addLoading}
      ></AddModal>
      <ApplyModal
        applyVisible={applyVisible}
        handleApplyOk={handleApplyOk}
        handleApplyCancel={handleApplyCancel}
        applyForm={applyForm}
        onApplyFinish={onApplyFinish}
        onApplyFinishFailed={onApplyFinishFailed}
        applyLoading={applyLoading}
        applyObject={modalObject}
      ></ApplyModal>
      <JoinModal
        onJoinFinish={onJoinFinish}
        onJoinFinishFailed={onJoinFinishFailed}
        joinForm={joinForm}
        joinLoading={joinLoading}
        joinVisible={joinVisible}
        handleJoinOk={handleJoinOk}
        handleJoinCancel={handleJoinCancel}
      ></JoinModal>
    </div>
  );
}
