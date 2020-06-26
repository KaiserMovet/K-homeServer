import json
import os
import threading
from app import app as mapp
from flask import redirect, request, render_template, Markup, flash

from app.objects.config_handler import get_config, set_path
from app.objects.internet_check import LogCollection as acLogCollection
from app.objects.internet_speed import LogCollection as isLogCollection
from app.objects.where_is_my_money2 import Wim
import app.render_manager as rm
import app.site_manager as sm

CONFIG = None


def load_config():
    ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
    config_path = os.path.join(ROOT_DIR, '../configuration.yml')
    set_path(config_path)


def get_google_sem():
    if "google_sem" not in mapp.global_data:
        mapp.global_data["google_sem"] = threading.Semaphore()
    return mapp.global_data["google_sem"]


load_config()


@mapp.route("/")
def admin():
    return rm.main_site()


@mapp.route("/internet_check")
def ic_site():
    return sm.IcSite.action()


@mapp.route("/wim/summary")
def wim_site_summary():
    return sm.WimSite.action("summary")


@mapp.route("/wim/yearly")
def wim_site_yearly():
    return sm.WimSite.action("yearly")


@mapp.route("/wim/categories")
def wim_site_cat():
    return sm.WimSite.action("categories")


@mapp.route("/wim/upload", methods=['GET', 'POST'])
def wim_site_upload():
    if not check_token:
        return ""
    if request.method == 'POST':
        if 'myfile' not in request.files:
            return redirect(request.url)
        file = request.files['myfile']
        if file.filename == '':
            return redirect(request.url)
        file.save(os.path.join(*mapp.config['UPLOAD_FOLDER']))
        sheet_id = get_config().SHEET_ID
        wim = Wim(sheet_id, get_google_sem())
        wim.parseAndSaveToDataBase(os.path.join(*mapp.config['UPLOAD_FOLDER']))
        os.remove(os.path.join(*mapp.config['UPLOAD_FOLDER']))
    return sm.WimSite.upload()

# API
# Internet Check
@mapp.route("/api/internet_status")
def api_internet_status():
    log_path = get_config().INTERNET_CHECK_LOG
    return acLogCollection(log_path).to_json()


@mapp.route("/api/internet_speed")
def api_internet_speed():
    log_path = get_config().INTERNET_SPEED_LOG
    return isLogCollection(log_path).to_json()


# Wim
def check_token():
    token = get_config().TOKEN
    return request.cookies.get('token') == token

# get
@mapp.route("/api/wim/trans", methods=['GET', 'POST'])
def api_wim_trans():
    if not check_token:
        return ""
    sheet_id = get_config().SHEET_ID
    body = request.get_json()
    year = body.get("year", "")
    month = body.get("month", "")
    res = Wim(sheet_id, get_google_sem()).get_transactions(year, month)
    res_list = [trans.toDict() for trans in res]
    return json.dumps(res_list)


@mapp.route("/api/wim/cat")
def api_wim_cat():
    if not check_token:
        return ""
    sheet_id = get_config().SHEET_ID
    res = Wim(sheet_id, get_google_sem()).get_cat()
    return json.dumps(res)


@mapp.route("/api/wim/cat_base")
def api_wim_cat_base():
    if not check_token:
        return ""
    sheet_id = get_config().SHEET_ID
    res = Wim(sheet_id, get_google_sem()).get_cat_base()
    return json.dumps(res)


@mapp.route("/api/wim/trans/border_dates")
def api_wim_trans_border_dates():
    if not check_token:
        return ""
    sheet_id = get_config().SHEET_ID
    res = Wim(sheet_id, get_google_sem()).get_trans_border_dates()
    return json.dumps(res)

# edit
@mapp.route("/api/wim/edit/cat_base", methods=['POST'])
def api_wim_edt_cat_base():
    if not check_token:
        return ""
    sheet_id = get_config().SHEET_ID
    body = request.get_json()
    target = body["target"]
    cat = body["cat"]
    Wim(sheet_id, get_google_sem()).edit_cat_of_target(target, cat)
    return ""
