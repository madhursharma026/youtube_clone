import Header from './Header';
import { Link, useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()


function LoginPage() {
    const history = useHistory()
    const [LoginEmail, setLoginEmail] = useState("")
    const [LoginPassword, setLoginPassword] = useState("")
    function sayAlert(Data) {
        toast(Data, { position: toast.POSITION.TOP_CENTER, autoClose: 1500 })
    }

    async function LoginSubmitForm(e) {
        e.preventDefault()
        let data = { LoginEmail, LoginPassword }
        let result = await fetch("http://127.0.0.1:5000/sign-in", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
        result = await result.json()
        localStorage.setItem("user-info", JSON.stringify(result))
        const user = JSON.parse(localStorage.getItem("user-info"))
        if (user.id === "none") {
            sayAlert("Login Unsuccessful. Please contact company for more detail")
            localStorage.removeItem("user-info")
            setLoginPassword("")
        } else if (user.id === "Login Unsuccessful. Please check email and password") {
            sayAlert("Login Unsuccessful. Please check email and password")
            localStorage.removeItem("user-info")
            setLoginPassword("")
        } else if (user.id === "You are not register... please register") {
            sayAlert("You are not register... please register")
            localStorage.removeItem("user-info")
            setLoginPassword("")
            history.push("/register_page")
        } else {
            history.push("/")
        }
    }

    {
        useEffect(() => {
            if (localStorage.getItem("user-info")) {
                history.push("./")
            }
        })
    }

    return (
        <div className="LoginPage">
            <title>Login- Youtube</title>
            <Header />
            <div className="scrollbox">
                <div className="LoginPageBackground">
                    <div className="container" style={{ paddingLeft: "15%", paddingRight: "15%" }}>
                        <h1 className="text-center mt-4"><b><u>Login</u></b></h1>
                        <Form onSubmit={LoginSubmitForm}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="xyz123@gmail.com" name="LoginEmail" required value={LoginEmail} onChange={(e) => setLoginEmail(e.target.value)} autoComplete="off" />
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" name="LoginPassword" value={LoginPassword} required pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" onChange={(e) => setLoginPassword(e.target.value)} autoComplete="off" />
                            </Form.Group>
                            <Form.Text style={{ color: "rgb(153, 153, 153)" }}>
                                Must contain at least one number and UPPERCASE and lowercase letter, and at least 8 or more characters
                            </Form.Text>
                            <Button variant="primary" type="submit" className="w-100 mt-3 mb-4">
                                Submit
                            </Button>
                            <div className="text-center">
                                <Link to="/register_page" style={{ textDecoration: "none" }}>New to Flipkart? Create an account</Link>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;




