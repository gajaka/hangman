from database import database


class PuzzleModel(database.Model):
    __tablename__ = 'scores'

    id = database.Column(database.Integer, primary_key=True)
    score = database.Column(database.Integer)

    user_id = database.Column(database.Integer, database.ForeignKey('users.id'))
    user = database.relationship('UserModel')

    def __init__(self, score, user_id):
        self.score = score
        self.user_id = user_id

    def to_json(self):
        return {
            'id': self.user_id,
            'score': self.score
        }

    @classmethod
    def find_by_id(cls, _id):
        return cls.query.filter_by(id=_id).first()

    @classmethod
    def find_all_by_id(cls, _user_id):
        return cls.query.filter_by(user_id=_user_id)

    @classmethod
    def find_all(cls):
        return cls.query.all()

    def save_to_db(self):
        database.session.add(self)
        database.session.commit()
