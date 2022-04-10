import React from "react";
import { Button, Table, Spin, Space } from "antd";
import styles from "./styles.module.scss";
export declare type AlignType = "left" | "center" | "right";
export default function Proposal(props) {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      align: "center" as AlignType,
    },
    {
      title: "申请理由",
      dataIndex: "content",
      key: "id",
      align: "center" as AlignType,
    },
    {
      title: "申请数量(ETH)",
      dataIndex: "amount",
      key: "id",
      align: "center" as AlignType,
    },
    {
      title: "通过人数",
      dataIndex: "agreeAmount",
      key: "id",
      align: "center" as AlignType,
    },
    {
      title: "拒绝人数",
      dataIndex: "disAmount",
      key: "id",
      align: "center" as AlignType,
    },
    {
      title: "最低金额",
      dataIndex: "goal",
      key: "id",
      align: "center" as AlignType,
    },
    {
      title: " 状态",
      key: "id",
      align: "center" as AlignType,
      render: (
        text: any,
        record: { name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined },
      ) => <div className={styles["proposal-status"]}>{text.isAgreed ? "同意" : "未同意"}</div>,
    },
  ];

  return (
    <div>
      <Button onClick={props.handleDetails} type="primary">
        返回
      </Button>
      <Table columns={columns} dataSource={props.proposal} rowKey="id" bordered style={{ marginTop: "20px" }} />
    </div>
  );
}
