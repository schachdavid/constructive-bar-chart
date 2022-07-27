import threading

import smbus2

class Multiplexer:
    def __init__(self, start = 0):
        self.current_port = None
        self.bus = smbus2.SMBus(1)
        self.lock = threading.Lock()

    def select(self, port):
        self.lock.acquire()        
        self.bus.write_byte(0x70, 1 << port)
        return self.lock.release
