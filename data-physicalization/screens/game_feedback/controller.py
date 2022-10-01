import time
import sys
from threading import Timer
from functools import reduce

from lib.util import get_error

from screens.game_feedback.view import GameFeedbackView
from shared_models.field_model import FieldModel



class GameFeedbackController:
    def __init__(self, router, config, fields):
        self.view = GameFeedbackView(config)

        self.config = config
        self.router = router
        self.fields = fields       
        self.solved = False        
        self.closest_solution = self.get_closest_solution()
        print(self.closest_solution)
        for i, field in enumerate(fields):
            field.set_on_change(self.get_on_weight_change(i))
            field.set_sleep_time(0.08) # poll more frequently here

        progress = self.get_progress()
        if progress > 0.99:
            self.solved = True
            self.on_solve()
        else:
            self.on_unsolve()

        self.view.draw_progress(progress)    
    
    def get_closest_solution(self):
        current_blocks = self.get_current_blocks()
        errors = [get_error(solution, current_blocks)[0] for solution in self.config["solutions"]]
        print(errors)
        closest_solution = self.config["solutions"][min(range(len(errors)), key=errors.__getitem__)]
        return closest_solution

    def get_current_blocks(self):
        return [field.num_blocks for field in self.fields]

    def get_progress(self):        
        error = get_error(self.closest_solution, self.get_current_blocks())[0]
        print('error', error, self.closest_solution, self.get_current_blocks())
        return max(1 - error/sum(self.closest_solution), 0)
    
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
        def on_weight_change(num_blocks):            
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

    def cleanup(self, next_screen):        
        for field in self.fields:
            field.cleanup()
        self.view.cleanup()


