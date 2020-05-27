from flask import Flask


app = Flask(__name__)

app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['SERVER_NAME'] = "localhost:5000"

from app import routes
