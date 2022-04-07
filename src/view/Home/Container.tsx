import React, { useEffect, useState } from "react";
import { useCrowdFundingContract } from "request/contract//useContract";
import { useWeb3React } from "@web3-react/core";
import { calculateGasMargin, dateFormat, FormatsEnums, parseAmount, formatAmount } from "utils/formatData";
import styles from "./styles.module.scss";
import { Modal, Form, Input, Button, DatePicker, message, InputNumber, Table, Space, Spin } from "antd";
import BigNumber from "bignumber.js";

export declare type AlignType = "left" | "center" | "right";

export default function Container() {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      align: "center" as AlignType,
    },
    {
      title: "众筹标题",
      dataIndex: "title",
      key: "id",
      align: "center" as AlignType,
    },
    {
      title: "众筹内容",
      dataIndex: "content",
      key: "id",
      align: "center" as AlignType,
    },
    {
      title: "众筹目标(ETH)",
      dataIndex: "goalMoney",
      key: "id",
      align: "center" as AlignType,
      render: (
        text: any,
        record: { name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined },
      ) => <div>{formatAmount(Number(text))}</div>,
    },
    {
      title: "已筹集数量(ETH)",
      dataIndex: "raisedMoney",
      key: "id",
      align: "center" as AlignType,
      render: (
        text: any,
        record: { name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined },
      ) => <div>{formatAmount(Number(text))}</div>,
    },
    {
      title: "众筹人数",
      dataIndex: "fundersLength",
      key: "id",
      align: "center" as AlignType,
    },
    {
      title: "众筹状态",
      render: (
        text: any,
        record: { name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined },
      ) => <div style={{ color: text.isSuccess ? "#71D08C" : "red" }}>{text.isSuccess ? "已完成" : "未完成"}</div>,
      key: "id",
      align: "center" as AlignType,
    },
    {
      title: "申请人数",
      dataIndex: "proposalsLength",
      key: "id",
      align: "center" as AlignType,
    },
    {
      title: "截止时间",
      dataIndex: "deadline",
      key: "id",
      align: "center" as AlignType,
    },
    {
      title: " 操作",
      key: "id",
      align: "center" as AlignType,

      render: (
        text: any,
        record: { name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined },
      ) => (
        <Space size="middle">
          <div
            className={styles["container-table-join"]}
            onClick={() => {
              handleJoin(text);
            }}
          >
            参加
          </div>

          <div
            className={styles["container-table-apply"]}
            onClick={() => {
              handleApply(text);
            }}
          >
            申请
          </div>
        </Space>
      ),
    },
  ];

  const { account, library, chainId } = useWeb3React();
  const CrowdFundingInstance = useCrowdFundingContract();
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [isModalVisible3, setIsModalVisible3] = useState(false);
  const [time, setTime] = useState<number>(0);
  const [modalObject, setModalObject] = useState<any>({});
  const [allFundingsList, setAllFundingsList] = useState<any[]>([]);
  const [isLoading1, setIsLoading1] = useState(true);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isLoading3, setIsLoading3] = useState(false);
  const [isLoading4, setIsLoading4] = useState(false);

  const [fundId, setFundId] = useState();
  const config = {
    rules: [{ type: "object" as const, required: true, message: "Please select time!" }],
  };
  const showModal = () => {
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };
  const handleOk2 = () => {
    setIsModalVisible2(false);
  };
  const handleOk3 = () => {
    setIsModalVisible3(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleCancel2 = () => {
    setIsModalVisible2(false);
  };
  const handleCancel3 = () => {
    setIsModalVisible3(false);
  };
  const onFinish = async (values: any) => {
    let date = new Date().getTime();
    if (date >= time) {
      message.error("时间不是在未来");
      return;
    }
    setIsLoading2(true);
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
      let timeTake = 0;
      let timer = setInterval(() => {
        timeTake++;
        library
          .getTransactionReceipt(res.hash)
          .then((receipt: any) => {
            if (receipt) {
              console.log("交易成功");
              clearInterval(timer);
              setIsLoading2(false);
              setIsModalVisible(false);
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
    }
    //轮询交易是否成功
  };

  const onFinish2 = async (values: any) => {
    if (values.number <= 0) {
      message.error("不接受数量0");
      return;
    }
    setIsLoading3(true);
    // console.log(parseAmount(values.number.toString()));

    const gasPrice = await library.getGasPrice();
    const gasLimit = await CrowdFundingInstance.estimateGas.contribute(fundId, {
      from: account,
      value: parseAmount(values.number.toString()),
    });

    const res = await CrowdFundingInstance.contribute(fundId, {
      from: account,
      value: parseAmount(values.number.toString()),
      gasPrice: gasPrice,
      gasLimit: calculateGasMargin(gasLimit),
    });

    if (res.hash) {
      let timeTake = 0;
      let timer = setInterval(() => {
        timeTake++;
        library
          .getTransactionReceipt(res.hash)
          .then((receipt: any) => {
            if (receipt) {
              console.log("交易成功");
              clearInterval(timer);
              setIsLoading3(false);
              setIsModalVisible2(false);
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
    }
    //轮询交易是否成功
  };
  const onFinish3 = async (values: any) => {
    if (values.number <= 0) {
      message.error("不接受数量0");
      return;
    }
    setIsLoading4(true);
    const gasPrice = await library.getGasPrice();
    const gasLimit = await CrowdFundingInstance.estimateGas.createProposal(
      modalObject.id,
      values.reason,
      parseAmount(values.applyNumber.toString()),
    );
    const res = await CrowdFundingInstance.createProposal(
      modalObject.id,
      values.reason,
      parseAmount(values.applyNumber.toString()),
      {
        from: account,
        gasPrice: gasPrice,
        gasLimit: calculateGasMargin(gasLimit),
      },
    );

    if (res.hash) {
      let timeTake = 0;
      let timer = setInterval(() => {
        timeTake++;
        library
          .getTransactionReceipt(res.hash)
          .then((receipt: any) => {
            if (receipt) {
              setIsLoading4(false);
              setIsModalVisible3(false);
              clearInterval(timer);
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
    }
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  const onFinishFailed2 = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  const onFinishFailed3 = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  const onchangeTime = (date: any, dateString: any) => {
    let dateTime = 0;
    dateTime = new Date(dateString).getTime();
    setTime(dateTime);
  };
  const onReset = () => {
    form.resetFields();
  };

  useEffect(() => {
    if (account && chainId) {
      const initData = async () => {
        let allFundingLen = await CrowdFundingInstance.allFundingsLength();
        let arr = [];
        let id = 0;
        for (let index = 0; index < allFundingLen; index++) {
          const fundings = await CrowdFundingInstance.allFundings(index);
          arr.push({
            id: id++,
            title: fundings.title,
            content: fundings.content,
            deadline: dateFormat(Number(fundings.deadline._hex), FormatsEnums.YMDHIS),
            goalMoney: new BigNumber(fundings.goalMoney._hex).toString(),
            raisedMoney: new BigNumber(fundings.raisedMoney._hex).toString(),
            fundersLength: new BigNumber(fundings.fundersLength._hex).toString(),
            proposalsLength: new BigNumber(fundings.proposalsLength._hex).toString(),

            isSuccess: fundings.isSuccess,
          });
        }

        setAllFundingsList([...arr]);
        setIsLoading1(false);
      };

      initData();
    }
  }, [account, chainId, CrowdFundingInstance]);
  const handleJoin = (text: any) => {
    setIsLoading3(false);

    setFundId(text.id);
    setIsModalVisible2(true);
    form2.resetFields();
  };
  const handleApply = (text: any) => {
    setIsLoading4(false);

    setModalObject({ ...modalObject, ...text });
    setIsModalVisible3(true);
    form3.resetFields();
  };
  return (
    <div className={styles["container"]}>
      <div className={styles["container-header"]}>
        <div className={styles["container-header-add"]} onClick={showModal}>
          新增众筹
        </div>
      </div>

      <div className={styles["container-table"]}>
        <Spin tip="Loading..." spinning={isLoading1}>
          <Table columns={columns} dataSource={allFundingsList} rowKey="id" bordered />
        </Spin>
      </div>
      <Modal title="新增众筹" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null}>
        <Spin tip="Loading..." spinning={isLoading2}>
          <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            form={form}
          >
            <Form.Item label="标题" name="title" rules={[{ required: true, message: "请输入标题" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="众筹描述" name="content" rules={[{ required: true, message: "请输入众筹描述" }]}>
              <Input.TextArea />
            </Form.Item>
            <Form.Item label="众筹目标" name="goal" rules={[{ required: true, message: "请输入众筹目标" }]}>
              <InputNumber min={1} max={10}></InputNumber>
            </Form.Item>
            <Form.Item name="date-time-picker" label="DatePicker" {...config}>
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" onChange={onchangeTime} />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button onClick={onReset} style={{ marginRight: "20px" }}>
                Reset
              </Button>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>

      <Modal title="参加众筹(ETH)" visible={isModalVisible2} onOk={handleOk2} onCancel={handleCancel2} footer={null}>
        <Spin tip="Loading..." spinning={isLoading3}>
          <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish2}
            onFinishFailed={onFinishFailed2}
            autoComplete="off"
            form={form2}
          >
            <Form.Item label="发送数量" name="number" rules={[{ required: true, message: "请输入数量" }]}>
              <InputNumber min={0} max={10}></InputNumber>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>

      <Modal title="申请资金" visible={isModalVisible3} onOk={handleOk3} onCancel={handleCancel3} footer={null}>
        <Spin tip="Loading..." spinning={isLoading4}>
          <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish3}
            onFinishFailed={onFinishFailed3}
            autoComplete="off"
            form={form3}
          >
            <Form.Item label="申请数量" name="applyNumber" rules={[{ required: true, message: "请输入申请数量" }]}>
              <InputNumber min={0} max={formatAmount(modalObject.raisedMoney)}></InputNumber>
            </Form.Item>
            <Form.Item label="申请理由" name="reason" rules={[{ required: true, message: "请输入申请理由" }]}>
              <Input.TextArea />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
}
