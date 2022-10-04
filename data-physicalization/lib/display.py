from luma.core.interface.serial import i2c
from luma.oled.device import ssd1306
from luma.core.render import canvas

class Display:
    def __init__(self, port, multiplexer):        
        self.port = port  
        self.multiplexer = multiplexer      
        self.multiplexer.put(1, self.port, lambda : self.init_using_mux())

    def init_using_mux(self):
        self.device = ssd1306(serial=i2c(bus=self.multiplexer.bus, address=0x3C))
        self.device.clear()

    def draw(self, draw_function):
        self.multiplexer.put(
            2 if self.port == 7 else 1, 
            self.port, 
            lambda : self.draw_using_mux(draw_function)
        )

    def draw_using_mux(self, draw_function):
        with canvas(self.device) as draw:
            draw_function(draw, self.device)

    def cleanup(self):
        self.multiplexer.put(1, self.port, lambda : self.device.clear())        
