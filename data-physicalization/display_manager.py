from lib.multiplexer import Multiplexer
from lib.display import Display

class DisplayManager:
    def __init__(self, ):
        multiplexer = Multiplexer()
        self.displays = list(
            map(lambda i: Display(i+1, multiplexer), range(5))
        )
        self.main_display = Display(7, multiplexer)
    
    def clean_displays(self):
        for display in self.displays:
            display.cleanup()

dm = DisplayManager()