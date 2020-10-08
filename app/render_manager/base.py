from flask import render_template, request


class Base:
    BASE_TEMPLATE = "base.html"

    @staticmethod
    def get_theme(theme):
        themes = {
            "white": [
                'theme/ccolors.css',
                'node_modules/bootstrap/dist/css/bootstrap.css',
            ],
            "dark": [
                'theme/ccolors.css',
                'node_modules/bootstrap/dist/css/bootstrap.css',
                'node_modules/bootswatch/dist/darkly/bootstrap.css',
                'theme/darkly.css'],

        }
        return themes.get(theme, [])

    @classmethod
    def render(cls, navbar, content=""):
        theme = request.cookies.get('theme') or "white"
        theme_css = cls.get_theme(theme)
        return render_template(cls.BASE_TEMPLATE, navbar=navbar,
                               content=content, theme_css=theme_css)
