import threading
import smbus2
from functools import total_ordering
from time import time

from lib.unique_priority_queue import UniquePriorityQueue

class Multiplexer:
    def __init__(self):
        self.current_port = None
        self.bus = smbus2.SMBus(1)
        self.queue = UniquePriorityQueue(lambda a, b: 0 if a.port == b.port else 1)
        self.is_running = True
        self.thread = threading.Thread(target=self.thread_function, args=(lambda : self.is_running,))
        self.thread.start()

    def switch_port(self, port):
        self.bus.write_byte(0x70, 1 << port)
        self.current_port = port

    def put(self, priority, port, action):
        '''
        Puts the given function into a queue to excecute if mux is available.

            Parameters:
                port (int): The port the mux has to switch to
                action (function): The function to excecute when port is selected
                priority (int): Determines the order of excecution, the lower the number the higher the priority
        '''
        self.queue.put((priority, Item(port, action)))

    def cleanup(self):
        self.is_running = False
        self.thread.join()     

    def thread_function(self, is_running):
        while is_running():
            item = self.queue.get()[1]
            if self.current_port != item.port:
                self.switch_port(item.port)

            # cancel action if there is a new item for the same port in the queue
            def should_cancel():
                return any(d[1].port == item.port for d in self.queue.queue)                
            
            item.action(should_cancel)


@total_ordering
class Item:
    def __init__(self, port, action):
        self.port = port
        self.action = action
        self.timestamp = time()

    def __eq__(self, other):       
        return self.timestamp == other.timestamp

    def __lt__(self, other):
        return self.timestamp < other.timestamp
