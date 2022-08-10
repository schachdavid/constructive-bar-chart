import time
import sys
from threading import Timer
from functools import reduce

from lib.util import get_error, get_percentages

from screens.game_feedback_flex.view import GameFeedbackView
from screens.game_feedback_flex.model import FieldModel

MIN_WEIGHT=61
MAX_WEIGHT=600
ERROR_TOLERANCE=3


class GameFeedbackFlexController:
    def __init__(self, cells, router, config):
        self.view = GameFeedbackView(config)
        self.config = config
        self.router = router
        self.fields = list(
            map(
                lambda i: FieldModel(
                    cells[i],
                    self.get_on_weight_change(i),
                ), 
                range(5)
            )
        )

        self.solved = False        
        self.solution = self.get_closest_solution()
        

        progress = self.get_progress()
        if progress > 0.99:
            self.solved = True
            self.on_solve()
        else:
            self.on_unsolve()

        self.view.draw_progress(progress)

    def get_current_weights(self):
        return [field.weight for field in self.fields]

    def get_closest_solution(self):
        solution_percentages = get_percentages([item["value"] for item in self.config["data"]])
        weight_sum = max(sum(self.get_current_weights()), 5 * MIN_WEIGHT)

        # redistribute weights to fit solution
        solution = [percentage * weight_sum for percentage in solution_percentages]
        print(weight_sum, solution)
        min_in_solution = min(solution)
        if min_in_solution > MIN_WEIGHT: 
            return solution
        
        increase_factor = MIN_WEIGHT/min_in_solution
        return [increase_factor * item for item in solution]    
        

    def get_progress(self):
        # TODO is this the right way to get progress? use same as in data vis
        error = max(get_error(self.solution, self.get_current_weights())[0], 0)
        return 1 - error/1
    
    def on_solve(self):
        for (i, field) in enumerate(self.fields):                    
            self.view.draw_solved_field(i)

    def on_unsolve(self):
        weights = self.get_current_weights()
        weight_sum = sum(weights)
        for (i, field) in enumerate(self.fields):
            current = weights[i]
            solution = self.solution[i]              
            self.view.draw_field(
                i,
                current,
                solution,
                abs(current-solution) <= ERROR_TOLERANCE
            )

    def get_on_weight_change(self, i):
        def on_weight_change(field, weight):            
            try:                 
                progress = self.get_progress()
                if self.solved and progress > 0.99:
                    return              
                elif progress <= 0.99 and self.solved:
                    self.solved = False
                    self.on_unsolve()

                solution = self.solution[i]
                self.view.draw_field(
                    i,
                    weight,
                    solution,
                    abs(weight-solution) <= ERROR_TOLERANCE
                )
                self.view.draw_progress(progress)

                if progress > 0.99:
                    self.solved = True
                    self.on_solve()
                    return

            except AttributeError:
               return
        return on_weight_change

    def cleanup(self, next_screen):        
        for field in self.fields:
            field.cleanup()
        self.view.cleanup()
