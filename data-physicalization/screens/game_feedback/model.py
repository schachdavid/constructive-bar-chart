import threading
from time import sleep

from lib.display import Display
from lib.util import timing

BLOCK_WEIGHT = 23

class FieldModel:
    def __init__(self, cell, on_change):
        self.cell = cell
        self.on_change = on_change
        self.num_blocks = 0  
        self.is_running = True
        self.thread = threading.Thread(target=self.thread_function, args=(lambda : self.is_running, on_change))
        self.thread.start()

    def cleanup(self):
        self.is_running = False
        self.thread.join()

    def thread_function(self, is_running, on_change):
        while is_running():
            sleep(0.08)
            weight = self.cell.get_weight()
            num_blocks = round(weight / BLOCK_WEIGHT)
            if self.num_blocks != num_blocks:
                self.num_blocks = num_blocks
                on_change(num_blocks)

 