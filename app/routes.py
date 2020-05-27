import os
from app import app as mapp
from flask import redirect, request, render_template, Markup
# from app import render
from app.objects.config_handler import get_config, set_path
from app.objects.internet_check import LogCollection
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
    log_path = get_config().INTERNET_CHECK_LOG
    return sm.IcSite.action(log_path=log_path)
