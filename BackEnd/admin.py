from flask import Blueprint, render_template, request, flash, redirect, url_for, jsonify
from flask_login import login_required, current_user, logout_user, login_user
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import func
from . import db
from . import db, ALLOWED_EXTENSIONS_IMAGE, ALLOWED_EXTENSIONS_VIDEO, UPLOAD_FOLDER_VIDEO, UPLOAD_FOLDER_VIDEO_THUMBNAIL, UPLOAD_FOLDER_PROFILE_IMAGE, UPLOAD_FOLDER_COVER_IMAGE
from werkzeug.utils import secure_filename
import os
from .models import Category, Channel, Video, Reaction, Subscriber, Comment
from moviepy.editor import VideoFileClip
from datetime import date, timedelta

labels = []
Channel_values = []
Videos_labels = []
Videos_values = []

admin = Blueprint('admin', __name__)


@admin.route('/admin_login', methods=['POST'])
def admin_login():
    admin_email = request.json['LoginEmail']
    admin_password = request.json['LoginPassword']
    channel = Channel.query.filter_by(email=admin_email, role='admin').first()
    if channel:
        if channel and check_password_hash(channel.password, admin_password):
            if channel.user_status == 'active':
                login_user(channel, remember=True)
                db.session.commit()
                response = jsonify({"id": current_user.id, "Channel_name": current_user.Channel_name, "email": current_user.email, "password": current_user.password, "profile_image": "http://127.0.0.1:5000/static/profile_image/" + current_user.profile_image,
                                    "cover_image": "http://127.0.0.1:5000/static/cover_image/" + current_user.cover_image, "subscriber": current_user.subscriber, "joined_date": current_user.joined_date, "role": current_user.role, "user_status": current_user.user_status})
                return response
            else:
                response = jsonify({"id": "none"})
                return response
        else:
            response = jsonify({"id": "Login Unsuccessful. Please check email and password"})
            return response
    else:
        response = jsonify({"id": "You are not register... please register"})
        return response


@admin.route("/admin_home", methods=["GET", "POST"])
def admin_home():
    global Channel_values, labels, Videos_values, Videos_labels
    No_of_days = 7
    del Channel_values[:]
    del labels[:]
    del Videos_values[:]
    del Videos_labels[:]
    while No_of_days != 0:
        Channel_register_count = Channel.query.filter(Channel.joined_date == (date.today()+timedelta(days=1))-timedelta(days=No_of_days)).count()
        Video_upload_count = Video.query.filter(Video.upload_date == (date.today()+timedelta(days=1))-timedelta(days=No_of_days)).count()
        Channel_values.append(Channel_register_count)
        Videos_values.append(Video_upload_count)
        labels.append((date.today()+timedelta(days=1)) - timedelta(days=No_of_days))
        No_of_days = No_of_days-1
        response = jsonify({"labels":labels, "Channel_values":Channel_values, "Video_values":Videos_values})
        return response
        

@admin.route('/suspend_or_active_user/<id>/', methods=['GET', 'POST'])
@login_required
def suspend_or_active_user(id):
    all_user_details = Channel.query.filter(Channel.role == 'user').all()
    profile_image = "/profile_image/"
    account_detail = Channel.query.get_or_404(id)
    if account_detail.user_status == "active":
        account_detail.user_status = "suspend"
        db.session.commit()
        flash('You spspend ' + account_detail.Channel_name + ' Account', 'success')
    else:
        account_detail.user_status = "active"
        db.session.commit()
        flash('You active ' + account_detail.Channel_name + ' Account', 'success')
    return redirect(url_for('admin.admin_total_user'))


@admin.route('/block_or_active_video/<video_id>/', methods=['GET', 'POST'])
@login_required
def block_or_active_video(video_id):
    all_video_details = Video.query.filter(
        Video.video_status == 'active').all()
    profile_image = "/profile_image/"
    Video_detail = Video.query.get_or_404(video_id)
    if Video_detail.video_status == "active":
        Video_detail.video_status = "block"
        db.session.commit()
        flash('You blocked Video successfully', 'success')
    else:
        Video_detail.video_status = "active"
        db.session.commit()
        flash('You active Video successfully', 'success')
    return redirect(url_for('admin.admin_total_video'))


@admin.route('/block_or_active_category/<id>/', methods=['GET', 'POST'])
@login_required
def block_or_active_category(id):
    Category_list = Category.query.get_or_404(id)
    if Category_list.category_status == "active":
        Category_list.category_status = "blocked"
        db.session.commit()
    else:
        Category_list.category_status = "active"
        db.session.commit()
    return redirect(url_for('admin.admin_total_category'))


@admin.route("/admin_total_user")
@login_required
def admin_total_user():
    all_user_details = Channel.query.filter(Channel.role == 'user').all()
    profile_image = "/profile_image/"
    return render_template('youtube_admin_total_user.html', current_channel=current_user, profile_image=profile_image, all_user_details=all_user_details)


@admin.route("/admin_total_videos")
@login_required
def admin_total_video():
    all_video_details = Video.query.all()
    profile_image = "/profile_image/"
    return render_template('youtube_admin_total_videos.html', current_channel=current_user, profile_image=profile_image, all_video_details=all_video_details)


@admin.route("/admin_total_category")
@login_required
def admin_total_category():
    category_list = Category.query.all()
    profile_image = "/profile_image/"
    return render_template('youtube_admin_category.html', current_channel=current_user, profile_image=profile_image, category_list=category_list)


@admin.route("/admin_search_category", methods=['GET', 'POST'])
@login_required
def admin_search_category():
    if request.method == 'POST':
        form = request.form
        if form['admin_search_category_data'] == "":
            return redirect(url_for('admin.admin_total_category'))
        else:
            search_value = form['admin_search_category_data']
            search = "%{}%".format(search_value)
            category_list = Category.query.filter(
                Category.category_name.like(search)).all()
            profile_image = "/profile_image/"
            return render_template('youtube_admin_category.html', current_channel=current_user, profile_image=profile_image, category_list=category_list)
    return redirect(url_for('admin.admin_total_category'))


@admin.route("/admin_search_user", methods=['GET', 'POST'])
@login_required
def admin_search_user():
    if request.method == 'POST':
        form = request.form
        if form['admin_search_user_data'] == "":
            return redirect(url_for('admin.admin_total_user'))
        else:
            search_value = form['admin_search_user_data']
            search = "%{}%".format(search_value)
            all_user_details = Channel.query.filter(Channel.Channel_name.like(
                search)).order_by(Channel.joined_date.desc()).all()
            profile_image = "/profile_image/"
            return render_template('youtube_admin_total_user.html', current_channel=current_user, profile_image=profile_image, all_user_details=all_user_details)
    return redirect(url_for('admin.admin_total_user'))


@admin.route("/admin_search_video", methods=['GET', 'POST'])
@login_required
def admin_search_video():
    if request.method == 'POST':
        form = request.form
        if form['admin_search_video_data'] == "":
            return redirect(url_for('admin.admin_total_video'))
        else:
            search_value = form['admin_search_video_data']
            search = "%{}%".format(search_value)
            all_video_details = Video.query.filter(Video.video_title.like(
                search) | Video.video_description.like(search)).order_by(Video.upload_date.desc()).all()
            profile_image = "/profile_image/"
            return render_template('youtube_admin_total_videos.html', current_channel=current_user, profile_image=profile_image, all_video_details=all_video_details)
    return redirect(url_for('admin.admin_total_video'))


@admin.route("/admin_manage_video/<video_id>", methods=['GET', 'POST'])
@login_required
def manage_video(video_id):
    category_list = Category.query.all()
    profile_image = "/profile_image/"
    cover_image = "/cover_image/"
    edit_video = Video.query.filter(Video.id == video_id).first()
    if request.method == 'POST':
        edit_video.video_title = request.form.get('video_title')
        edit_video.video_description = request.form.get('video_description')
        edit_video.video_category = request.form.get('video_category')
        db.session.commit()
        flash("Video edit successfully", 'success')
    return render_template('youtube_admin_edit_video.html', current_channel=current_user, profile_image=profile_image, edit_video=edit_video, category_list=category_list)


@admin.route("/admin_manage_profile/<channel_id>", methods=['GET', 'POST'])
@login_required
def manage_profile(channel_id):
    edit_channel = Channel.query.filter(Channel.id == channel_id).first()
    profile_image = "/profile_image/"
    cover_image = "/cover_image/"
    if request.method == 'POST':
        if request.form.get('profile_image_new') != "":
            profile_image_data = request.files['profile_image_new']
            if profile_image_data and '.' in profile_image_data.filename and \
                    profile_image_data.filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS_IMAGE:
                edit_channel_profile_image = secure_filename(
                    profile_image_data.filename)
                profile_image_data.save(os.path.join(
                    UPLOAD_FOLDER_PROFILE_IMAGE, edit_channel_profile_image))
                edit_channel.profile_image = edit_channel_profile_image
                db.session.commit()
        else:
            edit_channel.profile_image = edit_channel.profile_image
            db.session.commit()
        if request.form.get('cover_image_new') != "":
            cover_image_data = request.files['cover_image_new']
            if cover_image_data and '.' in cover_image_data.filename and \
                    cover_image_data.filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS_IMAGE:
                edit_channel_cover_image = secure_filename(
                    cover_image_data.filename)
                cover_image_data.save(os.path.join(
                    UPLOAD_FOLDER_COVER_IMAGE, edit_channel_cover_image))
                edit_channel.cover_image = edit_channel_cover_image
                db.session.commit()
        else:
            edit_channel.cover_image = edit_channel.cover_image
            db.session.commit()
        edit_channel.Channel_name = request.form.get('Channel_name_new')
        edit_channel.email = request.form.get('email_new')
        edit_channel.role = request.form.get('role')
        db.session.commit()
        flash("account update successfully", 'success')
    return render_template('youtube_admin_edit_user.html', user_channel=edit_channel, current_channel=current_user, profile_image=profile_image, cover_image=cover_image)


@admin.route("/admin_find_average")
@login_required
def admin_find_average():
    profile_image = "/profile_image/"
    all_user_count = Channel.query.filter(
        Channel.user_status == 'active', Channel.role == 'user').count()
    all_video_count = Video.query.filter(
        Video.video_status == 'active').count()
    average_data = round(all_video_count/all_user_count)
    return render_template('youtube_admin_average.html', average_data=average_data, all_user_count=all_user_count, all_video_count=all_video_count, profile_image=profile_image, current_channel=current_user)


@admin.route('/admin_add_user', methods=['GET', 'POST'])
def admin_add_user():
    profile_image = "/profile_image/"
    if request.method == 'POST':
        Channel_name = request.form.get('Channel_name')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        profile_image = request.form.get('profile_image')
        cover_image = request.form.get('cover_image')
        subscriber = request.form.get('subscriber')
        channel_email_exit = Channel.query.filter_by(email=email).first()
        channel_name_exit = Channel.query.filter_by(
            Channel_name=Channel_name).first()
        if channel_email_exit:
            flash('Email already exists.', 'danger')
            return render_template("youtube_admin_add_user.html", current_channel=current_user)
        elif channel_name_exit:
            flash('Channel name already exists.', 'danger')
            return render_template("youtube_admin_add_user.html", current_channel=current_user)
        elif password != confirm_password:
            flash('Passwords don\'t match.', 'danger')
            return render_template("youtube_admin_add_user.html", current_channel=current_user)
        else:
            new_channel = Channel(Channel_name=Channel_name, email=email, password=generate_password_hash(
                password, method='sha256'), subscriber="0", profile_image="user_profile_img.jpg", cover_image="default_cover_image.png", role='user', user_status='active')
            db.session.add(new_channel)
            db.session.commit()
            flash('Account created!, You are now able to log in', 'success')
    return render_template("youtube_admin_add_user.html", profile_image=profile_image, current_channel=current_user)


@admin.route("/admin_upload_video", methods=['GET', 'POST'])
@login_required
def admin_upload_video():
    category_list = Category.query.filter(
        Category.category_status == 'active').all()
    profile_image = "/profile_image/"
    if request.method == 'POST':
        video_url = request.files['video_url']
        video_title = request.form.get('video_title')
        video_description = request.form.get('video_description')
        video_category = request.form.get('video_category')
        video_thumbnail = request.files['video_thumbnail']
        if video_url and '.' in video_url.filename and \
                video_url.filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS_VIDEO:
            video_filename = secure_filename(video_url.filename)
            video_url.save(os.path.join(UPLOAD_FOLDER_VIDEO, video_filename))
            if video_thumbnail and '.' in video_thumbnail.filename and \
                    video_thumbnail.filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS_IMAGE:
                video_thumbnail_filename = secure_filename(
                    video_thumbnail.filename)
                video_thumbnail.save(os.path.join(
                    UPLOAD_FOLDER_VIDEO_THUMBNAIL, video_thumbnail_filename))
                video_duration = VideoFileClip(
                    "C:/Users/Ram Sharma/Desktop/python/youtube/static/video_upload/"+video_filename)
                new_video = Video(video_url=video_filename, video_title=video_title, video_description=video_description, video_category=video_category,
                                  video_thumbnail=video_thumbnail_filename, views="0", video_status='active', video_duration=(video_duration.duration)/60, video_user_id=current_user.id)
                db.session.add(new_video)
                db.session.commit()
                flash('Video Uploaded', 'success')
                return render_template("youtube_admin_add_video.html", profile_image=profile_image, current_channel=current_user)
            else:
                flash("Video thumbnail is not in correct formate", 'danger')
        else:
            flash("video is not in correct formate", 'danger')
    return render_template("youtube_admin_add_video.html", current_channel=current_user, profile_image=profile_image, category_list=category_list)


@admin.route("/add_category", methods=['GET', 'POST'])
@login_required
def add_category():
    if request.method == 'POST':
        category_name = request.form.get('category_name')
        category_status = 'active'
        new_category = Category(
            category_name=category_name, category_status=category_status)
        category_exists = Category.query.filter(
            Category.category_name == category_name).first()
        if category_exists:
            flash('Category already exists', 'warning')
            return redirect(url_for('admin.admin_total_category'))
        else:
            db.session.add(new_category)
            db.session.commit()
            flash('Category Added Successfully', 'success')
            return redirect(url_for('admin.admin_total_category'))


@admin.route("/manage_admin_profile", methods=['GET', 'POST'])
@login_required
def manage_admin_profile():
    profile_image = "/profile_image/"
    if request.method == 'POST':
        if request.form.get('profile_image_new') != "":
            profile_image_data = request.files['profile_image_new']
            if profile_image_data and '.' in profile_image_data.filename and \
                    profile_image_data.filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS_IMAGE:
                current_user_profile_image = secure_filename(
                    profile_image_data.filename)
                profile_image_data.save(os.path.join(
                    UPLOAD_FOLDER_PROFILE_IMAGE, current_user_profile_image))
                current_user.profile_image = current_user_profile_image
                db.session.commit()
        else:
            current_user.profile_image = current_user.profile_image
            db.session.commit()
        if request.form.get('cover_image_new') != "":
            cover_image_data = request.files['cover_image_new']
            if cover_image_data and '.' in cover_image_data.filename and \
                    cover_image_data.filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS_IMAGE:
                current_user_cover_image = secure_filename(
                    cover_image_data.filename)
                cover_image_data.save(os.path.join(
                    UPLOAD_FOLDER_COVER_IMAGE, current_user_cover_image))
                current_user.cover_image = current_user_cover_image
                db.session.commit()
        else:
            current_user.cover_image = current_user.cover_image
            db.session.commit()
        current_user.Channel_name = request.form.get('Channel_name_new')
        current_user.email = request.form.get('email_new')
        db.session.commit()
        flash("account update", 'success')
    return render_template("youtube_admin_setting.html", current_channel=current_user, profile_image=profile_image)


@admin.route("/admin_change_password", methods=["GET", "POST"])
@login_required
def admin_change_password():
    profile_image = "/profile_image/"
    if request.method == 'POST':
        old_password = request.form.get('old_password')
        new_password = request.form.get('new_password')
        confirm_new_password = request.form.get('confirm_new_password')
        if check_password_hash(current_user.password, old_password):
            if new_password == confirm_new_password:
                hashed_password = generate_password_hash(
                    confirm_new_password, method='sha256')
                current_user.password = hashed_password
                db.session.commit()
                flash('password changed successfully', 'success')
                return redirect(url_for('admin.admin_change_password'))
            else:
                flash('new password does not match with confirm password', 'danger')
        else:
            flash('password wrong', 'danger')
    return render_template('youtube_admin_change_password.html', current_channel=current_user, profile_image=profile_image)


@admin.route("/admin_user_chart", methods=['GET', 'POST'])
@login_required
def admin_user_chart():
    user_chart_values = []
    user_chart_label = []
    profile_image = "/profile_image/"
    if request.method == 'POST':
        No_of_days = int(request.form.get('user_chart'))
        del user_chart_values[:]
        del user_chart_label[:]
        while No_of_days != 0:
            Channel_register_count = Channel.query.filter(Channel.joined_date == (
                date.today()+timedelta(days=1))-timedelta(days=No_of_days)).count()
            user_chart_values.append(Channel_register_count)
            user_chart_label.append(
                (date.today()+timedelta(days=1))-timedelta(days=No_of_days))
            No_of_days = No_of_days-1
        return render_template('youtube_admin_user_chart.html', current_channel=current_user, profile_image=profile_image, user_chart_values=user_chart_values, user_chart_label=user_chart_label, days=request.form.get('user_chart'))
    No_of_days = 7
    del user_chart_values[:]
    del user_chart_label[:]
    while No_of_days != 0:
        Channel_register_count = Channel.query.filter(Channel.joined_date == (
            date.today()+timedelta(days=1))-timedelta(days=No_of_days)).count()
        user_chart_values.append(Channel_register_count)
        user_chart_label.append(
            (date.today()+timedelta(days=1))-timedelta(days=No_of_days))
        No_of_days = No_of_days-1
    return render_template('youtube_admin_user_chart.html', current_channel=current_user, profile_image=profile_image, user_chart_values=user_chart_values, user_chart_label=user_chart_label, days=7)


@admin.route("/admin_video_chart", methods=['GET', 'POST'])
@login_required
def admin_video_chart():
    video_chart_values = []
    video_chart_label = []
    profile_image = "/profile_image/"
    if request.method == 'POST':
        No_of_days = int(request.form.get('video_chart'))
        del video_chart_values[:]
        del video_chart_label[:]
        while No_of_days != 0:
            Video_register_count = Video.query.filter(Video.upload_date == (
                date.today()+timedelta(days=1))-timedelta(days=No_of_days)).count()
            video_chart_values.append(Video_register_count)
            video_chart_label.append(
                (date.today()+timedelta(days=1))-timedelta(days=No_of_days))
            No_of_days = No_of_days-1
        return render_template('youtube_admin_video_chart.html', current_channel=current_user, profile_image=profile_image, video_chart_values=video_chart_values, video_chart_label=video_chart_label, days=request.form.get('video_chart'))
    No_of_days = 7
    del video_chart_values[:]
    del video_chart_label[:]
    while No_of_days != 0:
        Video_register_count = Video.query.filter(Video.upload_date == (
            date.today()+timedelta(days=1))-timedelta(days=No_of_days)).count()
        video_chart_values.append(Video_register_count)
        video_chart_label.append(
            (date.today()+timedelta(days=1))-timedelta(days=No_of_days))
        No_of_days = No_of_days-1
    return render_template('youtube_admin_video_chart.html', current_channel=current_user, profile_image=profile_image, video_chart_values=video_chart_values, video_chart_label=video_chart_label, days=7)
