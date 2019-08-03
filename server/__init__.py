from flask import Flask
from flask_restful import Api
import sys

print("Initializing Checkin Backend")
app = Flask(__name__, static_folder='build/static', template_folder='build/')

if len(sys.argv) == 1:
    app.debug = True
    app.config.from_object('config.Config')
else:
    print("Starting production server")
    app.debug = False
    app.config.from_object('config.ProductionConfig')


# Database
from flask_sqlalchemy import SQLAlchemy

# Database
db = SQLAlchemy(app)

# from server.controllers.controller import Controller
# controller = Controller(db)
# from server.models import *


from server.api.v1.api import api

app.register_blueprint(api.blueprint, url_prefix='/api/v1')
