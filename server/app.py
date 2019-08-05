from flask import Flask
from flask_dotenv import DotEnv

print("Initializing Skillsheet Backend")
app = Flask(__name__, static_folder='build')

env = DotEnv(app)

if app.config["DEBUG"]:
    app.debug = True
else:
    app.debug = False

# Routes
@app.route('/')
def root():
    return app.send_static_file('index.html')


@app.route('/<path:path>')
def static_proxy(path):
    # send_static_file will guess the correct MIME type
    try:
        return app.send_static_file(path)
    except:
        return app.send_static_file('index.html')
