import React from "react";
import { Modal, Form, Input, InputNumber, Button, Spin } from "antd";

export default function JoinFunding(props) {
  return (
    <div>
      <Modal
        title="参加众筹(ETH)"
        visible={props.joinVisible}
        onOk={props.handleJoinOk}
        onCancel={props.handleJoinCancel}
        footer={null}
      >
        <Spin tip="Loading..." spinning={props.joinLoading}>
          <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={props.onJoinFinish}
            onFinishFailed={props.onJoinFinishFailed}
            autoComplete="off"
            form={props.joinForm}
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
    </div>
  );
}
