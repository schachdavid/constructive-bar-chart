from lib.multiplexer import Multiplexer
from lib.display import Display
from lib.singleton import Singleton

@Singleton
class DisplayManager:
    def __init__(self):
        multiplexer = Multiplexer()
        self.main_display = Display(7, multiplexer)
        self.displays = list(
            map(lambda i: Display(i+1, multiplexer), range(5))
        )
    
    def clean_displays(self):
        for display in self.displays:
            display.cleanup()
