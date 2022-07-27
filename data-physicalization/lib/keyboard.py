from pirc522 import RFID
from time import sleep
import RPi.GPIO as GPIO
import threading
import weakref
import sys

class Keyboard:
    def __init__(self, config, on_key_press=lambda x: None):
        print(f"Keyboard is getting created: {config}")
        self.config = config
        self.is_running = True
        self.thread = threading.Thread(target=thread_function, args=(lambda : self.is_running, on_key_press))
        self.thread.start()

    def cleanup(self):
        self.is_running = False
    
    def __del__(self):
        print(f"Keyboard is getting deleted: {self.config}")

def thread_function(is_running, on_key_press):
    while is_running():
        print("is_running", is_running())
        # x = input()
        for line in sys.stdin:
            print(line)

        # on_key_press()


