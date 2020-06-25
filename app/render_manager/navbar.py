from flask import render_template


class NavbarButton:
    def __init__(self, name, url):
        self.name = name
        self.url = url
    pass


class Navbar:
    NAVBAR_TEMPLATE = "common/navbar.html"
    NAVBAR_BUTTONS = [
        NavbarButton("Home", "admin"),
        NavbarButton("Internet Check", "ic_site"),
        NavbarButton("Where is my money", "wim_site_summary")

    ]

    @classmethod
    def render(cls, current_url=None):
        return render_template(cls.NAVBAR_TEMPLATE, buttons=cls.NAVBAR_BUTTONS,
                               current_url=current_url)
