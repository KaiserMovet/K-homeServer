import app.render_manager as rm
from flask import render_template, Markup


class IcSite():

    MAIN = "sites/ic_site/main.html"
    INTERNET_SPEED = "sites/ic_site/internet_speed.html"
    INTERNET_STATUS = "sites/ic_site/internet_status.html"

    @classmethod
    def action(cls):
        # Render
        return cls.render()

    @classmethod
    def render(cls):

        internet_speed_content = Markup(render_template(
            cls.INTERNET_SPEED))

        internet_status_content = Markup(render_template(
            cls.INTERNET_STATUS))

        content = Markup(render_template(
            cls.MAIN,
            internet_status_content=internet_status_content,
            internet_speed_content=internet_speed_content))
        return rm.base_render(content)
