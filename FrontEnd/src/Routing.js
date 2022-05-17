import "./DarkMode.css";
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Homepage from "./Homepage";
import SingleVideo from "./SingleVideo";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import UploadVideo from "./UploadVideo";
import EditChannel from "./EditChannel";
import Channel from "./Channel";
import SameCategoryVideo from "./SameCategoryVideo";
import UpdatedChannel from "./UpdatedChannel";
import UserChannel from "./UserChannel";
import UserChannelNext from "./UserChannelNext";
import LikedVideo from "./LikedVideo";
import SearchBar from "./SearchBar";
import History from "./History";

function Routing() {
  return (
    <Router>
      <Route exact path="/">
        <Homepage />
      </Route>
      <Route exact path="/home">
        <Homepage />
      </Route>
      <Route exact path="/single_video/:video_id">
        <SingleVideo />
      </Route>
      <Route exact path="/single_videos/:video_id">
        <SameCategoryVideo />
      </Route>
      <Route exact path="/login_page">
        <LoginPage />
      </Route>
      <Route exact path="/register_page">
        <RegisterPage />
      </Route>
      <Route exact path="/upload_video">
        <UploadVideo />
      </Route>
      <Route exact path="/manage_channel">
        <EditChannel />
      </Route>
      <Route exact path="/manage_channell">
        <UpdatedChannel />
      </Route>
      <Route exact path="/channel/:user_id">
        <Channel />
      </Route>
      <Route exact path="/user_channel/:user_id">
        <UserChannel />
      </Route>
      <Route exact path="/user_channell/:user_id">
        <UserChannelNext />
      </Route>
      <Route exact path="/liked_video">
        <LikedVideo />
      </Route>
      <Route exact path="/history">
        <History />
      </Route>
      <Route exact path="/search_data">
        <SearchBar />
      </Route>
    </Router>
  );
}
export default Routing;



