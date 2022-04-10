import React from "react";
import { Table, Spin, Space } from "antd";
import { formatAmount } from "utils/formatData";
import styles from "./styles.module.scss";
import Proposal from "./Proposal";
export declare type AlignType = "left" | "center" | "right";

export default function MyTable(props) {
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
            className={styles["alltable-apply"]}
            onClick={() => {
              props.handleDetails(text);
            }}
          >
            详情
          </div>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {!props.isDetail ? (
        <Table columns={columns} dataSource={props.myFundingsList} rowKey="id" bordered />
      ) : (
        <Proposal handleDetails={props.handleDetails} proposal={props.proposal}></Proposal>
      )}
    </div>
  );
}
