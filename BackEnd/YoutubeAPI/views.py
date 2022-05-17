from datetime import date, datetime
from operator import ge
from urllib import response
from flask import Blueprint, render_template, request, flash, redirect, url_for, jsonify
from flask_login import login_required, current_user, logout_user
from sqlalchemy import func
from . import db
from .models import Category, Channel, History, Video, Reaction, Subscriber, Comment

views = Blueprint('views', __name__)


@views.route("/")
def home():
    All_video_details = []
    All_videos = Video.query.filter(Video.video_status == 'active').order_by(
        Video.upload_date.desc()).all()
    for All_videos in All_videos:
        data_in_dict = {
            "video_id": All_videos.id,
            "video_url": All_videos.video_url,
            "video_title": All_videos.video_title,
            "video_description": All_videos.video_description,
            "video_category": All_videos.video_category,
            "video_thumbnail": "http://127.0.0.1:5000/static/video_thumbnail/"+All_videos.video_thumbnail,
            "upload_date": All_videos.upload_date.strftime("%m-%d-%Y"),
            "views": All_videos.views,
            "video_duration": All_videos.video_duration,
            "video_creator": All_videos.creator.Channel_name,
            "video_creator_profile": "http://127.0.0.1:5000/static/profile_image/"+All_videos.creator.profile_image
        }
        All_video_details.append(data_in_dict)
    return jsonify(All_video_details)


@views.route("/getting_user_subscribers/<channel_id>", methods=['GET'])
def getting_user_subscribers(channel_id):
    Subscribers_list = []
    subscriber_exists = db.session.query(Channel.id, Channel.Channel_name, Channel.profile_image, Subscriber.channel_user_id).filter(
        Subscriber.current_user_id == channel_id, Subscriber.channel_user_id == Channel.id, Subscriber.subscriber_status == "active").all()[:5]
    for subscriber_exists in subscriber_exists:
        data_in_dict = {
            "Subscriber_Id": subscriber_exists.id,
            "Subscriber_channel_name": subscriber_exists.Channel_name,
            "Subscriber_profile_image": "http://127.0.0.1:5000/static/profile_image/"+subscriber_exists.profile_image
        }
        Subscribers_list.append(data_in_dict)
    return jsonify(Subscribers_list)


@views.route("/subscribe/user_id/<channel_id>", methods=['POST'])
def subscribe(channel_id):
    subscriber_exists_active = Subscriber.query.filter(
        Subscriber.current_user_id == request.json['current_user_id'], Subscriber.channel_user_id == channel_id, Subscriber.subscriber_status == "active").first()
    subscriber_exists_remove = Subscriber.query.filter(
        Subscriber.current_user_id == request.json['current_user_id'], Subscriber.channel_user_id == channel_id, Subscriber.subscriber_status == "remove").first()
    channel_info = Channel.query.filter(Channel.id == channel_id).first()
    if subscriber_exists_active:
        subscriber_exists_active.subscriber_status = "remove"
        db.session.commit()
        channel_info.subscriber = channel_info.subscriber-1
        db.session.commit()
        response = jsonify({"message": "subscriber Removed Successfully"})
    elif subscriber_exists_remove:
        subscriber_exists_remove.subscriber_status = "active"
        db.session.commit()
        channel_info.subscriber = channel_info.subscriber+1
        db.session.commit()
        response = jsonify({"message": "subscriber Added Successfully"})
    else:
        channel_info.subscriber = channel_info.subscriber+1
        db.session.commit()
        add_subscriber = Subscriber(current_user_id=request.json['current_user_id'],
                                    channel_user_id=channel_id, subscriber_count=Subscriber.subscriber_count+1)
        db.session.add(add_subscriber)
        db.session.commit()
        response = jsonify({"message": "subscriber Added Successfully"})
    return response


@views.route("/single_video_data/<video_id>", methods=['GET'])
def single_video_data(video_id):
    single_video_list = []
    single_video = Video.query.filter(
        Video.id == video_id, Video.video_status == 'active').first()
    single_video.views = single_video.views+1
    db.session.commit()
    single_video_data_in_dict = {
        "id": single_video.id,
        "video_url": "http://127.0.0.1:5000/static/video_upload/"+single_video.video_url,
        "video_title": single_video.video_title,
        "video_description": single_video.video_description,
        "video_thumbnail": "http://127.0.0.1:5000/static/video_thumbnail/"+single_video.video_thumbnail,
        "upload_date": single_video.upload_date.strftime("%m-%d-%Y"),
        "views": single_video.views,
        "creator_id": single_video.creator.id,
        "creator": single_video.creator.Channel_name,
        "single_video_creator_id": single_video.creator.id,
        "single_video_creator_subscribers": single_video.creator.subscriber,
        "single_video_creator_profile": "http://127.0.0.1:5000/static/profile_image/"+single_video.creator.profile_image
    }
    single_video_list.append(single_video_data_in_dict)
    return jsonify(single_video_list)


@views.route("/single_video_comment_data/<video_id>", methods=['GET'])
def single_video_comment_data(video_id):
    all_comment_list = []
    comment_show = Comment.query.filter(Comment.video_id == video_id).order_by(
        Comment.comment_date.desc()).all()
    for comment_show in comment_show:
        commented_channel_detail = Channel.query.filter(
            Channel.id == comment_show.channel_id).first()
        comment_data_in_dict = {
            "id": comment_show.id,
            "channel_name": commented_channel_detail.Channel_name,
            "profile_image": "http://127.0.0.1:5000/static/profile_image/"+commented_channel_detail.profile_image,
            "comment_date": comment_show.comment_date.strftime("%m-%d-%Y"),
            "comment": comment_show.comment
        }
        all_comment_list.append(comment_data_in_dict)
    return jsonify(all_comment_list)


@views.route("/single_video_same_category_video/<video_id>", methods=['GET'])
def single_video_same_category_video(video_id):
    same_category_videos_list = []
    single_video = Video.query.filter(
        Video.id == video_id, Video.video_status == 'active').first()
    same_category_videos = Video.query.filter(
        Video.id != video_id, Video.video_category_id == single_video.video_category_id, Video.video_status == 'active').all()
    for same_category_videos in same_category_videos:
        same_category_videos_data_in_dict = {
            "id": same_category_videos.id,
            "video_title": same_category_videos.video_title,
            "video_thumbnail": "http://127.0.0.1:5000/static/video_thumbnail/"+same_category_videos.video_thumbnail,
            "upload_date": same_category_videos.upload_date.strftime("%m-%d-%Y"),
            "views": same_category_videos.views,
            "creator": same_category_videos.creator.Channel_name
        }
        same_category_videos_list.append(same_category_videos_data_in_dict)
    return jsonify(same_category_videos_list)


@views.route("/single_video_reaction/<user_id>/<video_id>", methods=['GET'])
def single_video_reaction(user_id, video_id):
    getting_reaction = Reaction.query.filter(
        Reaction.user_id == user_id, Reaction.video_id == video_id).first()
    if getting_reaction == None:
        return jsonify({"message": "NoneType"})
    elif getting_reaction.reaction == "0":
        return jsonify({"message": "NoneType"})
    else:
        return jsonify({"message": getting_reaction.reaction})


@views.route("/checking_subscriber_with_video_id/<video_id>/<current_user_id>", methods=['GET'])
def checking_subscriber_with_video_id(video_id, current_user_id):
    single_id_creator = Video.query.filter(Video.id == video_id).first()
    checking_subscriber = Subscriber.query.filter(
        Subscriber.channel_user_id == single_id_creator.video_user_id, Subscriber.current_user_id == current_user_id).first()
    if checking_subscriber == None:
        return jsonify({"message": "NoneType"})
    elif checking_subscriber.subscriber_status == "remove":
        return jsonify({"message": "NoneType"})
    else:
        return jsonify({"message": checking_subscriber.subscriber_status})


@views.route("/checking_subscriber/<user_id>/<current_user_id>", methods=['GET'])
def checking_subscriber(user_id, current_user_id):
    checking_subscriber = Subscriber.query.filter(
        Subscriber.channel_user_id == user_id, Subscriber.current_user_id == current_user_id).first()
    if checking_subscriber == None:
        return jsonify({"message": "NoneType"})
    elif checking_subscriber.subscriber_status == "remove":
        return jsonify({"message": "NoneType"})
    else:
        return jsonify({"message": checking_subscriber.subscriber_status})


@views.route("/channel_details/<user_id>", methods=['GET'])
def channel_details(user_id):
    channel_data = []
    channel_detail = Channel.query.filter(Channel.id == user_id).first()
    data_in_dict = {
        "cover_image": "http://127.0.0.1:5000/static/cover_image/"+channel_detail.cover_image,
        "profile_image": "http://127.0.0.1:5000/static/profile_image/"+channel_detail.profile_image,
        "channel_name": channel_detail.Channel_name,
        "subscribers": channel_detail.subscriber
    }
    channel_data.append(data_in_dict)
    return jsonify(channel_data)


@views.route("/channel_video_details/<user_id>", methods=['GET'])
def channel_video_details(user_id):
    channel_video_data = []
    MyVideos = Video.query.filter(Video.video_user_id == user_id, Video.video_status == 'active').order_by(
        Video.upload_date.desc()).all()
    for MyVideos in MyVideos:
        data_in_dict = {
            "video_id": MyVideos.id,
            "video_url": MyVideos.video_url,
            "video_title": MyVideos.video_title,
            "video_description": MyVideos.video_description,
            "video_category": MyVideos.video_category,
            "video_thumbnail": "http://127.0.0.1:5000/static/video_thumbnail/"+MyVideos.video_thumbnail,
            "upload_date": MyVideos.upload_date.strftime("%m-%d-%Y"),
            "views": MyVideos.views,
            "video_duration": MyVideos.video_duration,
            "video_creator_profile": "http://127.0.0.1:5000/static/profile_image/"+MyVideos.creator.profile_image
        }
        channel_video_data.append(data_in_dict)
    return jsonify(channel_video_data)


@views.route('/add_category', methods=['POST'])
def add_category():
    CategoryName = request.json['CategoryName']
    new_category = Category(category_name=CategoryName)
    db.session.add(new_category)
    db.session.commit()
    return "Category Added"


@views.route("/search_data", methods=['POST'])
def search_data():
    All_video_details = []
    search_value = request.json['SearchData']
    search = "%{}%".format(search_value)
    All_videos = Video.query.filter(Video.video_title.like(search), Video.video_description.like(
        search), Video.video_status == 'active').order_by(Video.upload_date.desc()).all()
    if search == "":
        response = {"message": "No Data Found"}
        return response
    elif All_videos == []:
        response = {"message": "No Data Found"}
        return response
    else:
        for All_videos in All_videos:
            data_in_dict = {
                "video_id": All_videos.id,
                "video_url": All_videos.video_url,
                "video_title": All_videos.video_title,
                "video_description": All_videos.video_description,
                "video_category": All_videos.video_category,
                "video_thumbnail": "http://127.0.0.1:5000/static/video_thumbnail/"+All_videos.video_thumbnail,
                "upload_date": All_videos.upload_date.strftime("%m-%d-%Y"),
                "views": All_videos.views,
                "video_duration": All_videos.video_duration,
                "video_creator": All_videos.creator.Channel_name[:15],
                "video_creator_profile": "http://127.0.0.1:5000/static/profile_image/"+All_videos.creator.profile_image
            }
            All_video_details.append(data_in_dict)
        return jsonify(All_video_details)


@views.route("/getting_liked_video_details/user:id/<user_id>", methods=['GET'])
def getting_liked_video_details(user_id):
    liked_video = []
    liked_video_details = Reaction.query.filter(
        Reaction.reaction == "1", Reaction.user_id == user_id).all()
    if liked_video_details == []:
        liked_video.append("No Data")
    else:
        for liked_video_details in liked_video_details:
            getting_video_details = Video.query.filter(
                Video.id == liked_video_details.video_id).first()
            data_in_dict = {
                "video_id": getting_video_details.id,
                "video_url": getting_video_details.video_url,
                "video_title": getting_video_details.video_title,
                "video_description": getting_video_details.video_description,
                "video_category": getting_video_details.video_category,
                "video_thumbnail": "http://127.0.0.1:5000/static/video_thumbnail/"+getting_video_details.video_thumbnail,
                "upload_date": getting_video_details.upload_date.strftime("%m-%d-%Y"),
                "views": getting_video_details.views,
                "video_duration": getting_video_details.video_duration,
                "video_creator": getting_video_details.creator.Channel_name[:15],
                "video_creator_profile": "http://127.0.0.1:5000/static/profile_image/"+getting_video_details.creator.profile_image
            }
            liked_video.append(data_in_dict)
    return jsonify(liked_video)


@views.route("/add_to_history", methods=['POST'])
def add_to_history():
    checking_video_seen_today_or_not = History.query.filter(
        History.video_id == request.json['SingleVideoId'], History.user_id == request.json['current_user_id']).first()
    if checking_video_seen_today_or_not == None:
        new_history = History(
            video_id=request.json['SingleVideoId'], user_id=request.json['current_user_id'])
        db.session.add(new_history)
        db.session.commit()
    else:
        checking_video_seen_today_or_not.history_time = datetime.now()
        db.session.commit()
    return "History Added"


@views.route("/getting_history/<user_id>", methods=['GET'])
def getting_history(user_id):
    history_data = []
    getting_history = History.query.filter(
        History.user_id == user_id, History.history_status == "active").all()
    if getting_history == []:
        history_data.append("No Data")
    else:
        for getting_history in getting_history:
            getting_video_details = Video.query.filter(
                Video.id == getting_history.video_id).first()
            data_in_dict = {
                "video_id": getting_video_details.id,
                "video_url": getting_video_details.video_url,
                "video_title": getting_video_details.video_title,
                "video_description": getting_video_details.video_description,
                "video_category": getting_video_details.video_category,
                "video_thumbnail": "http://127.0.0.1:5000/static/video_thumbnail/"+getting_video_details.video_thumbnail,
                "upload_date": getting_video_details.upload_date.strftime("%m-%d-%Y"),
                "views": getting_video_details.views,
                "video_duration": getting_video_details.video_duration,
                "video_creator": getting_video_details.creator.Channel_name[:15],
                "video_creator_profile": "http://127.0.0.1:5000/static/profile_image/"+getting_video_details.creator.profile_image
            }
            history_data.append(data_in_dict)
    return jsonify(history_data)


@views.route("/remove_single_video_history/<user_id>/<video_id>", methods=['GET'])
def remove_single_video_history(user_id, video_id):
    getting_history = History.query.filter(History.user_id == user_id, History.video_id == video_id, History.history_status == "active").first()
    if getting_history == None:
        response = jsonify({"message": "Something Went Wrong"})
    else:
        getting_history.history_status = 'remove'
        db.session.commit()
        response = jsonify({"message": "Video Removed From History"})
    return response


@views.route("/remove_all_history/<user_id>", methods=['GET'])
def remove_all_history(user_id):
    getting_history = History.query.filter(History.user_id == user_id, History.history_status == "active").all()
    if getting_history == []:
        response = jsonify({"message": "Something Went Wrong"})
    else:
        for getting_history in getting_history:
            getting_history.history_status = 'remove'
            db.session.commit()
            response = jsonify({"message": "Videos Removed From History"})
    return response






