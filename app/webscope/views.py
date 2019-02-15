from datetime import datetime
from flask_wtf import FlaskForm
from flask import render_template, session, redirect, url_for, abort, flash, make_response, jsonify, request,current_app, g
from . import webscope
from .forms import NameForm, EditProfileForm
from .. import db
from flask_login import login_required, current_user
from ..models import User, db, Scope, ScopeGlobal, Line_Color, Line_Style, img_prop
from io import BytesIO as StringIO
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from MDSplus import *
import numpy as np
import matplotlib.pyplot as plt
import json
import copy
import matplotlib





# matplotlib.use('Agg')

@webscope.route('/', methods=['GET', 'POST'])
@login_required
def index():
    form = FlaskForm()
    return render_template('webscope/webscope.html', form=form)


@webscope.route('/get_global_id', methods=['GET'])
def get_global_id():
    if not 'global_id' in session:
        session['global_id'] = 1
    return jsonify(global_id=session.get('global_id'))


@webscope.route('/update_global_id', methods=['POST'])
def update_global_id():
    json_data = request.json
    session['global_id'] = json_data['global_id']
    return 'success'


@webscope.route('/getElements/<int:sglobal_id>', methods=['GET', 'POST'])
def getElements(sglobal_id):
    session['global_id'] = sglobal_id
    globalscope = ScopeGlobal.query.filter_by(id=sglobal_id).first()
    scopes = Scope.query.filter_by(sglobal_id=sglobal_id).order_by(Scope.plot_position).all()
    column_num = globalscope.column_num
    row_num = globalscope.row_num
    global img_list
    img_list = []
    session['img_list'] = img_list
    for i in range(row_num):
        for j in range(column_num):
            scope = scopes[i * column_num + j]
            _img_prop = copy.deepcopy(img_prop)
            _img_prop['id'] = scope.id
            _img_prop['title'] = scope.title
            _img_prop['x_data_source'] = scope.x_data_source
            _img_prop['y_data_source'] = scope.y_data_source
            _img_prop['position'] = scope.plot_position
            _img_prop['line_style'] = scope.line_style
            _img_prop['line_color'] = scope.line_color
            _img_prop['x_range'] = [0.5, 4]
            _img_prop['y_range'] = [1.5, 2.6]
            _img_prop['x_offset'] = [0, 0]
            _img_prop['y_offset'] = [0, 0]
            img_list.append(_img_prop)
            #print(_img_prop)
    session['img_list'] = img_list
    return jsonify(img_list_json=session['img_list'])


@webscope.route('/get_list', methods=['GET', 'POST'])
def get_list():
    #
    return jsonify(img_list_json=session.get('img_list'))


@webscope.route('/check_shot_num/<int:shot>', methods=['GET', 'POST'])
def check_shot_num(shot):
    shot_num = shot
    try:
        tree = Tree("acq2106_test", shot_num)
    except:
        return jsonify(check_shot_num=-1)
    else:
        if shot_num == 0:
            shot_num = conect.get('$shot')

    return jsonify(check_shot_num=shot_num)




@webscope.route('/dashboard', methods=['GET', 'POST'])
def dashboard():
    form = EditProfileForm()
    if form.validate_on_submit():
        name = form.name.data
        location = form.location.data
        about_me = form.about_me.data
        db.session.add(current_user)
        flash('Your profile has been updated.')
    return render_template('dashboard.html', form=form)


@webscope.route('/simple.png/<int:shot_num>', methods=['GET', 'POST'])
def Simple(shot_num):
    from io import BytesIO as StringIO

    from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
    # from MDSplus import *
    import numpy as np
    import matplotlib.pyplot as plt

    tree = Tree("acq2106_test", shot_num)
    # Tree.setTimeContext(None, None, 1E-4)
    Ip1 = tree.getNode("\\TOP.ACQ2106_2.AI:CH02").getData().data()
    Ip2 = tree.getNode("\\TOP.ACQ2106_2.AI:CH03").getData().data()
    # Ip3 = tree.getNode("\\TOP.ACQ2106_2.AI:CH02").getData().data()
    # Ip4 = tree.getNode("\\TOP.ACQ2106_2.AI:CH02").getData().data()
    # Ip5 = tree.getNode("\\TOP.ACQ2106_2.AI:CH02").getData().data()
    # Ip6 = tree.getNode("\\TOP.ACQ2106_2.AI:CH02").getData().data()




    hfont = {'fontname': 'Helvetica'}
    plt.figure()
    # conect = Connection("10.2.70.16")
    # conect.openTree('acq2106_test', shot_num)
    # Ip1 = conect.get("\\TOP.ACQ2106_2.AI:CH02").data()
    # Ip2 = conect.get("\\TOP.ACQ2106_2.AI:CH03").data()
    # Ip3 = conect.get("\\TOP.ACQ2106_2.AI:CH04").data()
    # Ip4 = conect.get("\\TOP.ACQ2106_2.AI:CH05").data()
    # Ip5 = conect.get("\\TOP.ACQ2106_2.AI:CH06").data()
    # Ip6 = conect.get("\\TOP.ACQ2106_2.AI:CH07").data()
    t = []
    for index in range(0,4000000):
        t.append(index*0.000001)



    fig = plt.figure(figsize=(5, 4), dpi=300, facecolor='b', edgecolor='r')
    fig.patch.set_facecolor('b')
    col = 1
    # plt.subplot(2,col,6)
    # plt.plot(t[0:len(Ip6)], Ip6, 'r-', linewidth=2.0)
    # plt.xlim((1, 4))
    # plt.ylim((0, 5))
    # plt.grid(b=True, which='major', axis='both', lw=0.5, linestyle='--', color='black', alpha=0.3)
    # plt.subplot(2,col,5)
    # plt.plot(t[0:len(Ip5)], Ip5, 'r-', linewidth=2.0)
    # plt.xlim((1, 4))
    # plt.ylim((0, 5))
    # plt.grid(b=True, which='major', axis='both', lw=0.5, linestyle='--', color='black', alpha=0.3)
    # plt.subplot(2,col,4)
    # plt.plot(t[0:len(Ip4)], Ip4, 'r-', linewidth=2.0)
    # plt.xlim((1, 4))
    # plt.ylim((0, 5))
    # plt.grid(b=True, which='major', axis='both', lw=0.5, linestyle='--', color='black', alpha=0.3)
    plt.subplot(2,col,1)
    plt.plot(t[0:len(Ip2)], Ip2, 'r-', linewidth=2.0)
    plt.xlim((0.5, 4))
    plt.ylim((1.5, 2.6))
    plt.grid(b=True, which='major', axis='both', lw=0.5, linestyle='--', color='black', alpha=0.3)
    plt.subplot(2,col,2)
    plt.plot(t[0:len(Ip1)], Ip1, 'r-', linewidth=2.0)
    plt.xlim((0.5, 4))
    plt.ylim((1.5, 2.6))
    plt.grid(b=True, which='major', axis='both', lw=0.5, linestyle='--', color='black', alpha=0.3)
    # plt.title(r'$I_p$(MA)', **hfont)
    # plt.subplot(2,col,3)
    # plt.plot(t[0:len(Ip2)], Ip2, 'r-', linewidth=2.0)
    # plt.title(r'$I_p$(MA)', **hfont)

    plt.tick_params(axis='both', which='major', labelsize=10)
    plt.subplots_adjust(left=0.1, right=0.9, top=0.9, bottom=0.1)
    # plt.xlim((0.5, 4))

    # ylim_min=min(Ip)-(max(Ip)-min(Ip))*0.05
    # ylim_max=max(Ip)+(max(Ip)-min(Ip))*0.05
    # ylim_min = 1.5
    # ylim_max = 2.6
    #
    # plt.ylim((ylim_min, ylim_max))
    # plt.grid(b=True, which='major', axis='both', lw=0.5, linestyle='--', color='black', alpha=0.3)
    #plt.grid(b=True, which='major', axis='both', lw=0.5, linestyle='--', color='black', alpha=0.3)
    # plt.show()

    canvas = FigureCanvas(fig)
    png_output = StringIO()
    canvas.print_png(png_output)
    # fig.savefig(png_output)
    # png_output.seek(0)
    response = make_response(png_output.getvalue())
    response.headers['Content-Type'] = 'image/png'
    plt.clf()
    plt.cla()
    plt.close(fig)
    return response


@webscope.route('/post_img/<int:img_id>', methods=['POST', 'GET'])
def post_img(img_id):
    json_data = request.json
    session['img_list'][img_id] = json_data
    #print(json_data)
    return jsonify(img_pixel=session['img_list'][img_id])


@webscope.route('/alert2flash/<flash_content>')
def alert2flash(flash_content):
    flash(flash_content)
    return 1


@webscope.route('/get_img/<int:shot>/<int:global_id>/<int:rand_time>/<int:img_id>', methods=['GET', 'POST'])
def get_img(shot, img_id, rand_time, global_id):
    if request.method == 'GET':
        _img_prop = session['img_list'][img_id]
        hfont = {'fontname': 'serif'}
        conect = Connection("10.2.70.16")
        conect.openTree('acq2106_test', shot)
        # print (conect.get('$shot'))
        y = conect.get(_img_prop['y_data_source']).data()
        # print len(y)
        # t = conect.get(_img_prop['x_data_source']).data()
        t = []
        for index in range(0,4000000):
            t.append(index*0.000001)


        # print len(t)
        fig = plt.figure(figsize=(_img_prop['pixel'][0] / 100.0, _img_prop['pixel'][1] / 100.0), dpi=100, facecolor='r',
                         edgecolor='r')
        # fig = plt.figure(figsize=(2.66,1.64),dpi=100,facecolor='b',edgecolor='r')
        fig.patch.set_facecolor('w')
        plt.plot(t[0:len(y)], y, color=Line_Color[_img_prop['line_color']],
                 linestyle=Line_Style[_img_prop['line_style']], linewidth=1.0)
        plt.title(r'$' + _img_prop['title'] + '$', **hfont)
        # print(_img_prop['title'])
        plt.tick_params(axis='both', which='major', labelsize=10)
        border_offset = [0.0, 0.0, 0.0, 0.0]
        if _img_prop['y_offset'] == [0, 0]:
            _img_prop['y_offset'] = [30, 30]
        border_offset[2] = 1.0 - _img_prop['y_offset'][0] / (_img_prop['pixel'][1] * 1.0)
        border_offset[3] = _img_prop['y_offset'][1] / (_img_prop['pixel'][1] * 1.0)
        if _img_prop['x_offset'] == [0, 0]:
            _img_prop['x_offset'] = [30, 20]
        # print _img_prop['pixel']
        # print 'done'
        border_offset[0] = _img_prop['x_offset'][0] / (_img_prop['pixel'][0] * 1.0)
        border_offset[1] = 1.0 - _img_prop['x_offset'][1] / (_img_prop['pixel'][0] * 1.0)

        plt.subplots_adjust(left=border_offset[0], right=border_offset[1], top=border_offset[2],
                            bottom=border_offset[3])
        plt.xlim((_img_prop['x_range'][0], _img_prop['x_range'][1]))

        if _img_prop['y_range'] == [0, 0]:
            _img_prop['y_range'] = [min(y) - (max(y) - min(y)) * 0.05, max(y) + (max(y) - min(y)) * 0.05]
        #print(_img_prop['y_range'])
        plt.ylim((_img_prop['y_range'][0], _img_prop['y_range'][1]))
        plt.grid(b=True, which='major', axis='both', lw=0.5, linestyle='--', color='black', alpha=0.3)
        # plt.show()
        canvas = FigureCanvas(fig)
        png_output = BytesIO()
        canvas.print_png(png_output)
        response = make_response(png_output.getvalue())
        response.headers['Content-Type'] = 'image/png'
        plt.clf()
        plt.cla()
        plt.close(fig)
        return response
