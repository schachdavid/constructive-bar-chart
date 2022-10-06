import RPi.GPIO as GPIO

BUTTON_GPIO = 15

class Button:
    def __init__(self, on_click=lambda _: None):
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(BUTTON_GPIO, GPIO.IN, pull_up_down=GPIO.PUD_UP)    
        GPIO.add_event_detect(BUTTON_GPIO, GPIO.BOTH, 
            callback= lambda _: on_click(), bouncetime=50)
       
    def cleanup(self):
        GPIO.remove_event_detect(BUTTON_GPIO)
