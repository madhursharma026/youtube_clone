import Header from './Header';
import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap';
import { BrowserRouter as Link, useHistory } from "react-router-dom"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()



function EditChannel() {
    const history = useHistory()
    const [loading, setloading] = useState(false)
    let user = JSON.parse(localStorage.getItem("user-info"))

    const [ChannelProfileImage, setChannelProfileImage] = useState(user.profile_image)
    const [ChannelCoverImage, setChannelCoverImage] = useState(user.cover_image)
    const [ChannelNameNew, setChannelNameNew] = useState(user.Channel_name)
    const [ChannelEmailNew, setChannelEmailNew] = useState(user.email)
    function sayAlert(Data) {
        toast(Data, { position: toast.POSITION.TOP_CENTER, autoClose: 1500 })
    }
    async function UpdateProfileForm(e) {
        e.preventDefault();
        let data = {
            ChannelProfileImage,
            ChannelCoverImage,
            ChannelNameNew
        };
        let CurrentUserId = user.id
        let formdata = new FormData();
        formdata.append("CurrentUserId", CurrentUserId);
        formdata.append("ChannelProfileImage", ChannelProfileImage);
        formdata.append("ChannelCoverImage", ChannelCoverImage);
        formdata.append("ChannelNameNew", ChannelNameNew);
        let result = await fetch("http://127.0.0.1:5000/manage_profile", {
            method: "POST",
            body: formdata
        });
        result = await result.json();
        localStorage.removeItem("update_result")
        localStorage.setItem("user-info", JSON.stringify(result))
        user = JSON.parse(localStorage.getItem("user-info"))
        setloading(true)
        sayAlert("Profile Update Successfully")
        setChannelProfileImage("");
        setChannelCoverImage("");
        setChannelNameNew();
        setChannelEmailNew("");
        history.push("./manage_channell")

    }

    {
        useEffect(() => {
            if (!user) {
                history.push("./")
            }
        })
    }

    return (
        <div>
            <title>Edit Channel {user.Channel_name}- Youtube</title>
            <Header />
            <div className="EditChannel">
                <div className="form_for_update_profile container" style={{ paddingLeft: "15%", paddingRight: "15%" }}>
                    <div className="container-md data-contain">
                        <h1 className="text-center mt-4 mb-5"><b><u>Account Info</u></b></h1>
                        <div className="text-center"
                            style={{ background: `url(${user.cover_image})`, backgroundRepeat: "no-repeat", backgroundAttachment: "cover", backgroundSize: "100% 75%" }}>
                            <img src={user.profile_image} alt="" width="200" height="200"
                                style={{ marginTop: "22%", borderRadius: "100%", border: "5px solid white" }} />
                        </div>
                        <Form onSubmit={UpdateProfileForm}>
                            <Form.Group className="mb-3">
                                <Form.Label>Channel Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="ChannelEmail"
                                    placeholder="youtube123@gmail.com"
                                    defaultValue={user.email}
                                    required
                                    onChange={(e) => setChannelEmailNew(e.target.value)}
                                    autoComplete="off" disabled
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Group className="mb-3">
                                    <Form.Label>Channel Profile</Form.Label>
                                    <Form.Control
                                        type="file"
                                        onChange={(e) => setChannelProfileImage(e.target.files[0])}
                                        accept="image/png, image/gif, image/jpeg"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Channel Cover Image</Form.Label>
                                    <Form.Control
                                        type="file"
                                        onChange={(e) => setChannelCoverImage(e.target.files[0])}
                                        accept="image/png, image/gif, image/jpeg"
                                    />
                                </Form.Group>
                                <Form.Label>Channel Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Channel Name"
                                    name="ChannelNameNew"
                                    required
                                    defaultValue={user.Channel_name}
                                    onChange={(e) => setChannelNameNew(e.target.value)}
                                    autoComplete="off"
                                    maxLength="60"
                                />
                            </Form.Group>
                            <Button
                                variant="primary"
                                type="submit"
                                className="w-100 mt-3 mb-4"
                            >
                                Submit
                            </Button>
                        </Form>
                    </div>
                </div>
            </div >
        </div>
    );
}

export default EditChannel;


