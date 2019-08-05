from flask import Blueprint
from flask_restful import Api, Resource, reqparse
from server.app import app
from server.controllers.gsheets import queryUsers, queryData
import requests
import json

# NOTE: all the following resources by default start with '/api/v1' so there's
# no need to specify that

USERS = queryUsers()
DATA = queryData()


class HelloWorld(Resource):
    def get(self):
        return {'success': False, 'message': "Please use post requests"}

    def post(self):
        return {'success': True}


class Refresh(Resource):
    def post(self):
        global USERS
        global DATA
        USERS = queryUsers()
        DATA = queryData()
        return {'success': True}


userParser = reqparse.RequestParser(bundle_errors=True)
userParser.add_argument(
    'email', type=str, help='Email cannot be blank', required=True)
userParser.add_argument('uid', type=str, required=True)
userParser.add_argument('token', type=str, required=True)


class Users(Resource):
    def post(self):
        global USERS
        global DATA
        data = userParser.parse_args()
        email = data['email']
        # since this is serverside we want to also make sure that the callbackurl is correct!
        PARAMS = {
            "email": email,
            "id": data['uid'],
            "token": data['token'],
            "callback": app.config["REACT_APP_CALLBACKURL"]
        }
        r = requests.post(
            url="https://dopeauth.com/api/v1/site/verify", params=PARAMS)
        data = r.json()
        # Validated user
        if "success" in data and data["success"]:
            if (email not in USERS):
                return {'success': False, 'error': 'User not authorized.'}
            # Email is authed
            return {'success': True, 'users': DATA}
        return {'success': False, 'error': "User can't be verified. Try logging out first. "}


# Blueprint for /api/v1 requests
api = Api(Blueprint('api', __name__))

# Endpoint registration
api.add_resource(HelloWorld, '')
api.add_resource(Refresh, '/refresh/' + app.config["GSHEETS_REFRESH_KEY"])
api.add_resource(Users, '/users')
