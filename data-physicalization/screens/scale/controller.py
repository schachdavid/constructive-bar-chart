import time
import sys
from threading import Timer
from functools import reduce

from lib.util import get_error, get_percentages

from screens.scale.view import ScaleView
from screens.scale.model import ScaleModel

class ScaleController:
    def __init__(self, cells, router):
        self.view = ScaleView()
        self.router = router
        print("drawing")
        self.fields = list(
            map(
                lambda i: ScaleModel(
                    cells[i],
                    self.get_on_weight_change(i),
                ), 
                range(5)
            )
        )

    def get_on_weight_change(self, i):
        def on_weight_change(field, weight):            
            try:
                self.view.draw_field(
                    i,
                    weight,
                )
                
            except AttributeError:
               return
        return on_weight_change

    def cleanup(self, next_screen):        
        for field in self.fields:
            field.cleanup()
        self.view.cleanup()
