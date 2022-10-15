from luma.core.interface.serial import i2c
from luma.oled.device import ssd1306
from lib.canvas import canvas

class Display:
    def __init__(self, port, multiplexer):        
        self.port = port  
        self.multiplexer = multiplexer      
        self.multiplexer.put(1, self.port, lambda should_cancel: self.init_using_mux())

        while not hasattr(self, 'device'):
            pass

    def init_using_mux(self):
        self.device = ssd1306(serial=i2c(bus=self.multiplexer.bus, address=0x3C))
        self.device.clear()

    def draw(self, draw_function):
       
        self.multiplexer.put(
            2 if self.port == 7 else 1, 
            self.port, 
            lambda should_cancel: self.draw_using_mux(draw_function, should_cancel)
        )

    def draw_using_mux(self, draw_function, should_cancel):
        with canvas(self.device, should_cancel) as draw:
            draw_function(draw, self.device)

            

    def cleanup(self):
        self.multiplexer.put(1, self.port, lambda should_cancel: self.device.clear())        
