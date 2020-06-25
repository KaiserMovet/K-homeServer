import json
import os
from app import app as mapp
from flask import redirect, request, render_template, Markup
# from app import render
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


@mapp.route("/wim/categories")
def wim_site_cat():
    return sm.WimSite.action("categories")


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


# wim
def check_token():
    token = get_config().TOKEN
    return request.cookies.get('token') == token

# get
@mapp.route("/api/wim/trans")
def api_wim_trans():
    if not check_token:
        return ""
    sheet_id = get_config().SHEET_ID
    return ""


@mapp.route("/api/wim/cat")
def api_wim_cat():
    if not check_token:
        return ""
    sheet_id = get_config().SHEET_ID
    res = Wim(sheet_id).get_cat()
    return json.dumps(res)


@mapp.route("/api/wim/cat_base")
def api_wim_cat_base():
    if not check_token:
        return ""
    sheet_id = get_config().SHEET_ID
    res = Wim(sheet_id).get_cat_base()
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
    Wim(sheet_id).edit_cat_of_target(target, cat)
    return ""
