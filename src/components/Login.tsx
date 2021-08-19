import React, {useState} from 'react';
import {Form, Button, Input, Row, Col} from 'antd';
import {auth} from "../firebase";

export default function LoginScreen(props: any) {
    let [errorMessage, setErrorMessage] = useState(null);

    const handleLogin = (values: any) => {
        auth.signInWithEmailAndPassword(values.email, values.password)
            .then(() => props.history.push('/Admin'))
            .catch(error => setErrorMessage(error.message))
    };



        return (
            <>
            <a href="https://www.olafilter.com">
                <img src="namedlogo.png" style={{zIndex: 1000, position:"fixed", top:10, left:10, width:100, borderRadius:20}}/>
            </a>
            <Row justify="center" style={{paddingTop:50}}>
                <Col>
                    <Form
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        initialValues={{ remember: true }}
                        onFinish={handleLogin}
                        onFinishFailed={()=>console.log("Login Failed")}
                    >
                        <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'required' }]}
                        >
                        <Input />
                        </Form.Item>
                
                        <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'required' }]}
                        >
                        <Input.Password />
                        </Form.Item>
                        <div style={{color:"red"}}>{errorMessage}</div>
                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
            </>

        )
}
