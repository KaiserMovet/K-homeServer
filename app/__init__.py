from flask import Flask
import yaml

with open('configuration.yml') as file:
    user_config = yaml.load(file, Loader=yaml.FullLoader)

app = Flask(__name__, instance_relative_config=False)

app.config['TEMPLATES_AUTO_RELOAD'] = True
app.secret_key = b'SECRET_KEY'
app.global_data = {}
app.config.update(user_config)
with app.app_context():
    # Import parts of our application
    from .internet_check import internet_check
    from .routes import main_bp

    # Register Blueprints
    app.register_blueprint(internet_check.ic_bp)
    app.register_blueprint(main_bp)
