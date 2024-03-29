import RPi.GPIO as GPIO

BUTTON_GPIO = 15

class Button:
    def __init__(self, on_click=lambda _: None):
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(BUTTON_GPIO, GPIO.IN, pull_up_down=GPIO.PUD_UP)    
        GPIO.add_event_detect(BUTTON_GPIO, GPIO.RISING, 
            callback= lambda _: on_click(), bouncetime=50)
       
    def cleanup(self):
        GPIO.remove_event_detect(BUTTON_GPIO)

# implementation using polling:

# import RPi.GPIO as GPIO
# import threading

# from time import sleep

# class Button:
#     def __init__(self, on_click=lambda x: None):
#         self.is_running = True
#         self.thread = threading.Thread(target=thread_function, args=(lambda : self.is_running, on_click))
#         self.thread.start()

#     def cleanup(self):
#         self.is_running = False

# def thread_function(is_running, on_click):
#     sw = 15

#     GPIO.setmode(GPIO.BCM)
#     GPIO.setup(sw, GPIO.IN)

#     button_position = 1

#     while is_running():
#         GPIO.setmode(GPIO.BCM)
#         new_button_position = GPIO.input(sw)
#         if (button_position == 0 and new_button_position == 1):
#             on_click() 
#         button_position = new_button_position       
#         sleep(0.05)
