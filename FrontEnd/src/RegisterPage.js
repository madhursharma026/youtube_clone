import Header from './Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap';
import React, { useEffect, useState } from 'react'
import { BrowserRouter as Link, useHistory } from "react-router-dom"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()


function RegisterPage() {
    const history = useHistory()
    const [ChannelEmail, setChannelEmail] = useState("")
    const [ChannelName, setChannelName] = useState("")
    const [ChannelPassword, setChannelPassword] = useState("")
    const [ChannelConfirmPassword, setChannelConfirmPassword] = useState("")
    function sayAlert(Data) {
        toast(Data, { position: toast.POSITION.TOP_CENTER, autoClose: 1500 })
    }

    async function SignupSubmitForm(e) {
        e.preventDefault()
        let data = { ChannelEmail, ChannelName, ChannelPassword }
        if (ChannelPassword == ChannelConfirmPassword) {
            let result = await fetch("http://127.0.0.1:5000/sign-up", {
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
            if (user.message === "Account created!, You are now able to log in") {
                localStorage.clear()
                sayAlert("Account created!, You are now able to log in")
                history.push("/login_page")
            } else if (user.message === "Email already exists.") {
                localStorage.clear()
                sayAlert("Email already exists.")
            } else {
                localStorage.clear()
                sayAlert("Something went wrong")
            }
        } else {
            sayAlert("Password Does not match with earch other")
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
        <div className="RegisterPage">
            <title>Register- Youtube</title>
            <Header />
            <div className="scrollbox">
                <div className="container" style={{ paddingLeft: "15%", paddingRight: "15%" }}>
                    <h1 className="mb-3 text-center"><u>Join Today</u></h1>
                    <Form onSubmit={SignupSubmitForm}>
                        <Form.Group className="mb-3" controlId="ChannelEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="xyz123@gmail.com" name="ChannelEmail" required value={ChannelEmail} onChange={(e) => setChannelEmail(e.target.value)} autoComplete="off" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="ChannelName">
                            <Form.Label>Channel Name</Form.Label>
                            <Form.Control type="text" placeholder="Youtube Channel" name="ChannelName" required value={ChannelName} onChange={(e) => setChannelName(e.target.value)} autoComplete="off" maxLength='60' />
                        </Form.Group>
                        <Form.Group controlId="ChannelPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="ChannelPassword" required pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" value={ChannelPassword} onChange={(e) => setChannelPassword(e.target.value)} autoComplete="off" />
                        </Form.Group>
                        <Form.Text style={{ color: "rgb(153, 153, 153)" }}>
                            Must contain at least one number and UPPERCASE and lowercase letter, and at least 8 or more characters
                        </Form.Text>
                        <Form.Group className="mb-3 mt-3" controlId="ChannelConfirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" name="ChannelConfirmPassword" required pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" value={ChannelConfirmPassword} onChange={(e) => setChannelConfirmPassword(e.target.value)} autoComplete="off" />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100 mb-4">
                            Submit
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;




