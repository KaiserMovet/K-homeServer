import os
from app import app as mapp
from flask import redirect, request, render_template, Markup
# from app import render
from app.objects.config_handler import get_config, set_path
from app.objects.internet_check import LogCollection

CONFIG = None


def load_config():
    ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
    config_path = os.path.join(ROOT_DIR, '../configuration.yml')
    set_path(config_path)


load_config()


@mapp.route("/")
def admin():
    conf = get_config()
    logs = LogCollection(conf.INTERNET_CHECK_LOG)
    log_template = Markup(render_template("objects/internetLog.html"))
    print(type(log_template))
    return render_template("base.html", LogCollection=logs, super_x=log_template)
