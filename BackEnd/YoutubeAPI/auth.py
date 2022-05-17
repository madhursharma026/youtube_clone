from flask import Blueprint, request, jsonify
from .models import Channel
from werkzeug.security import generate_password_hash, check_password_hash
from . import db
from flask_login import login_user, current_user

auth = Blueprint('auth', __name__)


@auth.route('/sign-in', methods=['POST'])
def login():
    channel = Channel.query.filter_by(
        email=request.json['LoginEmail'], role='user').first()
    if channel:
        if channel and check_password_hash(channel.password, request.json['LoginPassword']):
            if channel.user_status == 'active':
                login_user(channel, remember=True)
                db.session.commit()
                response = jsonify({"id": current_user.id, "Channel_name": current_user.Channel_name, "email": current_user.email, "password": current_user.password, "profile_image": "http://127.0.0.1:5000/static/profile_image/" +current_user.profile_image,
                                    "cover_image": "http://127.0.0.1:5000/static/cover_image/" +current_user.cover_image, "subscriber": current_user.subscriber, "joined_date": current_user.joined_date, "role": current_user.role, "user_status": current_user.user_status})
                return response
            else:
                response = jsonify({"id": "none"})
                return response
        else:
            response = jsonify(
                {"id": "Login Unsuccessful. Please check email and password"})
            return response
    else:
        response = jsonify(
            {"id": "You are not register... please register"})
        return response


@auth.route('/sign-up', methods=['POST'])
def sign_up():
    ChannelName = request.json['ChannelName']
    ChannelEmail = request.json['ChannelEmail']
    ChannelPassword = request.json['ChannelPassword']
    channel_email_exists = Channel.query.filter_by(email=ChannelEmail).first()
    if channel_email_exists:
        response = jsonify({"message": "Email already exists"})
    else:
        new_channel = Channel(Channel_name=ChannelName, email=ChannelEmail, password=generate_password_hash(ChannelPassword, method='sha256'))
        db.session.add(new_channel)
        db.session.commit()
        response = jsonify({"message": "Account created!, You are now able to log in"})
    return response
