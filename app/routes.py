from flask import Blueprint

from .site_manager import MainSite


main_bp = Blueprint("main_bp", __name__,
                    template_folder="templates", static_folder='static')


@main_bp.route("/")
def admin():
    return MainSite.action()
