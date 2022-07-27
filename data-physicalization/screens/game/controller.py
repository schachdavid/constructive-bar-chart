import time
import sys
from threading import Timer
from functools import reduce

from lib.rotary_encoder import RotaryEncoder
from screens.game.view import GameView

class GameController:
    def __init__(self, router, config):
        self.view = GameView(config)
        self.view.draw_task()
        self.config = config
        self.router = router
        for i in range(5):
            self.view.draw_label(i)
        self.rotaryEncoder = RotaryEncoder(on_click=self.on_click)

    def on_click(self):
        self.router.push("GameFeedback", self.config)

    def cleanup(self):
        self.view.cleanup()
        self.rotaryEncoder.cleanup()
