import { Link, useHistory } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';


function Header() {
  const history = useHistory()
  const user = JSON.parse(localStorage.getItem("user-info"))
  const [SearchData, setSearchData] = useState("")


  async function SubmitSearchData(e) {
    e.preventDefault()
    let data = { SearchData }
    let result = await fetch("http://127.0.0.1:5000/search_data", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })
    result = await result.json()
    localStorage.setItem("searchdata", JSON.stringify(result))
    const searchdata = JSON.parse(localStorage.getItem("searchdata"))
    if (searchdata.message === "No Data Found") {
      alert("No Data Found")
      localStorage.removeItem("SearchData")
      setSearchData("")
    } else {
      history.push("/search_data")
    }
  }

  function show_and_hide_div() {
    var x = document.getElementById("myDIV");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }

  function logout() {
    localStorage.removeItem("user-info")
    history.push("/home")
  }



  return (
    <div id="Header" style={{ paddingTop: "16px" }}>
      <div className='row'>
        <div className='col-5 col-sm-4 col-md-3 col-lg-3 col-xl-2 logo_and_sidebar_btn'>
          <i className="fa fa-bars mt-1 sidebar_toggle_btn" style={{ fontSize: "20px", marginLeft: "35px" }}></i>
          <Link to="/">
            <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/YouTube_Logo_2017.svg/1200px-YouTube_Logo_2017.svg.png' alt='#' width="100" height="22" style={{ marginLeft: "20px", marginTop: "-5px" }} />
          </Link>
        </div>
        <div className='col-1 col-sm-4 col-md-4 col-lg-5 col-xl-6 text-center'>
          <i className="fa fa-search search_magnifying_glass" onClick={() => show_and_hide_div()} style={{ color: "gray", fontSize: "22px", cursor: "pointer" }}></i>
          <i className="fa fa-microphone search_microphone" style={{ color: "#3F3F3F", fontSize: "22px", marginLeft: "20px" }}></i>
          <div className='search_bar_and_btn'>
            <form onSubmit={SubmitSearchData}>
              <input type="text" name="search_bar_data" className="search_bar py-1 searchbartextform" placeholder="Search" style={{ paddingLeft: "10px", fontSize: "18px", marginLeft: "10%" }} autoComplete='off' value={SearchData} onChange={(e) => setSearchData(e.target.value)} />
              <button type="Submit" className="btn px-4 py-2 search_bar_btn" title="Search" style={{ fontSize: "14px", marginTop: "-6px", border: "1px solid gray", borderRadius: "0" }}><i
                className="fa fa-search" style={{ color: "rgb(160, 160, 160)" }}></i></button>
              <Link to="#microphone" style={{ textDecoration: "none" }}>
                <i className="fa fa-microphone" style={{ color: "gray", fontSize: "22px", marginLeft: "20px" }}></i>
              </Link>
            </form>
          </div>
        </div>
        <div className='col-6 col-sm-4 col-md-5 col-lg-4 col-xl-4 right_side_options' style={{ textAlign: "right" }}>

          {
            !user ?
              <span>
                <Link to="/login_page" className='sign_in' style={{ marginRight: "4px" }}>
                  <button type="button" className="btn" style={{ border: "1px solid blue", color: "blue" }}><i className="fa fa-user"></i>Sign In</button>
                </Link>
                <Link to="/register_page" className='sign_up'>
                  <button type="button" className="btn" style={{ border: "1px solid blue", color: "blue", marginRight: "5px" }}><i className="fa fa-user-plus"></i>Sign Up</button>
                </Link>
              </span>
              :
              <>
                {
                  (user.role === "admin") ?
                    <span>
                      <Link to="#notify" title="Notifications" style={{ color: "gray", marginRight: "22px" }}><i className="fa fa-bell"
                        style={{ fontSize: "24px" }}></i></Link>
                      <div style={{ float: "right", marginRight: "5px", marginTop: "-10px" }}>
                        <Dropdown>
                          <Dropdown.Toggle id="dropdown-basic" style={{ background: "transparent", border: "none", color: "black" }}>
                            <img src="https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg" data-bs-toggle="dropdown" alt=""
                              style={{ borderRadius: "100%", cursor: "pointer", width: "40px", height: "40px" }} />
                          </Dropdown.Toggle>
                          <Dropdown.Menu style={{ width: "350px" }}>
                            <div className="row" style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                              <div className="col-2">
                                <img src="https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg"
                                  alt="#" style={{ width: "40px", height: "40px", borderRadius: "100%" }} />
                              </div>
                              <div className="col-10 px-3">
                                <p title={user.Channel_name} style={{ fontSize: "15px", color: "rgb(66, 66, 66)" }} className='dropdown_channel_info'>
                                  <b>{user.Channel_name}</b>
                                </p>
                                <p style={{ fontSize: "15px", marginTop: "-18px", color: "rgb(66, 66, 66)" }} className='dropdown_channel_info'>{user.email}</p>
                              </div>
                              <h4 className="px-5 text-center"> User Status:- ADMIN</h4>
                              <hr className="mt-3" />
                            </div>
                            <button onClick={() => logout()} className="dropdown-item" type="button" style={{ paddingTop: "10px", paddingBottom: "10px" }}>
                              <span><i className="fa fa-sign-out" style={{ fontSize: "24px" }}></i>&emsp; Signout</span>
                            </button>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </span>
                    :
                    <span>
                      <Link to="/upload_video" title="Upload Video" style={{ color: "gray", marginRight: "22px" }}>
                        <i className="fa fa-video-camera upload_video_camera" style={{ fontSize: "24px" }}></i>
                      </Link>
                      <Link to="#notify" title="Notifications" style={{ color: "gray", marginRight: "22px" }}>
                        <i className="fa fa-bell notification_bell" style={{ fontSize: "24px" }}></i>
                      </Link>
                      <div style={{ float: "right", marginRight: "5px", marginTop: "-10px" }}>
                        <Dropdown>
                          <Dropdown.Toggle id="dropdown-basic" style={{ background: "transparent", border: "none", color: "black" }}>
                            <img src="https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg" data-bs-toggle="dropdown" alt=""
                              style={{ borderRadius: "100%", cursor: "pointer", width: "40px", height: "40px" }} />
                          </Dropdown.Toggle>
                          <Dropdown.Menu style={{ width: "350px" }}>
                            <div className="row" style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                              <div className="col-2">
                                <img src="https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg"
                                  alt="#" style={{ width: "40px", height: "40px", borderRadius: "100%" }} />
                              </div>
                              <div className="col-10 px-3">
                                <p title={user.Channel_name} style={{ fontSize: "15px", color: "rgb(66, 66, 66)" }} className='dropdown_channel_info'>
                                  <b>{user.Channel_name}</b>
                                </p>
                                <p style={{ fontSize: "15px", marginTop: "-18px", color: "rgb(66, 66, 66)" }} className='dropdown_channel_info'>{user.email}</p>
                              </div>
                              <span className='text-center'>
                                <Link to="/manage_channel" style={{ textDecoration: "none", fontSize: "18px" }}>Manage Your Google Account</Link>
                              </span>
                              <hr className="mt-3" />
                            </div>
                            <Link to={`/channel/${user.id}`} className="dropdown-item" type="button" style={{ textDecoration: "none", color: "black", display: "block", width: "100%", paddingTop: "10px", paddingBottom: "10px" }}>
                              <i className="fa fa-address-card" style={{ fontSize: "24px" }}></i>&emsp; Your Channel
                            </Link>
                            <Link to="#Purchases_and_memberships" className="dropdown-item" type="button" style={{ textDecoration: "none", color: "black", display: "block", width: "100%", paddingTop: "10px", paddingBottom: "10px" }}>
                              <i className="fa fa-youtube-play" style={{ fontSize: "24px" }}></i>&emsp; Purchases and memberships
                            </Link>
                            <Link to="#YouTube_Studio" className="dropdown-item" type="button" style={{ textDecoration: "none", color: "black", display: "block", width: "100%", paddingTop: "10px", paddingBottom: "10px" }}>
                              <i className="fa fa-dollar" style={{ fontSize: "24px" }}></i>&emsp; YouTube Studio
                            </Link>
                            <button onClick={() => logout()} className="dropdown-item" type="button" style={{ paddingTop: "10px", paddingBottom: "10px" }}>
                              <span><i className="fa fa-sign-out" style={{ fontSize: "24px" }}></i>&emsp; Signout</span>
                            </button>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </span>
                }
              </>
          }

        </div>
      </div>
      <div id="myDIV" className="mx-2 mt-2" style={{ display: "none" }}>
        <input type="text" name="search_data" className="toggle_searchbar py-1 searchbartextform" placeholder="Search" style={{ paddingLeft: "10px", fontSize: "18px", width: "100%" }} />
      </div>
      <br />
    </div>
  );
}

export default Header;





