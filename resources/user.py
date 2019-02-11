from flask_restful import Resource, reqparse
from werkzeug.security import safe_str_cmp
from flask_jwt_extended import (
    create_access_token,
    jwt_required, get_raw_jwt
)
from models.user_model import UserModel
from invalid_token import invalid_token
from flask import session

user_parser = reqparse.RequestParser()

user_parser.add_argument('username',
                         type=str,
                         required=True,
                         help="Mandatory"
                         )
user_parser.add_argument('password',
                         type=str,
                         required=True,
                         help="Mandatory"
                         )


class UserRegister(Resource):

    def post(self):
        data = user_parser.parse_args()
        if safe_str_cmp(data['username'], "") or safe_str_cmp(data['password'], ""):
            return {'message': "Invalid input. Please try again"}, 400

        if UserModel.find_by_username(data['username']):
            return {'message': "Username already exists"}, 200
        user = UserModel(data['username'], data['password'])
        user.save_to_db()
        return {'message': "User has been created successfully"}, 201


class UserLogin(Resource):

    def post(self):
        data = user_parser.parse_args()
        user = UserModel.find_by_username(data['username'])
        if user and safe_str_cmp(user.password, data['password']):
            access_token = create_access_token(identity=user.id, fresh=True)
            session['access_token'] = access_token
            return {'access_token': access_token, 'message': "Successfully logged in"}, 200
        else:
            return {'message': "Invalid Credentials. Please try again"}, 401


class UserLogout(Resource):

    @jwt_required
    def post(self):
        jti = get_raw_jwt()['jti']
        invalid_token.add(jti)
        session.pop('access_token', None)
        return {'message': "Successfully logged out"}, 200


class User(Resource):
    """ This class is only for testing by Postman tool.
        User class is not needed as per task description.
    """

    @classmethod
    def get(cls, user_id: int):
        user = UserModel.find_by_id(user_id)
        if not user:
            return {'message': "User Not Found"}, 404
        return user.to_json(), 200

    @classmethod
    def delete(cls, user_id: int):
        user = UserModel.find_by_id(user_id)
        if not user:
            return {'message': "User Not Found"}, 404
        user.delete_from_db()
        return {'message': "User deleted"}, 200
