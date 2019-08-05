from flask import Flask
from flask_dotenv import DotEnv

print("Initializing Skillsheet Backend")
app = Flask(__name__, static_folder='build/static', template_folder='build/')

env = DotEnv(app)

if app.config["DEBUG"]:
    app.debug = True
else:
    app.debug = False
