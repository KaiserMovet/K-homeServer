from flask import render_template, request


class Base:
    BASE_TEMPLATE = "common/base.html"

    @staticmethod
    def get_theme(theme):
        themes = {
            "white": [
                'node_modules/bootstrap/dist/css/bootstrap.css',
            ],
            "dark": [
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
