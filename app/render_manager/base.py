from flask import render_template


class Base:
    BASE_TEMPLATE = "common/base.html"

    @classmethod
    def render(cls, navbar, content=""):
        return render_template(cls.BASE_TEMPLATE, navbar=navbar,
                               content=content)
