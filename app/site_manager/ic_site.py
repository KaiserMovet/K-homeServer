from .site import Site
import app.render_manager as rm
from flask import render_template, Markup
from app.objects.internet_check import LogCollection


class IcSite(Site):

    MAIN = "sites/ic_site/main.html"

    @classmethod
    def action(cls, log_path):
        # Logic
        log_collection = LogCollection(
            log_path)
        all_statistics = log_collection.get_statistics()
        month_statistics = \
            log_collection.get_collection_from_last_month().get_statistics()

        data = {'all': {}, "month": {}}
        data['all'] = all_statistics
        data['month'] = month_statistics

        # Render
        content = Markup(render_template(
            cls.MAIN, log_collection=log_collection, data=data))
        return rm.base_render(content)
