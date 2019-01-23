from flask_login import UserMixin, AnonymousUserMixin
from flask import current_app, request
from . import db, login_manager
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import hashlib
from markdown import markdown

# class Role(db.Model):
#     __tablename__ = 'roles'
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(64), unique=True)
#     users = db.relationship('User', backref='role', lazy='dynamic')
#
#     def __repr__(self):
#         return '<Role %r>' % self.name


class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(64), unique=True, index=True)
    username = db.Column(db.String(64), unique=True, index=True)
    password_hash = db.Column(db.String(128))
    name = db.Column(db.String(64))
    scopeglobals = db.relationship('ScopeGlobal', backref='owner', lazy='dynamic')

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def gravatar(self, size=100, default='identicon', rating='g'):
        if request.is_secure:
            url = 'https://secure.gravatar.com/avatar'
        else:
            url = 'http://www.gravatar.com/avatar'
        hash = hashlib.md5(self.email.encode('utf-8')).hexdigest()
        return '{url}/{hash}?s={size}&d={default}&r={rating}'.format(
            url=url, hash=hash, size=size, default=default, rating=rating)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class Scope(db.Model):
    """docstring for ScopeSet"""
    __tablename__ = 'scopes'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(64), unique=False)
    x_data_source = db.Column(db.String(64))
    y_data_source = db.Column(db.String(64))
    line_style = db.Column(db.Integer)
    line_color = db.Column(db.Integer)
    plot_position = db.Column(db.Integer)
    sglobal_id = db.Column(db.Integer, db.ForeignKey('scopeglobals.id'))


class ScopeGlobal(db.Model):
    __tablename__ = 'scopeglobals'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=False)
    column_num = db.Column(db.Integer)
    row_num = db.Column(db.Integer)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    scopes = db.relationship('Scope', backref='global', lazy='dynamic')


Line_Color = ["black", "blue", "green", "cyan", "grey", "brown", "violet", "orange", "red", "yellow"]

Line_Style = ["solid", "dashed", "dotted", "dashdot"]

img_prop = {'id': 1, 'title': 'I_p', 'x_data_source': '\\acq395_tm', 'y_data_source': '\\Ip', 'pixel': [0, 0],
            'line_style': 1, 'line_color': 1, 'x_range': [20, 80], 'y_range': [0, 0], 'x_offset': [0, 0],
            'y_offset': [0, 0], 'position': 0, }

img_ocean = {'id':1,'shot':1176, 'x_range': [0, 0],'y_range': [0, 0], 'pixel': [0, 0], 'x_offset': [0, 0],'y_offset': [0, 0]}



class OceanData(db.Model):
    __tablename__ = 'oceadata'
    id = db.Column(db.Integer, primary_key=True)
    shot_num = db.Column(db.Integer, unique=True, index=True)
    frames_num = db.Column(db.Integer)
    file_add = db.Column(db.String(256))
    int_time = db.Column(db.Integer)
