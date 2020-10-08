# from flask import current_app
import app.render_manager as rm


class MainSite():

    @staticmethod
    def action(**kwargs):
        return rm.main_site()
