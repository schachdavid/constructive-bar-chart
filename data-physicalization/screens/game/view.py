

from lib.display import Display
from lib.multiplexer import Multiplexer
from lib.draw_utils import draw_centered_text, get_font, get_max_font, draw_check_mark, draw_chevron, draw_block
import textwrap
import math
from display_manager import dm

class GameView:
    def __init__(self, config):      
        self.config = config
        self.font, self.wrapped, self.max_len = self.get_font_and_wrapped()

    def draw_task(self):
        def draw_function(draw, device):
            font = get_font(22)
            draw_centered_text(device, draw, font, "Schätze", 2)
            draw_centered_text(device, draw, font, "die Daten", 30)

        dm.main_display.draw(draw_function)

    def get_font_and_wrapped(self):
        # get longest label
        max_len_total = len(max([field["label"]for field in self.config["data"]], key=len))
        max_len_row = 0
        wrapped = []
        for i, field in enumerate(self.config["data"]):
            rows = textwrap.wrap(field["label"], max_len_total//2.5, break_long_words=False)
            max_len_row = max(max_len_row, len(max(rows, key=len)))
            wrapped.append(rows)

        return get_max_font(dm.main_display.device.width, max_len_row), wrapped, max_len_row

    def draw_label(self, index):
        def draw_function(draw, device):
            label_rows = self.wrapped[index]
            h = draw.textsize("Xg", font=self.font)[1]
            baseline = len(label_rows) * -0.5 * h
            for i, row in enumerate(label_rows):
                y = device.height / 2  + baseline + i * h      
                draw_centered_text(device, draw, self.font, row, y)
        dm.displays[index].draw(draw_function)
    
    def cleanup(self): 
        pass    
