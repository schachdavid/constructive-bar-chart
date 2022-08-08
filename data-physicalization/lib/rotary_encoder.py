import RPi.GPIO as GPIO
import threading
from time import sleep

class RotaryEncoder:
    def __init__(self, on_click=lambda x: None, on_left=lambda x: None, on_right=lambda x: None):
        self.is_running = True
        self.thread = threading.Thread(target=thread_function, args=(lambda : self.is_running, on_click, on_left, on_right))
        self.thread.start()

    def cleanup(self):
        self.is_running = False

def thread_function(is_running, on_click, on_left, on_right):
    sw = 15
    dt = 4
    clk = 17

    GPIO.setmode(GPIO.BCM)
    GPIO.setup(sw, GPIO.IN)
    GPIO.setup(dt, GPIO.IN)
    GPIO.setup(clk, GPIO.IN)

    button_position = 1
    rotary_position = 1

    while is_running():
        GPIO.setmode(GPIO.BCM)
        new_button_position = GPIO.input(sw)
        if (button_position == 0 and new_button_position == 1):
            on_click() 
        button_position = new_button_position
        
        new_rotary_position = GPIO.input(clk)
        if (rotary_position != new_rotary_position and new_rotary_position == 1):
            if new_rotary_position == GPIO.input(dt):
                on_left() 
            else:
                on_right() 
        rotary_position = new_rotary_position
        sleep(0.2)

