import React, { useEffect, useState } from "react";
import { useCrowdFundingContract } from "request/contract//useContract";
import { useWeb3React } from "@web3-react/core";
import { calculateGasMargin, dateFormat, FormatsEnums } from "utils/formatData";
import styles from "./styles.module.scss";
import { Modal, Form, Input, Button, DatePicker, message, InputNumber, Table, Space } from "antd";
import BigNumber from "bignumber.js";
export declare type AlignType = "left" | "center" | "right";
const columns = [
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
  },
  {
    title: "已筹集数量(ETH)",
    dataIndex: "raisedMoney",
    key: "id",
    align: "center" as AlignType,
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
        <div className={styles["container-table-join"]}>参加 {record.name}</div>
      </Space>
    ),
  },
];
const edit = (record: Object) => {
  console.log(record);
};

export default function Container() {
  const { account, library, chainId } = useWeb3React();

  const CrowdFundingInstance = useCrowdFundingContract();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [time, setTime] = useState<number>(0);
  const [allFundingsList, setAllFundingsList] = useState<any[]>([]);

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

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const onFinish = async (values: any) => {
    let date = new Date().getTime();
    if (date >= time) {
      message.error("时间不是在未来");
      return;
    }
    const gasPrice = await library.getGasPrice();
    const gasLimit = await CrowdFundingInstance.estimateGas.createFunding(
      account,
      values.title,
      values.content,
      values.goal,
      time,
    );
    const res = await CrowdFundingInstance.createFunding(account, values.title, values.content, values.goal, time, {
      gasLimit: calculateGasMargin(gasLimit),
      gasPrice: gasPrice,
      from: account,
    });

    //轮询交易状态
    if (res.hash) {
      let timeTake = 0;
      let timer = setInterval(() => {
        timeTake++;
        library.getTransactionReceipt(res.hash).then((receipt: any) => {
          if (receipt) {
            console.log("交易成功");
            clearInterval(timer);
          } else {
            clearInterval(timer);
            console.log("交易失败");
          }
        });
        if (timeTake > 20) {
          console.log("轮训hash超时");
          clearInterval(timer);
        }
      }, 1000);
    }
    //轮询交易是否成功
  };

  const onFinishFailed = (errorInfo: any) => {
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
          console.log(222, fundings);

          arr.push({
            id: id++,
            title: fundings.title,
            content: fundings.content,
            deadline: dateFormat(Number(fundings.deadline._hex), FormatsEnums.YMDHIS),
            goalMoney: new BigNumber(fundings.goalMoney._hex).toString(),
            raisedMoney: new BigNumber(fundings.raisedMoney._hex).toString(),
            fundersLength: new BigNumber(fundings.fundersLength._hex).toString(),

            isSuccess: fundings.isSuccess,
          });
        }

        setAllFundingsList([...arr]);
      };

      initData();
    }
  }, [account, chainId, CrowdFundingInstance]);
  return (
    <div className={styles["container"]}>
      <div className={styles["container-header"]}>
        <div className={styles["container-header-add"]} onClick={showModal}>
          新增众筹
        </div>
      </div>

      <div className={styles["container-table"]}>
        <Table columns={columns} dataSource={allFundingsList} rowKey="id" bordered />
      </div>
      <Modal title="新增众筹" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null}>
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
        >
          <Form.Item label="Title" name="title" rules={[{ required: true, message: "Please input your title!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Content" name="content" rules={[{ required: true, message: "Please input your content!" }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Goal" name="goal" rules={[{ required: true, message: "Please input your goal!" }]}>
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
      </Modal>
    </div>
  );
}
