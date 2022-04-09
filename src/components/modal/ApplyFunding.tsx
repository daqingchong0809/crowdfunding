import React from "react";
import { Modal, Form, Input, InputNumber, Button, Spin } from "antd";
import { formatAmount } from "utils/formatData";

export default function ApplyFunding(props) {
  return (
    <div>
      <Modal
        title="参加众筹(ETH)"
        visible={props.applyVisible}
        onOk={props.handleApplyOk}
        onCancel={props.handleApplyCancel}
        footer={null}
      >
        <Spin tip="Loading..." spinning={props.applyLoading}>
          <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={props.onApplyFinish}
            onFinishFailed={props.onApplyFinishFailed}
            autoComplete="off"
            form={props.applyForm}
          >
            <Form.Item label="申请数量" name="applyNumber" rules={[{ required: true, message: "请输入申请数量" }]}>
              <InputNumber min={0} max={formatAmount(props.applyObject.raisedMoney)}></InputNumber>
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
