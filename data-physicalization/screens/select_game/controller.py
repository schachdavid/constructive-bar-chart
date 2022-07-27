import time
import sys
from threading import Timer

from config import config
from screens.select_game.view import View

class SelectGameController:
    def __init__(self, router):
        self.view = View()
        self.router = router
        self.config = config
        self.view.draw()

    def cleanup(self):
        self.view.cleanup()
