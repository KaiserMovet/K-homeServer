import app.render_manager as rm
from flask import render_template, Markup


class SideButton:
    def __init__(self, name, url):
        self.name = name
        self.url = url
        self.active = False
    pass


class WimSite:

    MAIN = "sites/wim/main.html"
    SUMMARY = "sites/wim/summary.html"
    YEARLY = "sites/wim/yearly.html"
    CATEGORIES = "sites/wim/categories.html"
    UPLOAD = "sites/wim/upload.html"

    SIDEBAR_BUTTONS = [
        SideButton("Monthly", "wim_site_summary"),
        SideButton("Yearly", "wim_site_yearly"),
        SideButton("Categories", "wim_site_cat"),
        SideButton("Upload", "wim_site_upload"),
    ]

    @classmethod
    def upload(cls):
        sidebar = cls.SIDEBAR_BUTTONS
        site_template = ""
        sidebar[0].active = False
        sidebar[1].active = False
        sidebar[2].active = False
        sidebar[3].active = True
        site_template = cls.UPLOAD
        return cls.render(sidebar, site_template)

    @classmethod
    def action(cls, site_name):
        sidebar = cls.SIDEBAR_BUTTONS
        site_template = ""
        if(site_name == "summary"):
            sidebar[0].active = True
            sidebar[1].active = False
            sidebar[2].active = False
            sidebar[3].active = False
            site_template = cls.SUMMARY

        elif(site_name == "categories"):
            sidebar[0].active = False
            sidebar[1].active = False
            sidebar[2].active = True
            sidebar[3].active = False
            site_template = cls.CATEGORIES

        elif(site_name == "yearly"):
            sidebar[0].active = False
            sidebar[1].active = True
            sidebar[2].active = False
            sidebar[3].active = False
            site_template = cls.YEARLY

        # Render
        return cls.render(sidebar, site_template)

    @classmethod
    def render(cls, sidebar, site_template):

        subsite_content = Markup(render_template(site_template))

        content = Markup(render_template(
            cls.MAIN, sidebar=sidebar, subsite_content=subsite_content))
        return rm.base_render(content)
