from .site import Site
import app.render_manager as rm
from flask import render_template, Markup
from app.objects.internet_check import LogCollection as ic_LogCollection
from app.objects.internet_speed import LogCollection as is_LogCollection


class IcSite(Site):

    MAIN = "sites/ic_site/main.html"

    @classmethod
    def action(cls, log_path, speed_path):
        # Logic
        # internet status
        internet_status = ic_LogCollection(
            log_path)
        all_statistics = internet_status.get_statistics()
        month_statistics = \
            internet_status.get_collection_from_last_month().get_statistics()

        data = {'all': {}, "month": {}}
        data['all'] = all_statistics
        data['month'] = month_statistics
        # speed status
        internet_speed = is_LogCollection(speed_path)
        speed_data = {}
        speed_data["all"] = internet_speed.get_statistics()
        speed_data["month"] = \
            internet_speed.get_collection_from_last_month().get_statistics()
        log_date_list, log_download_list, log_upload_list = \
            internet_speed.get_data_str()
        # last status
        last_status = {}
        last_status["status"] = internet_status.logs[0].status
        last_status["download"] = internet_speed.logs[0].download
        last_status["upload"] = internet_speed.logs[0].upload

        # Render
        content = Markup(render_template(
            cls.MAIN, internet_status=internet_status, data=data,
            speed_data=speed_data,
            log_date_list=log_date_list, log_download_list=log_download_list,
            log_upload_list=log_upload_list, last_status=last_status))
        return rm.base_render(content)
