import os
from app import app as mapp
from flask import redirect, request
# from app import render
from app.objects.config_handler import get_config, set_path

CONFIG = None


def load_config():
    ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
    config_path = os.path.join(ROOT_DIR, '../configuration.yml')
    set_path(config_path)


load_config()


@mapp.route("/")
def admin():
    get_config()
    return ""
