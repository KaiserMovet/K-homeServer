from .site import Site
import app.render_manager as rm


class MainSite(Site):

    @staticmethod
    def action(**kwargs):
        return rm.main_site()
