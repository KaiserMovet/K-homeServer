from flask import Flask
from flask_bootstrap import Bootstrap


app = Flask(__name__)

app.config['TEMPLATES_AUTO_RELOAD'] = True

bootstrap = Bootstrap(app)
from app import routes
