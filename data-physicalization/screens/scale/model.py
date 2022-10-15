import threading

from lib.display import Display


class ScaleModel:
    def __init__(self, cell, on_change):
        self.cell = cell
        self.on_change = on_change
        self.is_running = True
        self.weight = 0
        self.thread = threading.Thread(target=self.thread_function, args=(lambda : self.is_running, on_change))
        self.thread.start()

    def cleanup(self):
        self.is_running = False
        self.thread.join()

    def thread_function(self, is_running, on_change):
        while is_running():
            weight = self.cell.get_weight()
            weight = round(weight)
            if self.weight != weight:
                self.weight = weight
                on_change(self, weight)
 