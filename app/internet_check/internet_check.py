import os

from flask import Blueprint
from flask import current_app
from .objects.internet_check import LogCollection as acLogCollection
from .objects.internet_speed import LogCollection as isLogCollection
from .site_manager import IcSite


CONFIG = None

ic_bp = Blueprint("ic_bp", __name__,
                  template_folder="templates", static_folder='static',
                  static_url_path='/internet_check/static')


@ic_bp.route("/internet_check")
def ic_site():
    print(current_app.config)
    return IcSite.action()


# API
# Internet Check
@ic_bp.route("/api/internet_status")
def api_internet_status():
    log_path = current_app.config['internet_check_log']
    return acLogCollection(log_path).to_json()


@ic_bp.route("/api/internet_speed")
def api_internet_speed():
    log_path = current_app.config['internet_speed_log']
    return isLogCollection(log_path).to_json()
