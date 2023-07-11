import {Card} from "antd";
import ErrorBoundary from "antd/es/alert/ErrorBoundary.js";
import {RobotFilled, RobotOutlined} from "@ant-design/icons";

export default function () {
    return <div style={
        {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f0f2f5'
        }
    }>
     <Card title="404" style={{ width: 300 }}>
            <p>Page not found <RobotFilled style={
                {
                    fontSize: 30,
                    marginLeft: 10
                }
            }/> </p>
      </Card>
    </div>
}
