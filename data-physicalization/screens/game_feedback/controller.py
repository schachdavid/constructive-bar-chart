import time
import sys
from threading import Timer
from functools import reduce

from lib.keyboard import Keyboard

from screens.game_feedback.view import GameFeedbackView
from screens.game_feedback.model import FieldModel

def get_error(a,b):
    error_list = [abs(item_a-b[i]) for (i, item_a) in enumerate(a)]
    return (sum(error_list), error_list)

class GameFeedbackController:
    def __init__(self, cells, router, config):
        self.view = GameFeedbackView(config)
        self.config = config
        self.router = router
        self.last_field_ratio = [0,0,0,0,0]
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
        self.closest_solution = self.get_closest_solution()

        progress = self.get_progress()
        if progress > 0.99:
            self.solved = True
            self.on_solve()
        else:
            self.on_unsolve()

        self.view.draw_progress(progress)    
    
    def get_closest_solution(self):
        current_blocks = self.get_current_blocks()
        errors = [get_error(solution, current_blocks)[1] for solution in self.config["solutions"]]
        closest_solution = self.config["solutions"][min(range(len(errors)), key=errors.__getitem__)]
        return closest_solution

    def get_current_blocks(self):
        return [field.num_blocks for field in self.fields]

    def get_progress(self):       
        error = max(get_error(self.closest_solution, self.get_current_blocks())[0], 0)

        return 1 - error/sum(self.closest_solution)
    
    def on_solve(self):
        for (i, field) in enumerate(self.fields):                    
            self.view.draw_solved_field(i)

    def on_unsolve(self):
        current_blocks = self.get_current_blocks()
        for (i, field) in enumerate(self.fields):                    
            self.view.draw_field(
                i,
                current_blocks[i],
                self.closest_solution[i]
            )

    def get_on_weight_change(self, i):
        def on_weight_change(field, num_blocks):            
            try:                 
                progress = self.get_progress()
                if self.solved and progress > 0.99:
                    return              
                elif progress <= 0.99 and self.solved:
                    self.solved = False
                    self.on_unsolve()

                self.view.draw_field(
                    i,
                    num_blocks,
                    self.closest_solution[i],
                )
                self.view.draw_progress(progress)

                if progress > 0.99:
                    self.solved = True
                    self.on_solve()
                    return

            except AttributeError:
               return
        return on_weight_change

    def cleanup(self):
        for field in self.fields:
            field.cleanup()
        self.view.cleanup()


