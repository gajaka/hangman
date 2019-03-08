from database import database


class UserModel(database.Model):
    __tablename__ = 'users'

    id = database.Column(database.Integer, primary_key=True)
    username = database.Column(database.String(80))
    password = database.Column(database.String(80))
    puzzles = database.relationship('PuzzleModel', lazy='dynamic')

    def __init__(self, username, password):
        self.username = username
        self.password = password

    def to_json(self):
        return {
            'id': self.id,
            'username': self.username
        }

    def to_json_score(self):
        lst = [p.to_json().get('score') for p in self.puzzles.all()]
        return {
            'id': self.id,
            'username': self.username,
            'scores': lst,
            'total_score': sum(lst)  # reduce(add, lst, 0)  # fold_left
        }

    @classmethod
    def find_by_username(cls, username):
        return cls.query.filter_by(username=username).first()

    @classmethod
    def find_by_id(cls, user_id):
        return cls.query.filter_by(id=user_id).first()

    def save_to_db(self):
        database.session.add(self)
        database.session.commit()

    def update_to_db(self, pwd):
        self.password = pwd
        database.session.commit()

    def delete_from_db(self):
        database.session.delete(self)
        database.session.commit()
