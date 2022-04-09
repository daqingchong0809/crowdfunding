import styles from "./styles.module.scss";
import { Tabs } from "antd";
import { Button } from "antd";
const { TabPane } = Tabs;
export default function Header(props) {
  return (
    <div className={styles["header"]}>
      <div className={styles["header-left"]}>
        <Tabs defaultActiveKey="1" onChange={props.callback}>
          <TabPane tab="全部众筹" key="1"></TabPane>
          <TabPane tab="我的众筹" key="2"></TabPane>
        </Tabs>
      </div>
      <div className={styles["header-right"]}>
        <Button type="primary" onClick={props.handleAdd}>
          创建众筹
        </Button>
      </div>
    </div>
  );
}
