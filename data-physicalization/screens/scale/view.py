from lib.draw_utils import get_font, draw_centered_text
from display_manager import DisplayManager


class ScaleView:
    def draw_field(self, index, current):
        def draw_function(draw, device):
            font = get_font(20)
            draw_centered_text(device, draw, font, f"{current}", 10)


        DisplayManager.instance().displays[index].draw(draw_function)

    
    def cleanup(self):
        pass
