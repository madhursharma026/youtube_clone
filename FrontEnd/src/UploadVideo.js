import Header from './Header';
import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()


function UploadVideo() {
    const history = useHistory()
    const [VideoURL, setVideoURL] = useState()
    const [loading, setloading] = useState(false)
    const [VideoTitle, setVideoTitle] = useState("")
    const [VideoDescription, setVideoDescription] = useState("")
    const [VideoThumbnail, setVideoThumbnail] = useState()
    const [VideoCategoryList, setVideoCategoryList] = useState([])
    const [VideoCategoryId, setVideoCategoryId] = useState("0")
    const user = JSON.parse(localStorage.getItem("user-info"))
    function sayAlert(Data) {
        toast(Data, { position: toast.POSITION.TOP_CENTER, autoClose: 1500 })
    }

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/all_category`).then((result) => {
            result.json().then((resp) => {
                setVideoCategoryList(resp)
                setloading(true)
            })
        })
    }, [])

    async function UploadVideoForm(e) {
        e.preventDefault();
        setloading(false)
        let data = {
            VideoURL,
            VideoTitle,
            VideoDescription,
            VideoThumbnail,
            VideoCategoryId
        };
        let formdata = new FormData();
        formdata.append("UserId", user.id);
        formdata.append("VideoURL", VideoURL);
        formdata.append("VideoTitle", VideoTitle);
        formdata.append("VideoDescription", VideoDescription);
        formdata.append("VideoThumbnail", VideoThumbnail);
        formdata.append("VideoCategoryId", VideoCategoryId);
        let result = await fetch("http://127.0.0.1:5000/upload_video", {
            method: "POST",
            body: formdata
        });
        result = await result.json();
        localStorage.setItem("upload_video_result", JSON.stringify(result))
        const output = JSON.parse(localStorage.getItem("upload_video_result"));
        if (output.id !== "Execution Failed") {
            setloading(true)
            sayAlert("Video Added Successfully")
            setVideoURL("");
            setVideoTitle("");
            setVideoDescription();
            setVideoThumbnail("");
            setVideoCategoryId("");
            history.push("./");
        } else {
            sayAlert("Something goes wrong")
            localStorage.removeItem("output");
        }
    }


    {
        useEffect(() => {
            if (!user) {
                history.push("./")
            }
        })
    }

    return (
        <div className="UploadVideo">
            <title>Upload Video- Youtube</title>
            <Header />
            <div className="scrollbox">
                <div className="container-md" style={{ paddingLeft: "15%", paddingRight: "15%" }}>
                    {loading ?
                        <span>
                            <h1 className="text-center mt-4"><b><u>Video Detail</u></b></h1>
                            <Form onSubmit={UploadVideoForm}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Video URL</Form.Label>
                                    <Form.Control
                                        type="file"
                                        name="VideoURL"
                                        required
                                        onChange={(e) => setVideoURL(e.target.files[0])}
                                        accept=".mp4"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Video Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="VideoTitle"
                                        placeholder='Video Title'
                                        value={VideoTitle}
                                        required
                                        onChange={(e) => setVideoTitle(e.target.value)}
                                        autoComplete="off"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Video Description</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="VideoDescription"
                                        placeholder='Video Description'
                                        value={VideoDescription}
                                        required
                                        onChange={(e) => setVideoDescription(e.target.value)}
                                        autoComplete="off"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Video Thumbnail</Form.Label>
                                    <Form.Control
                                        type="file"
                                        name="VideoThumbnail"
                                        required
                                        onChange={(e) => setVideoThumbnail(e.target.files[0])}
                                        autoComplete="off"
                                        accept="image/png, image/jpg, image/jpeg"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Video Category</Form.Label>
                                    <select onChange={(e) => setVideoCategoryId(e.target.value)} value={VideoCategoryId} required style={{ width: "100%", fontSize: "20px" }}>
                                        {VideoCategoryList.map((videocategory, i) => {
                                            return (
                                                <option key={videocategory.id} value={i}>
                                                    {videocategory.category_name}
                                                </option>
                                            );
                                        })}
                                        ;
                                    </select>
                                </Form.Group>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="w-100 mt-3 mb-4"
                                >
                                    Submit
                                </Button>
                            </Form>
                        </span>
                        :
                        <div class="text-center loading_spinner" style={{ marginTop: "56px" }}>
                            <h3>Video Uploading...</h3>
                            <div class="spinner-border" role="status" style={{ marginTop: "150px" }}>
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div >
    );
}

export default UploadVideo;




