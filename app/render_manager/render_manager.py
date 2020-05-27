from flask import render_template, Markup
from .navbar import Navbar
from .base import Base


def base_render(content="", current_url=None):
    navbar = Markup(Navbar.render(current_url))
    base = Base.render(navbar, content)
    return base


def main_site():
    return Markup(base_render())
