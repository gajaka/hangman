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

    @classmethod
    def find_by_id(cls, _id):
        return cls.query.filter_by(id=_id).first()

    @classmethod
    def find_all(cls):
        return cls.query.all()

    def save_to_db(self):
        database.session.add(self)
        database.session.commit()
