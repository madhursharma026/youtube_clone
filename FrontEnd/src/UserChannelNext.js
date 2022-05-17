import Header from './Header';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react'


function UserChannel() {
    const [loading, setloading] = useState(false)
    const [SubscribeResult, setSubscribeResult] = useState("")
    const [UserDetails, setUserDetails] = useState([])
    const [UserVideos, setUserVideos] = useState([])
    const [MySubscribers, setMySubscribers] = useState([])
    const user = JSON.parse(localStorage.getItem("user-info"))
    const ChannelId = JSON.parse(localStorage.getItem("ChannelId"))

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/channel_details/${ChannelId}`).then((result) => {
            result.json().then((resp) => {
                setUserDetails(resp)
            })
        })
        fetch(`http://127.0.0.1:5000/channel_video_details/${ChannelId}`).then((result) => {
            result.json().then((resp) => {
                setUserVideos(resp)
            })
        })
        if (user) {
            fetch(`http://127.0.0.1:5000/checking_subscriber/${ChannelId}/${user.id}`).then((result) => {
                result.json().then((resp) => {
                    if (resp.message === "active") {
                        setSubscribeResult("active")
                    } else {
                        setSubscribeResult("NoneType")
                    }
                    setloading(true)
                })
            })
        } else {
            setloading(true)
        }
    }, [])

    function getting_user_subscribers() {
        fetch(`http://127.0.0.1:5000/getting_user_subscribers/${user.id}`).then((result) => {
            result.json().then((resp) => {
                setMySubscribers(resp)
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
        fetch(`http://127.0.0.1:5000/checking_subscriber/${ChannelId}/${user.id}`).then((result) => {
            result.json().then((resp) => {
                if (resp.message === "active") {
                    setSubscribeResult("active")
                } else {
                    setSubscribeResult("NoneType")
                }
            })
        })
    }

    {
        useEffect(() => {
            if (user) {
                getting_user_subscribers()
            }
        }, [])
    }

    const setSingleVideoId = value => () => localStorage.setItem('SingleVideoId', value)
    const setChannelId = value => () => localStorage.setItem('ChannelId', value)

    return (
        <div className="Homepage">
            <Header />
            <div className='homepage_content'>
                <div className="row">
                    <div className="col-md-2 left_sidebar">
                        {/* left sidebar before lg scrn */}
                        <div className="left_sidebar_before_lg" style={{ position: "fixed", width: "16.20%" }}>
                            <div className="scrollbox_left">
                                <Link to="/"
                                    style={{ textDecoration: "none", borderRadius: "10px", display: "block" }}
                                    className="left_menu_1 pt-2 pb-2 px-2" title="Home">&nbsp;&nbsp;<span style={{ paddingLeft: "10px" }}><i
                                        className="fa fa-home" style={{ fontSize: "26px" }}></i>&emsp; Home</span> </Link>
                                <Link to="#explore"
                                    style={{ textDecoration: "none", borderRadius: "10px", display: "block" }}
                                    className="left_menu_1 pt-2 pb-2 px-2" title="Explore">&nbsp;&nbsp;<span
                                        style={{ paddingLeft: "10px" }}><i className="fa fa-compass" style={{ fontSize: "24px" }}></i>&emsp;
                                        Explore</span> </Link>
                                {
                                    user ?
                                        <Link to="#subscription"
                                            style={{ textDecoration: "none", borderRadius: "10px", display: "block" }}
                                            className="left_menu_1 pt-2 pb-2 px-2" title="Subscriptions">&nbsp;&nbsp;<span
                                                style={{ paddingLeft: "10px" }}><i className="fa fa-youtube-play"
                                                    style={{ fontSize: "24px" }}></i>&emsp;
                                                Subscriptions</span> </Link>
                                        :
                                        <></>
                                }
                                <hr />
                                {
                                    !user ?
                                        <>
                                            <div className='text-center'>
                                                <Link className="btn btn-primary" to="/login_page" role="button">Sign In</Link>
                                            </div>
                                            <hr />
                                        </>
                                        :
                                        <>
                                            <Link to="#library" style={{ textDecoration: "none", borderRadius: "10px", display: "block" }}
                                                className="left_menu_1 pt-2 pb-2 px-2" title="Library">&nbsp;&nbsp;<span
                                                    style={{ paddingLeft: "10px" }}><i className="fa fa-caret-square-o-right"
                                                        style={{ fontSize: "24px" }}></i>&emsp; Library</span>
                                            </Link>
                                            <Link to="/history" style={{ textDecoration: "none", borderRadius: "10px", display: "block" }}
                                                className="left_menu_1 pt-2 pb-2 px-2" title="History">&nbsp;&nbsp;<span
                                                    style={{ paddingLeft: "10px" }}><i className="fa fa-clock-o" style={{ fontSize: "24px" }}></i>&emsp;
                                                    History</span> </Link>
                                            <Link to="#mychannel"
                                                style={{ textDecoration: "none", borderRadius: "10px", display: "block" }}
                                                className="left_menu_1 pt-2 pb-2 px-2" title="Your Videos">&nbsp;&nbsp;<span
                                                    style={{ paddingLeft: "10px" }}><i className="fa fa-caret-square-o-right"
                                                        style={{ fontSize: "24px" }}></i>&emsp; Your
                                                    Videos</span>
                                            </Link>
                                            <Link to="#watchlater"
                                                style={{ textDecoration: "none", borderRadius: "10px", display: "block" }}
                                                className="left_menu_1 pt-2 pb-2 px-2" title="Watch Later">&nbsp;&nbsp;<span
                                                    style={{ paddingLeft: "10px" }}><i className="fa fa-clock-o" style={{ fontSize: "24px" }}></i>&emsp;
                                                    Watch Later</span> </Link>
                                            <Link to="/liked_video"
                                                style={{ textDecoration: "none", borderRadius: "10px", display: "block" }}
                                                className="left_menu_1 pt-2 pb-2 px-2" title="Liked Videos">&nbsp;&nbsp;<span
                                                    style={{ paddingLeft: "10px" }}><i className="fa fa-thumbs-up" style={{ fontSize: "24px" }}></i>&emsp;
                                                    Liked Videos</span> </Link>

                                            {
                                                MySubscribers.length !== 0 ?
                                                    <span>
                                                        <hr />
                                                        <h6 style={{ paddingLeft: "25px" }} className="heading">SUBSCRIPTIONS</h6>
                                                    </span>
                                                    :
                                                    <></>
                                            }
                                            {
                                                MySubscribers.map((MySubscribersDetails, i) =>
                                                    <span>
                                                        <Link style={{ textDecoration: "none", borderRadius: "10px", display: "block" }} to={{ pathname: `/user_channel/${MySubscribersDetails.Subscriber_Id}`, id: MySubscribersDetails.Subscriber_Id, }} onClick={setChannelId(MySubscribersDetails.Subscriber_Id)} className="left_menu_1 pt-2 pb-2 px-2 my_subscribers" title={MySubscribersDetails.Subscriber_channel_name}>
                                                            &nbsp;&nbsp;
                                                            <span style={{ paddingLeft: "10px" }}><img
                                                                src={MySubscribersDetails.Subscriber_profile_image} width="35" height="35"
                                                                style={{ borderRadius: "100%" }} alt="#" />&emsp;
                                                                {MySubscribersDetails.Subscriber_channel_name}</span>
                                                        </Link>
                                                    </span>
                                                )
                                            }
                                            {
                                                (MySubscribers.length >= 5) ?
                                                    <Link to="#seemore" style={{ textDecoration: "none", borderRadius: "10px", display: "block" }}
                                                        className="left_menu_1 pt-2 pb-2 px-2" title="See more">&nbsp;&nbsp;<span
                                                            style={{ paddingLeft: "10px" }}><i className="fa fa-angle-down" style={{ fontSize: "24px" }}></i>&emsp;
                                                            See more</span> </Link>
                                                    :
                                                    <></>
                                            }
                                            <hr />
                                        </>
                                }

                                <h6 style={{ paddingLeft: "25px" }} className="heading">More From Youtube</h6>
                                <Link to="#premium" style={{ textDecoration: "none", borderRadius: "10px", display: "block" }}
                                    className="left_menu_1 pt-2 pb-2 px-2" title="Youtube Premium">&nbsp;&nbsp;<span
                                        style={{ paddingLeft: "10px" }}><i className="fa fa-youtube-play"
                                            style={{ fontSize: "24px" }}></i>&emsp;
                                        Youtube Premium</span>
                                </Link>
                                <Link to="#film" style={{ textDecoration: "none", borderRadius: "10px", display: "block" }}
                                    className="left_menu_1 pt-2 pb-2 px-2" title="Film">&nbsp;&nbsp;<span style={{ paddingLeft: "10px" }}><i
                                        className="fa fa-film" style={{ fontSize: "24px" }}></i>&emsp; Film</span> </Link>
                                <Link to="#news" style={{ textDecoration: "none", borderRadius: "10px", display: "block" }}
                                    className="left_menu_1 pt-2 pb-2 px-2" title="Game">&nbsp;&nbsp;<span style={{ paddingLeft: "10px" }}><i
                                        className="fa fa-newspaper-o" style={{ fontSize: "24px" }}></i>&emsp; News</span> </Link>
                                <Link to="#fashion" style={{ textDecoration: "none", borderRadius: "10px", display: "block" }}
                                    className="left_menu_1 pt-2 pb-2 px-2" title="Fashion">&nbsp;&nbsp;<span
                                        style={{ paddingLeft: "10px" }}><i className="fa fa-female" style={{ fontSize: "24px" }}></i>&emsp;
                                        Fashion</span> </Link>
                                <Link to="#learning"
                                    style={{ textDecoration: "none", borderRadius: "10px", display: "block" }}
                                    className="left_menu_1 pt-2 pb-2 px-2" title="Learning">&nbsp;&nbsp;<span
                                        style={{ paddingLeft: "10px" }}><i className="fa fa-lightbulb-o" style={{ fontSize: "24px" }}></i>&emsp;
                                        Learning</span> </Link>
                                <Link to="#sport" style={{ textDecoration: "none", borderRadius: "10px", display: "block" }}
                                    className="left_menu_1 pt-2 pb-2 px-2" title="Sport">&nbsp;&nbsp;<span
                                        style={{ paddingLeft: "10px" }}><i className="fa fa-trophy" style={{ fontSize: "24px" }}></i>&emsp;
                                        Sport</span> </Link>
                                <hr />
                                <Link to="#setting" style={{ textDecoration: "none", borderRadius: "10px", display: "block" }}
                                    className="left_menu_1 pt-2 pb-2 px-2" title="Setting">&nbsp;&nbsp;<span
                                        style={{ paddingLeft: "10px" }}><i className="fa fa-gear" style={{ fontSize: "24px" }}></i>&emsp;
                                        Setting</span> </Link>
                                <Link to="#report_history"
                                    style={{ textDecoration: "none", borderRadius: "10px", display: "block" }}
                                    className="left_menu_1 pt-2 pb-2 px-2" title="Report History">&nbsp;&nbsp;<span
                                        style={{ paddingLeft: "10px" }}><i className="fa fa-flag" style={{ fontSize: "24px" }}></i>&emsp; Report
                                        History</span> </Link>
                                <Link to="#help" style={{ textDecoration: "none", borderRadius: "10px", display: "block" }}
                                    className="left_menu_1 pt-2 pb-2 px-2" title="Help">&nbsp;&nbsp;<span style={{ paddingLeft: "10px" }}><i
                                        className="fa fa-question-circle" style={{ fontSize: "24px" }}></i>&emsp; Help</span> </Link>
                                <Link to="#send_feedback"
                                    style={{ textDecoration: "none", borderRadius: "10px", display: "block" }}
                                    className="left_menu_1 pt-2 pb-2 px-2" title="Send Feedback">&nbsp;&nbsp;<span
                                        style={{ paddingLeft: "10px" }}><i className="fa fa-envelope-o" style={{ fontSize: "24px" }}></i>&emsp;
                                        Send Feedback</span> </Link>
                                <hr />
                                <h6 style={{ fontSize: "15px", paddingLeft: "30px" }} className="heading">
                                    About Press Copyright Contact us Creator Advertise Developers
                                </h6>
                                <h6 style={{ fontSize: "15px", paddingLeft: "30px" }} className="heading">
                                    Terms Privacy Policy & Safety How YouTube works Test new features
                                </h6>
                                <p style={{ paddingLeft: "30px" }} className="heading">© 2022 Google LLC</p>
                                <br />
                            </div>
                        </div>

                        {/* left sidebar after lg scrn */}
                        <div className="left_sidebar_after_lg text-center" style={{ position: "fixed", width: "16%" }}>
                            <Link to="/"
                                style={{ textDecoration: "none", borderRadius: "10px", fontSize: "15px", display: "block" }}
                                className="left_menu_1">&nbsp;&nbsp;<span><i className="fa fa-home" style={{ fontSize: "24px" }}></i>&emsp;<br />
                                    Home</span> </Link>
                            <Link to="#explore"
                                style={{ textDecoration: "none", borderRadius: "10px", fontSize: "15px", display: "block" }}
                                className="left_menu_1 pt-2 pb-2 px-2">&nbsp;&nbsp;<span><i className="fa fa-compass"
                                    style={{ fontSize: "24px" }}></i>&emsp;<br /> Explore</span> </Link>
                            {
                                user ?
                                    <>
                                        <Link to="#subscription"
                                            style={{ textDecoration: "none", borderRadius: "10px", fontSize: "15px", display: "block" }}
                                            className="left_menu_1 pt-2 pb-2 px-2">&nbsp;&nbsp;<span><i className="fa fa-youtube-play"
                                                style={{ fontSize: "24px" }}></i>&emsp;<br /> Subscriptions</span> </Link>
                                        <Link to="/liked_video"
                                            style={{ textDecoration: "none", borderRadius: "10px", fontSize: "15px", display: "block" }}
                                            className="left_menu_1 pt-2 pb-2 px-2">&nbsp;&nbsp;<span><i className="fa fa-thumbs-up"
                                                style={{ fontSize: "24px" }}></i>&emsp;<br /> Liked Videos</span> </Link>
                                        <Link to="/history"
                                            style={{ textDecoration: "none", borderRadius: "10px", fontSize: "15px", display: "block" }}
                                            className="left_menu_1 pt-2 pb-2 px-2">&nbsp;&nbsp;<span><i className="fa fa-history"
                                                style={{ fontSize: "24px" }}></i>&emsp;<br /> History</span> </Link>
                                    </>
                                    :
                                    <></>
                            }
                            <Link to="#library"
                                style={{ textDecoration: "none", borderRadius: "10px", fontSize: "15px", display: "block" }}
                                className="left_menu_1 pt-2 pb-2 px-2">&nbsp;&nbsp;<span><i className="fa fa-caret-square-o-right"
                                    style={{ fontSize: "24px" }}></i>&emsp;<br /> Library</span> </Link>
                        </div>
                    </div>


                    {/* all video shown here */}
                    <div className="col-12 col-md-10 right_side" style={{ padding: "0" }}>
                        {loading ?
                            <div className="scrollbox">
                                <div className="container">
                                    {
                                        UserDetails.map((UserDetails, i) =>
                                            <>
                                                <title>{UserDetails.channel_name}- Youtube</title>
                                                <img src={UserDetails.cover_image} alt="#" height="300" style={{ width: "100%" }} />
                                                <div className="row mt-3 mb-5">
                                                    <div className="col-2 col-lg-2 col-xl-1">
                                                        <img src={UserDetails.profile_image} alt="" width="70" height="70" />
                                                    </div>
                                                    <div className="col-7 col-lg-8 col-xl-9" style={{ paddingLeft: "20px" }}>
                                                        <p title={UserDetails.channel_name} style={{ fontSize: "25px" }} className='channel_name'><b>{UserDetails.channel_name}</b></p>
                                                        <p style={{ fontSize: "15px", marginTop: "-18px" }} className='channel_subscriber'>{UserDetails.subscribers} subscribers</p>
                                                    </div>
                                                    <div className="col-3 col-lg-2 col-xl-2">
                                                        {(ChannelId !== user.id) ?
                                                            <button className="btn btn-danger" style={{ fontWeight: "500" }} onClick={() => AddSubscriber(ChannelId)}>
                                                                {(SubscribeResult === "active") ?
                                                                    <>SUBSCRIBED</>
                                                                    :
                                                                    <>SUBSCRIBE</>
                                                                }
                                                            </button>
                                                            :
                                                            <Link to="/manage_channel" className='btn btn-success' style={{ fontWeight: "500" }}>Manage Channel</Link>
                                                        }
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    }
                                    <div className='row'>
                                        {
                                            UserVideos.map((UserVideos, i) =>
                                                <div className="col-12 col-md-6 col-lg-4 col-xl-3 mt-3">
                                                    <Link style={{ textDecoration: "none" }} to={{ pathname: `/single_video/${UserVideos.video_id}`, id: UserVideos.video_id, }} onClick={setSingleVideoId(UserVideos.video_id)}>
                                                        <img src={UserVideos.video_thumbnail} alt='#' style={{ width: "100%", height: "200px" }} />
                                                        <div className="row mt-2">
                                                            <div className="col-2">
                                                                <img src={UserVideos.video_creator_profile} alt="#" style={{ width: "40px", height: "40px", borderRadius: "100%" }} />
                                                            </div>
                                                            <div className="col-10">
                                                                <p className='channel_video_title'>{UserVideos.video_title}</p>
                                                                <p className='channel_video_date_views' title={UserVideos.video_creator} style={{ fontSize: "15px", marginTop: "-18px" }}>{UserVideos.views} views • {UserVideos.upload_date}</p>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                            :
                            <div class="text-center loading_spinner" style={{ marginTop: "56px" }}>
                                <div class="spinner-border" role="status" style={{ marginTop: "150px" }}>
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div >
    );
}

export default UserChannel;




