from flask import Blueprint
from flask_restful import Api, Resource

# NOTE: all the following resources by default start with '/api/v1' so there's
# no need to specify that

class HelloWorld(Resource):
    def post(self):
        return {'status': True}


# Blueprint for /api/v1 requests
api = Api(Blueprint('api', __name__))

# Endpoint registration
api.add_resource(HelloWorld, '')

# TODO(kevinfang): add cors policy
