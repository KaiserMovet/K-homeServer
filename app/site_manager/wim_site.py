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
    CATEGORIES = "sites/wim/categories.html"

    SIDEBAR_BUTTONS = [
        SideButton("Summary", "wim_site_summary"),
        SideButton("Categories", "wim_site_cat"),
    ]

    @classmethod
    def action(cls, site_name):
        sidebar = cls.SIDEBAR_BUTTONS
        site_template = ""
        if(site_name == "summary"):
            sidebar[0].active = True
            sidebar[1].active = False
            site_template = cls.SUMMARY

        elif(site_name == "categories"):
            sidebar[0].active = False
            sidebar[1].active = True
            site_template = cls.CATEGORIES

        # Render
        return cls.render(sidebar, site_template)

    @classmethod
    def render(cls, sidebar, site_template):

        subsite_content = Markup(render_template(site_template))

        content = Markup(render_template(
            cls.MAIN, sidebar=sidebar, subsite_content=subsite_content))
        return rm.base_render(content)