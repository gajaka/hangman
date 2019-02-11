from helpers.PuzzleHandler import PuzzleHandler
from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required
from models.puzzle_model import PuzzleModel
import random
from flask_jwt_extended import get_jwt_identity


class RandomChooser(Resource):
    @jwt_required
    def post(self):
        words = ["3dhubs", "marvin", "print",
                 "filament", "order", "layer"]
        word = random.choice(words)
        PuzzleHandler.create_dict(word)
        puzzle = " ".join(["_"] * len(word))
        return {'score': 0, 'threshold': 0, 'puzzle': puzzle}


class Puzzle(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('score',
                        type=int,
                        required=True,
                        help="Score field cannot be left empty."
                        )
    parser.add_argument('threshold',
                        type=int,
                        required=True,
                        help="Threshold field cannot be left empty."
                        )
    parser.add_argument('puzzle',
                        type=str,
                        required=True,
                        help="Puzzle field cannot be left empty."
                        )

    @jwt_required
    def post(self, key):
        data = self.parser.parse_args()
        puzzle_score, threshold, puzzle, key_exists = PuzzleHandler.do_extract(data, key)
        # threshold is reached
        if threshold == 5:
            return {'score': puzzle_score, 'threshold': threshold,
                    'puzzle': puzzle, 'message': "Game is over. Please choose or exit."}, 200

        len_stripped = len(puzzle.replace(" ", ""))

        success_condition = puzzle_score == len_stripped and \
                            threshold < 5 and not key_exists

        if puzzle_score > len_stripped:
            return {'score': puzzle_score - 1, 'threshold': threshold,
                    'puzzle': puzzle, 'message': "Game is over. Please choose or exit."}, 200

        if success_condition:
            user = get_jwt_identity()
            score = PuzzleModel(puzzle_score, user)
            return PuzzleHandler.save_db_success(score, puzzle_score, threshold, puzzle)

        elif threshold <= 5 and puzzle_score <= len_stripped:
            return {'score': puzzle_score, 'threshold': threshold, 'puzzle': puzzle}, 200

        else:
            return {'message': "Bad Request"}, 400
