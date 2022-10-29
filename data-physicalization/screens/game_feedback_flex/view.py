from lib.display import Display
from lib.formatting import format_number_with_suffix
from lib.draw_utils import get_font_size, draw_block_with_number, draw_centered_text, get_font, get_bold_font, get_max_font, draw_check_mark, draw_spike
import textwrap
import math
from display_manager import DisplayManager


class GameFeedbackView:
    def __init__(self, config):       
        self.config = config
        self.wrapped, self.max_len = self.get_wrapped()
        self.wrapped_solved, self.max_len_solved  = self.get_wrapped(1.5)

    def draw_progress(self, progress):
        def draw_function(draw, device):
            bar_height = 20
            # draw.rectangle([0, 0, device.width-1, bar_height], outline="white")
            # draw.rectangle([0, 0, device.width * progress, bar_height], fill="white")
           
            text = str(int(progress*100)) + "%"
            font = get_font(14)
            # w = draw.textsize(text, font=font)[0]
            # available_space = device.width - device.width * progress
            # x = device.width * progress
            # fill = "white"
            # if w + 4 < available_space:
            #     x += 5
            # else:
            #     fill = "black"
            #     x -= w + 2
               

            # draw.text((x, 1), text, fill=fill, font=font)

            font = get_font(14)
            if progress >= 0.99:
                draw_centered_text(device, draw, font, "Super, alles", bar_height + 5)
                draw_centered_text(device, draw, font, "richtig!", bar_height + 21 )
            else:
                draw_centered_text(device, draw, font, "Korrigiere deine", bar_height + 5)
                draw_centered_text(device, draw, font, "Schätzung", bar_height + 21 )

        DisplayManager.instance().main_display.draw(draw_function)

    def get_wrapped(self, break_factor=2.5):
        # get longest label
        max_len_total = len(max([field["label"]for field in self.config["data"]], key=len))
        max_len_row = 0
        wrapped = []
        for i, field in enumerate(self.config["data"]):
            rows = textwrap.wrap(field["label"], max_len_total//break_factor, break_long_words=False)
            max_len_row = max(max_len_row, len(max(rows, key=len)))
            wrapped.append(rows)

        return wrapped, max_len_row

    def draw_solved_field(self, index):
        pass
        # def draw_function(draw, device):
        #     font_size = min([get_font_size(device.width, self.max_len), 15])
        #     font = get_font(font_size)            
        #     label_rows = self.wrapped_solved[index]
        #     h = draw.textsize("Xg", font=font)[1]
        #     for i, row in enumerate(label_rows):
        #         y = i * h
        #         draw_centered_text(device, draw, font, row, y)

        #     formatted_number = format_number_with_suffix(self.config["data"][index]["value"], short=True)
        #     unit = self.config["unit"]
        #     text = f"{formatted_number} {unit}"

        #     font_size = min([get_font_size(device.width, len(text)), 15])            
        #     font = get_font(font_size)
        #     draw_centered_text(device, draw, font, text, device.height - 20)

        # DisplayManager.instance().displays[index].draw(draw_function)

    def draw_field(self, index, current, solution, is_valid):
        def draw_function(draw, device):
            font = get_max_font(device.width-40, self.max_len)
            label_rows = self.wrapped[index]
            h = draw.textsize("Xg", font=font)[1]
            baseline = len(label_rows) * -0.5 * h
            for i, row in enumerate(label_rows):
                y = device.height / 2  + baseline + i * h      
                draw.text((40, y), row, fill="white", font=font)

            if is_valid:
                draw_check_mark(draw, 16, device.height//2, 32)
                return

            spike_height = (solution - current)/10
            draw_spike(draw, 16, device.height//2 , 26, spike_height)   

        DisplayManager.instance().displays[index].draw(draw_function)

    
    def cleanup(self):
        pass
