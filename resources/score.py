from flask_restful import Resource
from models.user_model import UserModel
from flask_jwt_extended import (
    jwt_required
)


class Score(Resource):
    @jwt_required
    def post(self, user_id):
        user = UserModel.find_by_id(user_id)
        if user:
            return user.to_json_score()
        else:
            return {'message': "User with an user_id = {} does not exist.".format(user_id)}, 404
