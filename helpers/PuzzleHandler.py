from collections import defaultdict
from flask import session, jsonify, make_response


class PuzzleHandler:

    @classmethod
    def create_dict(cls, word):
        # O(n) complexity
        dictionary = defaultdict(list)
        for i, key in enumerate(word):
            dictionary[key].append(i)
        session['dict'] = dictionary

    @classmethod
    def handle_puzzle(cls, old_puzzle, indices, key, threshold):
        if threshold == 5:
            return old_puzzle, False
        key_exists = False
        lst = old_puzzle.split()
        if key in lst:
            key_exists = True
            return old_puzzle, key_exists

        for i in indices:
            lst[i] = key
        return " ".join(lst), key_exists

    @classmethod
    def handle_score_threshold(cls, score, threshold, indices, key_exists, length):
        if threshold == 5:
            return score, threshold
        if (len(indices) == 0 or key_exists) and score < length:
            threshold += 1
        elif (len(indices) == 0 or key_exists) and score == length:
            score += 1
        else:
            score += len(indices)

        return score, threshold

    @classmethod
    def do_extract(cls, data, key):
        dictionary = defaultdict(str, session['dict'])
        score, threshold = data['score'], data['threshold']
        indices = dictionary[key]
        puzzle, key_exists = cls.handle_puzzle(data['puzzle'], indices, key, threshold)
        score, threshold = cls.handle_score_threshold(score, threshold,
                                                      indices, key_exists, len(puzzle.replace(" ", "")))
        return score, threshold, puzzle, key_exists

    @staticmethod
    def save_db_success(score, puzzle_score, threshold, puzzle):
        data = {'score': puzzle_score, 'threshold': threshold,
                'puzzle': puzzle, 'message': "Congrats!"}
        try:
            score.save_to_db()
        except:
            return make_response(jsonify(message=
                                         "An error occurred while inserting the item."), 500)

        return make_response(jsonify(data), 200)
