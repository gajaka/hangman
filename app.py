from flask import Flask, jsonify, render_template, redirect, url_for, make_response, session
from flask_restful import Api
from flask_jwt_extended import JWTManager
from database import database
from resources.user import UserRegister, UserLogin, UserLogout, User
from resources.puzzle import Puzzle, RandomChooser
from resources.score import Score
from invalid_token import invalid_token
from os import urandom

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///hangman.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['PROPAGATE_EXCEPTIONS'] = True
app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access']
app.secret_key = urandom(24)

api = Api(app)

app.config['JWT_SECRET_KEY'] = urandom(24)
jwt = JWTManager(app)


@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decoded_token):
    return decoded_token['jti'] in invalid_token


@jwt.unauthorized_loader
def missing_token_callback(error):
    return jsonify({
        "description": "Request does not contain an access token.",
        'error': 'authorization_required'
    }), 401


@app.before_first_request
def create_tables():
    database.create_all()


user_routes = [
    '/user/<int:user_id>',
    '/deluser/<int:user_id>'
]

api.add_resource(UserRegister, '/register')
api.add_resource(UserLogin, '/login')
api.add_resource(User, *user_routes)
api.add_resource(UserLogout, '/logout')
api.add_resource(RandomChooser, '/choose')
api.add_resource(Puzzle, '/puzzle/<string:key>')
api.add_resource(Score, '/score/<string:user_id>')


@app.route('/')
def index():
    return redirect(url_for('login'))


@app.route('/register')
def register():
    return render_template('register.html')


@app.route('/login', methods=['GET'])
def login():
    return render_template('login.html')


@app.route('/choose', methods=['GET'])
def choose():
    resp = make_response(render_template('puzzle.html'))
    resp.headers.set('Authorisation', "Bearer " + session['access_token'])
    return resp


if __name__ == '__main__':
    database.init_app(app)
    app.run(port=5000, debug=True)
