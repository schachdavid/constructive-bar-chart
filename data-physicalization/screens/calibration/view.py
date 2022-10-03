from PIL import ImageFont
from lib.draw_utils import draw_centered_text, get_font

from display_manager import dm

class CalibrationView:
    def draw_configuration_level(self, configuration_level):
        def draw_function(draw, device):
            font = get_font(12)
            sm_font = get_font(10)
            if configuration_level == 0: # reset reference units

                draw_centered_text(device, draw, font, "Entferne", 4)
                draw_centered_text(device, draw, font, "alle Blöcke.", 22)
                draw_centered_text(device, draw, font, "Drücke Button.", 40)
            if configuration_level == 1: # reset reference units
                draw_centered_text(device, draw, sm_font, "Platziere großen", 4)
                draw_centered_text(device, draw, sm_font, "Block auf jedem Feld.", 22)
                draw_centered_text(device, draw, sm_font, "Drücke Button.", 40)

            if configuration_level == 2: # final tare and persist
                draw_centered_text(device, draw, font, "Entferne", 4)
                draw_centered_text(device, draw, font, "alle Blöcke.", 22)
                draw_centered_text(device, draw, font, "Drücke Button.", 40)
            
            if configuration_level == 3: # finish message
                draw_centered_text(device, draw, font, "Erfolgreich", 4)
                draw_centered_text(device, draw, font, "kalibriert.", 22)
                draw_centered_text(device, draw, font, "Entferne RFID-Tag.", 40)
        dm.main_display.draw(draw_function)
    
    def draw_loading_indicator(self, configuration_level):
        def draw_function(draw, device):
            text = "kalibriere..."
            if configuration_level == 0 or configuration_level == 2:
                text = "tariere..."
            draw_centered_text(device, draw, get_font(15), text)
        dm.main_display.draw(draw_function)

    def cleanup(self): 
        pass
