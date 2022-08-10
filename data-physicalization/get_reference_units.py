import time
import sys
referenceUnit = 1

import RPi.GPIO as GPIO
from lib.hx711 import HX711

def cleanAndExit():
    print("Cleaning...")
    GPIO.cleanup()
        
    print("Bye!")
    sys.exit()

weight_cell_pins = [
    [5, 6],
    [7, 23],
    [18, 26],
    [27, 12],
    [13, 14]
]


# HOW TO CALCULATE THE REFFERENCE UNIT
# To set the reference unit to 1 Put 1kg on your sensor or anything you have and know exactly how much it weights.
# In this case, 92 is 1 gram because, with 1 as a reference unit I got numbers near 0 without any weight
# and I got numbers around 184000 when I added 2kg. So, according to the rule of thirds:
# If 2000 grams is 184000 then 1000 grams is 184000 / 2000 = 92.
#hx.set_reference_unit(113)

hx_list = []
for pins in weight_cell_pins:
    hx = HX711(*pins)
    hx.set_reading_format("MSB", "MSB")
    hx.set_reference_unit(1)
    hx.reset()
    hx.tare()
    hx_list.append(hx) 

print("--------------------------------------------------------------------")
print("Tare done! You have 10 seconds to add 90 gram blocks on every field.")
time.sleep(10)
print("--------------------------------------------------------------------")
print("You should have placed all blocks by now. Starting to get reference units.")

reference_values = []
for hx in hx_list:    
    val = hx.get_weight(15)
    reference_values.append(val/90)
    hx.power_down()
    hx.power_up()
    time.sleep(0.1)

print(reference_values)
cleanAndExit()
