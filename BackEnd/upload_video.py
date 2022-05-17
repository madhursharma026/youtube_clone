from random import Random
from flask import Blueprint, render_template, request, flash, redirect, url_for, jsonify
from flask_login import login_required, current_user
from sqlalchemy import func
from moviepy.editor import VideoFileClip
from werkzeug.wrappers import response
from .models import Channel, Video, Reaction, Comment, Category
from . import db
from . import db, ALLOWED_EXTENSIONS_IMAGE, ALLOWED_EXTENSIONS_VIDEO, UPLOAD_FOLDER_VIDEO, UPLOAD_FOLDER_VIDEO_THUMBNAIL
from werkzeug.utils import secure_filename
import os

upload_video = Blueprint('upload_video', __name__)


@upload_video.route("/all_category", methods=['GET'])
def all_category():
    all_category_list = []
    all_category = Category.query.filter(
        Category.category_status == "active").all()
    for all_category in all_category:
        data_in_dict = {
            "id": all_category.id,
            "category_name": all_category.category_name
        }
        all_category_list.append(data_in_dict)
    return jsonify(all_category_list)


@upload_video.route("/upload_video", methods=['POST'])
def upload():
    last_video_id = Video.query.order_by(Video.id.desc()).first()
    video_category_id = (int(request.form.get('VideoCategoryId'))+1)
    getting_video_category = Category.query.filter(
        Category.id == video_category_id).first()
    current_user_id = request.form.get('UserId')
    video_url = request.files['VideoURL']
    video_title = request.form.get('VideoTitle')
    video_description = request.form.get('VideoDescription')
    video_category = getting_video_category.category_name
    video_thumbnail = request.files['VideoThumbnail']
    if video_url and '.' in video_url.filename and \
            video_url.filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS_VIDEO:
        video_filename = str(int(last_video_id.id)+1) + \
            secure_filename(video_url.filename)
        video_url.save(os.path.join(UPLOAD_FOLDER_VIDEO, video_filename))
        if video_thumbnail and '.' in video_thumbnail.filename and \
                video_thumbnail.filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS_IMAGE:
            video_thumbnail_filename = str(
                int(last_video_id.id)+1)+secure_filename(video_thumbnail.filename)
            video_thumbnail.save(os.path.join(
                UPLOAD_FOLDER_VIDEO_THUMBNAIL, video_thumbnail_filename))
            video_duration = VideoFileClip(
                "C:/Users/Ram Sharma/Desktop/python/YoutubeAPI/static/video_upload/"+video_filename)
            new_video = Video(video_url=video_filename, video_title=video_title, video_description=video_description, video_category=video_category, video_category_id=video_category_id,
                              video_thumbnail=video_thumbnail_filename, views="0", video_status='active', video_duration="{:.2f}".format((video_duration.duration)/60), video_user_id=current_user_id)
            db.session.add(new_video)
            db.session.commit()
            if new_video:
                response = jsonify({
                    "result": "Upload Successfully"
                })
            else:
                response = jsonify({
                    "message": "Execution Failed"
                })
    else:
        response = jsonify({
            "message": "Execution Failed"
        })
    return response


@upload_video.route("/video/<int:video_id>/comment", methods=["POST"])
def comment_post(video_id):
    comment = Comment(comment=request.json['CommentValue'],
                      video_id=video_id, channel_id=request.json['current_user_id'])
    db.session.add(comment)
    db.session.commit()
    response = jsonify({
        "message": "Comment Post Successfully"
    })
    return response


@upload_video.route("/like/<int:video_id>", methods=["POST"])
def like(video_id):
    addlike = Reaction(video_id=video_id, user_id=request.json['CurrentUserId'], reaction="1")
    remove_like = Reaction.query.filter(Reaction.reaction == '1', Reaction.video_id == video_id, Reaction.user_id == request.json['CurrentUserId']).scalar()
    like_again = Reaction.query.filter(Reaction.reaction == '0', Reaction.video_id == video_id, Reaction.user_id == request.json['CurrentUserId']).scalar()
    dislike_into_like = Reaction.query.filter(Reaction.reaction == '2', Reaction.video_id == video_id, Reaction.user_id == request.json['CurrentUserId']).scalar()
    if remove_like:
        remove_like.reaction = "0"
        db.session.commit()
        response = {
            "message": "Like Removed Successfully"
        }
    elif dislike_into_like:
        dislike_into_like.reaction = "1"
        db.session.commit()
        response = {
            "message": "Like Into Dislike Convert Successfully"
        }
    elif like_again:
        like_again.reaction = "1"
        db.session.commit()
        response = {
            "message": "Like Successfully"
        }
    else:
        db.session.add(addlike)
        db.session.commit()
        response = {
            "message": "Like Successfully"
        }
    return jsonify(response)        


@upload_video.route("/dislike/<int:video_id>", methods=["GET", "POST"])
def dislike(video_id):
    add_dislike = Reaction(
        video_id=video_id, user_id=request.json['CurrentUserId'], reaction="2")
    remove_dislike = Reaction.query.filter(
        Reaction.reaction == '2', Reaction.video_id == video_id, Reaction.user_id == request.json['CurrentUserId']).scalar()
    dislike_again = Reaction.query.filter(
        Reaction.reaction == '0', Reaction.video_id == video_id, Reaction.user_id == request.json['CurrentUserId']).scalar()
    like_into_dislike = Reaction.query.filter(
        Reaction.reaction == '1', Reaction.video_id == video_id, Reaction.user_id == request.json['CurrentUserId']).scalar()
    if remove_dislike:
        remove_dislike.reaction = "0"
        db.session.commit()
        response = {
            "message": "Dislike Removed Successfully"
        }
    elif like_into_dislike:
        like_into_dislike.reaction = "2"
        db.session.commit()
        response = {
            "message": "Dislike Into Like Convert Successfully"
        }
    elif dislike_again:
        dislike_again.reaction = "2"
        db.session.commit()
        response = {
            "message": "Dislike Successfully"
        }
    else:
        db.session.add(add_dislike)
        db.session.commit()
        response = {
            "message": "Dislike Successfully"
        }
    return jsonify(response)
