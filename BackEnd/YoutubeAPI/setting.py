from flask import Blueprint, request, jsonify
from .models import Channel
from . import db
from . import db, ALLOWED_EXTENSIONS_IMAGE, UPLOAD_FOLDER_PROFILE_IMAGE, UPLOAD_FOLDER_COVER_IMAGE
from werkzeug.utils import secure_filename
import os

setting = Blueprint('setting', __name__)


@setting.route("/manage_profile", methods=['GET', 'POST'])
def manage_profile():
    current_user_details = Channel.query.filter(
        Channel.id == request.form.get('CurrentUserId')).first()
    if request.form.get('ChannelProfileImage') != "http://127.0.0.1:5000/static/profile_image/"+current_user_details.profile_image:
        profile_image_data = request.files['ChannelProfileImage']
        if profile_image_data and '.' in profile_image_data.filename and \
                profile_image_data.filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS_IMAGE:
            current_user_profile_image = str(current_user_details.id)+secure_filename(
                profile_image_data.filename)
            profile_image_data.save(os.path.join(
                UPLOAD_FOLDER_PROFILE_IMAGE, current_user_profile_image))
            current_user_details.profile_image = current_user_profile_image
            db.session.commit()
    else:
        current_user_details.profile_image = current_user_details.profile_image
        db.session.commit()
    if request.form.get('ChannelCoverImage') != "http://127.0.0.1:5000/static/cover_image/"+current_user_details.cover_image:
        cover_image_data = request.files['ChannelCoverImage']
        if cover_image_data and '.' in cover_image_data.filename and \
                cover_image_data.filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS_IMAGE:
            current_user_cover_image = str(current_user_details.id)+secure_filename(
                cover_image_data.filename)
            cover_image_data.save(os.path.join(
                UPLOAD_FOLDER_COVER_IMAGE, current_user_cover_image))
            current_user_details.cover_image = current_user_cover_image
            db.session.commit()
    else:
        current_user_details.cover_image = current_user_details.cover_image
        db.session.commit()
    current_user_details.Channel_name = request.form.get('ChannelNameNew')
    db.session.commit()
    response = jsonify({"id": current_user_details.id, "Channel_name": current_user_details.Channel_name, "email": current_user_details.email, "password": current_user_details.password, "profile_image": "http://127.0.0.1:5000/static/profile_image/" + current_user_details.profile_image,
                        "cover_image": "http://127.0.0.1:5000/static/cover_image/" + current_user_details.cover_image, "subscriber": current_user_details.subscriber, "joined_date": current_user_details.joined_date, "role": current_user_details.role, "user_status": current_user_details.user_status})
    return response
