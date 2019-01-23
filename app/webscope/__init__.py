from flask import Blueprint
webscope = Blueprint('webscope', __name__)
from . import views, errors

