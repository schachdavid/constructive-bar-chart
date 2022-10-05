from PIL import ImageFont
from lib.draw_utils import draw_centered_text, get_font

from display_manager import DisplayManager

class View:
    def draw(self):
        def draw_function(draw, device):
            draw.rectangle([(0,0), (device.width, device.height)], fill='white')

        DisplayManager.instance().main_display.draw(draw_function)
        for i in range(5):
            DisplayManager.instance().displays[i].draw(draw_function)

    def cleanup(self): 
        pass
