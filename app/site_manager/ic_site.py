from .site import Site
import app.render_manager as rm
from flask import render_template, Markup
from app.objects.internet_check import LogCollection as ic_LogCollection
from app.objects.internet_speed import LogCollection as is_LogCollection


class IcSite(Site):

    MAIN = "sites/ic_site/main.html"
    INTERNET_SPEED = "sites/ic_site/internet_speed.html"
    INTERNET_STATUS = "sites/ic_site/internet_status.html"

    @classmethod
    def action(cls, log_path, speed_path):
        # internet status
        internet_status, data = cls.get_status_data(log_path)
        # speed status
        internet_speed, speed_data, log_date_list, log_download_list, \
            log_upload_list = cls.get_speed_data(speed_path)
        # last status
        last_status = cls.get_last_status(internet_status, internet_speed)
        # Render
        return cls.render(internet_status, data, speed_data,
                          log_date_list,
                          log_download_list, log_upload_list, last_status)

    @staticmethod
    def get_status_data(log_path):
        internet_status = ic_LogCollection(
            log_path)
        all_statistics = internet_status.get_statistics()
        month_statistics = \
            internet_status.get_collection_from_last_month().get_statistics()
        data = {'all': {}, "month": {}}
        data['all'] = all_statistics
        data['month'] = month_statistics
        return internet_status, data

    @staticmethod
    def get_speed_data(speed_path):
        internet_speed = is_LogCollection(speed_path)
        speed_data = {}
        speed_data["all"] = internet_speed.get_statistics()
        speed_data["month"] = \
            internet_speed.get_collection_from_last_month().get_statistics()
        log_date_list, log_download_list, log_upload_list = \
            internet_speed.get_data_str()
        return internet_speed, speed_data, log_date_list, log_download_list, \
            log_upload_list

    @staticmethod
    def get_last_status(internet_status, internet_speed):
        last_status = {}
        last_status["status"] = internet_status.logs[0].status
        last_status["download"] = internet_speed.logs[0].download
        last_status["upload"] = internet_speed.logs[0].upload
        return last_status

    @classmethod
    def render(cls, internet_status, data, speed_data, log_date_list,
               log_download_list, log_upload_list, last_status):

        internet_speed_content = Markup(render_template(
            cls.INTERNET_SPEED,
            speed_data=speed_data,
            log_date_list=log_date_list, log_download_list=log_download_list,
            log_upload_list=log_upload_list))

        internet_status_content = Markup(render_template(
            cls.INTERNET_STATUS,
            internet_status=internet_status, data=data))

        content = Markup(render_template(
            cls.MAIN, last_status=last_status,
            internet_status_content=internet_status_content,
            internet_speed_content=internet_speed_content, internet_status=internet_status[0]))
        return rm.base_render(content)
