import time
import sys
from threading import Timer
from functools import reduce

from lib.rotary_encoder import RotaryEncoder
from screens.game.view import GameView
from shared_models.field_model import FieldModel

class GameController:
    def __init__(self, cells, router, config):
        self.view = GameView(config)
        self.view.draw_task()
        self.config = config
        self.router = router

        for i in range(5):
            self.view.draw_label(i)

        # create fields already during Game and pass to GameFeedback later to have the weight immediately   
        self.fields = list(
            map(
                lambda i: FieldModel(cells[i]), 
                range(5)
            )
        )

        self.rotaryEncoder = RotaryEncoder(on_click=self.on_click)

    def on_click(self):       
        if getattr(self.config, "flex", False):
            self.router.push("GameFeedbackFlex", self.config)
        else:
            self.router.push("GameFeedback", self.config, self.fields)

    def cleanup(self):
        self.view.cleanup()
        self.rotaryEncoder.cleanup()
