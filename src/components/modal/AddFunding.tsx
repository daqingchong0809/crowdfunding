import React from "react";
import { Modal, Form, Input, InputNumber, DatePicker, Button, Spin } from "antd";
export default function AddFunding(props) {
  const config = {
    rules: [{ type: "object" as const, required: true, message: "Please select time!" }],
  };
  return (
    <div>
      <Modal title="创建众筹" visible={props.newVisible} onCancel={props.handleAddCancel} footer={null}>
        <Spin tip="正在创建" spinning={props.addLoading}>
          <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={props.onFinish}
            onFinishFailed={props.onFinishAddFailed}
            autoComplete="off"
            form={props.AddForm}
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
            <Form.Item name="date-time-picker" label="结束时间" {...config}>
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" onChange={props.onchangeAddTime} />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button onClick={props.onAddReset} style={{ marginRight: "20px" }}>
                Reset
              </Button>
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
