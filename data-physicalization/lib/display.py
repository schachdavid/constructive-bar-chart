from luma.core.interface.serial import i2c
from luma.oled.device import ssd1306
from luma.core.render import canvas


class Display:
    def __init__(self, port, multiplexer):        
        self.port = port  
        self.multiplexer = multiplexer      
        release = self.multiplexer.select(self.port)
        self.device = ssd1306(serial=i2c(bus=self.multiplexer.bus, address=0x3C))
        self.device.clear()
        release()

    def draw(self, draw_function):
        release = self.multiplexer.select(self.port)
        with canvas(self.device) as draw:
            draw_function(draw, self.device)
        release()

    def cleanup(self):
        release = self.multiplexer.select(self.port)
        self.device.clear()
        release()
