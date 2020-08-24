
import os

from app import app as mapp

from app.objects.config_handler import get_config, set_path
from app.objects.internet_check import LogCollection as acLogCollection
from app.objects.internet_speed import LogCollection as isLogCollection
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
