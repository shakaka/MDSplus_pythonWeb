from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, TextAreaField,BooleanField,SelectField
from wtforms.validators import Required,Length,Email,Regexp
from ..models import User
from flask_pagedown.fields import PageDownField


class NameForm(FlaskForm):
	name = StringField('What is your name?', validators=[Required()])
	submit = SubmitField('Submit')

class EditProfileForm(FlaskForm):
	name = StringField('Real name', validators=[Length(0, 64)])
	submit = SubmitField('Submit')
