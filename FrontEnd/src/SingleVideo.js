import Header from './Header';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';


function SingleVideo() {

    const SingleVideoId = localStorage.getItem('SingleVideoId');
    const [CommentValue, setCommentValue] = useState("")
    const [SubscribeResult, setSubscribeResult] = useState("")
    const [Videoloading, setVideoloading] = useState(false)
    const [VideoCommentloading, setVideoCommentloading] = useState(false)
    const [SameCategoryloading, setSameCategoryloading] = useState(false)
    const [ReactionResult, setReactionResult] = useState("")
    const [SingleVideoDetail, setSingleVideoDetail] = useState([])
    const [SingleVideoCommentDetail, setSingleVideoCommentDetail] = useState([])
    const [SameCategoryVideoDetail, setSameCategoryVideoDetail] = useState([])
    const user = JSON.parse(localStorage.getItem("user-info"))
    const ChannelId = JSON.parse(localStorage.getItem("ChannelId"))

    async function CommentSubmitForm(e) {
        e.preventDefault()
        setVideoCommentloading(false)
        let current_user_id = user.id
        let data = { current_user_id, CommentValue }
        let result = await fetch(`http://127.0.0.1:5000/video/${SingleVideoId}/comment`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
        result = await result.json()
        localStorage.setItem("comment_output", JSON.stringify(result))
        const comment_output = JSON.parse(localStorage.getItem("comment_output"));
        setCommentValue("")
        fetch(`http://127.0.0.1:5000/single_video_comment_data/${SingleVideoId}`).then((result) => {
            result.json().then((resp) => {
                setSingleVideoCommentDetail(resp)
                setVideoCommentloading(true)
            })
        })
    }

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/single_video_data/${SingleVideoId}`).then((result) => {
            result.json().then((resp) => {
                setSingleVideoDetail(resp)
                setVideoloading(true)
            })
        })
        fetch(`http://127.0.0.1:5000/single_video_comment_data/${SingleVideoId}`).then((result) => {
            result.json().then((resp) => {
                setSingleVideoCommentDetail(resp)
                setVideoCommentloading(true)
            })
        })
        fetch(`http://127.0.0.1:5000/single_video_same_category_video/${SingleVideoId}`).then((result) => {
            result.json().then((resp) => {
                setSameCategoryVideoDetail(resp)
                setSameCategoryloading(true)
            })
        })
        if (user) {
            fetch(`http://127.0.0.1:5000/single_video_reaction/${user.id}/${SingleVideoId}`).then((result) => {
                result.json().then((resp) => {
                    if (resp.message === "1") {
                        setReactionResult("1")
                    } else if (resp.message === "2") {
                        setReactionResult("2")
                    } else {
                        setReactionResult("0")
                    }
                })
            })
        }
        if (user) {
            fetch(`http://127.0.0.1:5000/checking_subscriber_with_video_id/${SingleVideoId}/${user.id}`).then((result) => {
                result.json().then((resp) => {
                    if (resp.message === "active") {
                        setSubscribeResult("active")
                    } else {
                        setSubscribeResult("NoneType")
                    }
                })
            })
        }
    }, [])

    async function AddLike(VideoId) {
        let CurrentUserId = user.id
        let data = { CurrentUserId, CommentValue }
        let result = await fetch(`http://127.0.0.1:5000/like/${VideoId}`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
        result = await result.json()
        localStorage.setItem("like_output", JSON.stringify(result))
        const like_output = JSON.parse(localStorage.getItem("like_output"));
        fetch(`http://127.0.0.1:5000/single_video_reaction/${user.id}/${SingleVideoId}`).then((result) => {
            result.json().then((resp) => {
                if (resp.message === "1") {
                    setReactionResult("1")
                } else if (resp.message === "2") {
                    setReactionResult("2")
                } else {
                    setReactionResult("0")
                }
            })
        })
    }

    async function Dislike(VideoId) {
        let CurrentUserId = user.id
        let data = { CurrentUserId, CommentValue }
        let result = await fetch(`http://127.0.0.1:5000/dislike/${VideoId}`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
        result = await result.json()
        localStorage.setItem("like_output", JSON.stringify(result))
        const like_output = JSON.parse(localStorage.getItem("like_output"));
        fetch(`http://127.0.0.1:5000/single_video_reaction/${user.id}/${SingleVideoId}`).then((result) => {
            result.json().then((resp) => {
                if (resp.message === "1") {
                    setReactionResult("1")
                } else if (resp.message === "2") {
                    setReactionResult("2")
                } else {
                    setReactionResult("0")
                }
            })
        })
    }

    async function AddSubscriber(other_channel_id) {
        let current_user_id = user.id
        let data = { current_user_id }
        let result = await fetch(`http://127.0.0.1:5000/subscribe/user_id/${other_channel_id}`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
        result = await result.json()
        localStorage.setItem("subscribe_output", JSON.stringify(result))
        const subscribe_output = JSON.parse(localStorage.getItem("subscribe_output"));
        fetch(`http://127.0.0.1:5000//checking_subscriber_with_video_id/${SingleVideoId}/${user.id}`).then((result) => {
            result.json().then((resp) => {
                if (resp.message === "active") {
                    setSubscribeResult("active")
                } else {
                    setSubscribeResult("NoneType")
                }
            })
        })
    }

    async function make_video_history() {
        let current_user_id = user.id
        let data = { current_user_id, SingleVideoId }
        let result = await fetch(`http://127.0.0.1:5000/add_to_history`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
        result = await result.json()
    }

    {
        useEffect(() => {
            if (user) {
                make_video_history()
            }
        }, [])
    }

    const setSameCategoryVideoId = value => () => localStorage.setItem('SameCategoryVideoId', value)
    const setChannelId = value => () => localStorage.setItem('ChannelId', value)

    return (
        <div className="SingleVideo">
            <Header />
            <div className="set_container single_video_page pt-1">
                <div className="row">
                    <div className="col-lg-8">
                        {Videoloading ?
                            <>
                                {
                                    SingleVideoDetail.map((SingleVideoDetail, i) =>
                                        <>
                                            <title>{SingleVideoDetail.video_title}- Youtube</title>
                                            <video id="my-video" className="video-js vjs-default-skin vjs-big-play-centered main_video" controls autoPlay
                                                preload="auto" poster={SingleVideoDetail.video_thumbnail} data-setup="{}"
                                                style={{ width: '100%', maxHeight: "700px" }}>
                                                <source src={SingleVideoDetail.video_url}
                                                    type="video/mp4" />
                                            </video>
                                            <br />
                                            <br />
                                            <div className="single_video_title" style={{ fontSize: "20px" }}>
                                                {SingleVideoDetail.video_title}
                                            </div>
                                            <div className="row">
                                                <div className="col-sm views_and_date">
                                                    <div className="views_and_date_data mt-2 heading" style={{ fontSize: "14px" }}>
                                                        {SingleVideoDetail.views} views • {SingleVideoDetail.upload_date}
                                                    </div>
                                                </div>
                                                {/* agar user login hua toh */}
                                                {user ?
                                                    <div className="col-sm like_dislike_share_btn">
                                                        <div className="like_dislike_share_btn_data">
                                                            {ReactionResult === "1" ?
                                                                <i className="fa fa-thumbs-up like_yes" onClick={() => AddLike(SingleVideoDetail.id)} style={{ cursor: "pointer", fontSize: "24px" }}></i>
                                                                :
                                                                <i className="fa fa-thumbs-up like_no" onClick={() => AddLike(SingleVideoDetail.id)} style={{ cursor: "pointer", fontSize: "24px" }}></i>
                                                            }
                                                            {ReactionResult === "2" ?
                                                                <i className="fa fa-thumbs-down mx-3 dislike_yes" onClick={() => Dislike(SingleVideoDetail.id)} style={{ cursor: "pointer", fontSize: "24px" }}></i>
                                                                :
                                                                <i className="fa fa-thumbs-down mx-3 dislike_no" onClick={() => Dislike(SingleVideoDetail.id)} style={{ cursor: "pointer", fontSize: "24px" }}></i>
                                                            }
                                                            {ReactionResult === "NoneType" ?
                                                                <>
                                                                    <i className="fa fa-thumbs-up like_no" onClick={() => AddLike(SingleVideoDetail.id)} style={{ cursor: "pointer", fontSize: "24px" }}></i>
                                                                    <i className="fa fa-thumbs-down mx-3 dislike_no" onClick={() => Dislike(SingleVideoDetail.id)} style={{ cursor: "pointer", fontSize: "24px" }}></i>
                                                                </>
                                                                :
                                                                <></>
                                                            }
                                                            <Link to="#share" style={{ fontSize: '24px', textDecoration: "none" }} className='share_btn_text'><i className="fa fa-mail-forward share_btn"></i><span style={{ fontSize: "15px" }}><b> SHARE</b>&emsp;</span></Link>
                                                        </div>
                                                    </div>
                                                    :
                                                    <></>
                                                }
                                                {/*  */}
                                            </div>
                                            <br />
                                            <hr />
                                            <div className="channel_info">
                                                <div className="left_side_info">
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <div className="row">
                                                                <div className="col-3 col-md-2">
                                                                    <img src={SingleVideoDetail.single_video_creator_profile}
                                                                        height="40" width="40" alt="#" />
                                                                </div>
                                                                <div className="col-9 col-md-10">
                                                                    <Link className='single_video_creator' style={{ textDecoration: "none" }} to={{ pathname: `/user_channel/${SingleVideoDetail.single_video_creator_id}`, id: SingleVideoDetail.single_video_creator_id, }} onClick={setChannelId(SingleVideoDetail.single_video_creator_id)} title={SingleVideoDetail.single_video_creator_channel_name}>
                                                                        <p title={SingleVideoDetail.creator} style={{ fontSize: "15px" }}><b>{SingleVideoDetail.creator}</b></p>
                                                                    </Link>
                                                                    <p style={{ fontSize: "13px", marginTop: "-18px" }} className='single_video_channel_subscribers'>
                                                                        {SingleVideoDetail.single_video_creator_subscribers} Subscribers</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-6" style={{ textAlign: "right" }}>
                                                            {
                                                                user ?
                                                                    <>
                                                                        {(user.id === SingleVideoDetail.single_video_creator_id) ?
                                                                            <Link to="/manage_channel" className='btn btn-success' style={{ fontWeight: "500" }}>Manage Channel</Link>
                                                                            :
                                                                            <button className="btn btn-danger" style={{ fontWeight: "500" }} onClick={() => AddSubscriber(SingleVideoDetail.creator_id)}>
                                                                                {(SubscribeResult === "active") ?
                                                                                    <>SUBSCRIBED</>
                                                                                    :
                                                                                    <>SUBSCRIBE</>
                                                                                }
                                                                            </button>
                                                                        }
                                                                    </>
                                                                    :
                                                                    <></>
                                                            }
                                                        </div>
                                                        <div className="col-md-11 offset-1 single_video_description">
                                                            {SingleVideoDetail.video_description}
                                                        </div>
                                                    </div>
                                                    <hr />
                                                    <div className="comment">
                                                        <h5 className="total_comment">{SingleVideoCommentDetail.length} Comment</h5>
                                                        {/* agar user login hai toh */}
                                                        {user ?
                                                            <div className="row">
                                                                <div className="col-2 col-md-1">
                                                                    <img src={user.profile_image} height="40"
                                                                        width="40" alt="#" />
                                                                </div>
                                                                <div className="col-10">
                                                                    <Form onSubmit={CommentSubmitForm}>
                                                                        <Form.Control type="text" name="CommentValue" value={CommentValue} required onChange={(e) => setCommentValue(e.target.value)} autoComplete="off" />
                                                                        <Form.Text style={{ color: "rgb(153, 153, 153)" }}>
                                                                            Enter To Submit Comment
                                                                        </Form.Text>
                                                                    </Form>
                                                                </div>
                                                            </div>
                                                            :
                                                            <></>
                                                        }
                                                        {/*  */}
                                                        {VideoCommentloading ?
                                                            <>
                                                                {(SingleVideoCommentDetail.length >= 1) ?
                                                                    <>
                                                                        <br />
                                                                        <div className="row">
                                                                            {
                                                                                SingleVideoCommentDetail.map((SingleVideoCommentDetail, i) =>
                                                                                    <>
                                                                                        <div className="col-2 col-md-1">
                                                                                            <img src={SingleVideoCommentDetail.profile_image} height="40" width="40"
                                                                                                alt="#" />
                                                                                        </div>
                                                                                        <div className="col-10 col-md-11">
                                                                                            <p style={{ fontSize: "15px" }} className='single_video_comment_date'><b className='single_video_comment_channel'> {SingleVideoCommentDetail.channel_name}</b> {SingleVideoCommentDetail.comment_date}</p>
                                                                                            <p style={{ fontSize: "17px", marginTop: "-18px" }} className='single_video_comment'>{SingleVideoCommentDetail.comment}</p>
                                                                                        </div>
                                                                                    </>
                                                                                )
                                                                            }
                                                                        </div>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <br />
                                                                    </>
                                                                }
                                                            </>
                                                            :
                                                            <div class="text-center loading_spinner">
                                                                <h3>Loading Comments...</h3>
                                                                <div class="spinner-border" role="status" style={{ marginBottom: "50px" }}>
                                                                    <span class="visually-hidden">Loading...</span>
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )
                                }
                            </>
                            :
                            <div class="text-center loading_spinner" style={{ marginTop: "56px" }}>
                                <div class="spinner-border" role="status" style={{ marginTop: "150px" }}>
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        }
                    </div>

                    <div className="col-lg-4 pt-2">
                        <div className="row">
                            {SameCategoryloading ?
                                <>
                                    {
                                        SameCategoryVideoDetail.map((SameCategoryVideoDetail, i) =>
                                            <>
                                                <div className="col-5 col-md-4 col-lg-7 col-xl-6 mb-1">
                                                    <Link style={{ textDecoration: "none" }} to={{ pathname: `/single_videos/${SameCategoryVideoDetail.id}`, id: SameCategoryVideoDetail.id, }} onClick={setSameCategoryVideoId(SameCategoryVideoDetail.id)}>
                                                        <img src={SameCategoryVideoDetail.video_thumbnail} alt='#' style={{ width: "100%", height: "120px" }} />
                                                    </Link>
                                                </div>
                                                <div className="col-7 col-md-8 col-lg-5 col-xl-6">
                                                    <p style={{ fontWeight: "500", lineHeight: "15px" }} className="single_video_related_title">{SameCategoryVideoDetail.video_title}</p>
                                                    <p className="single_video_related_creator" title={SameCategoryVideoDetail.channel_name}
                                                        style={{ fontSize: "15px", marginTop: "-7px", lineHeight: "15px" }}>
                                                        <b>{SameCategoryVideoDetail.creator}</b>
                                                        <p className="single_video_related_date"
                                                            style={{ fontSize: "14px" }}>
                                                            {SameCategoryVideoDetail.views} views •<br className='br_after_119px' /> {SameCategoryVideoDetail.upload_date}</p>
                                                    </p>
                                                </div>
                                            </>
                                        )
                                    }
                                </>
                                :
                                <div class="text-center loading_spinner" style={{ marginTop: "25px", marginBottom: "25px" }}>
                                    <h3 style={{ marginTop: "100px" }}>Loading Similar Videos...</h3>
                                    <div class="spinner-border" role="status" style={{ marginBottom: "100px" }}>
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SingleVideo;





