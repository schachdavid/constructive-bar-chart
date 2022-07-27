from PIL import ImageFont
from lib.draw_utils import draw_centered_text, get_font

from display_manager import dm

class View:
    def draw(self):
        def draw_function(draw, device):
            font = get_font(19)
            draw_centered_text(device, draw,font, "Wähle einen", 2)
            draw_centered_text(device, draw, font, "Datensatz", 30)
     
        dm.main_display.draw(draw_function)

    def cleanup(self): 
        dm.main_display.cleanup()      
