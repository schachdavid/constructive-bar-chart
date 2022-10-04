import RPi.GPIO as GPIO
from time import sleep
import json

from screens.calibration.view import CalibrationView
from lib.button import Button

class CalibrationController:
    def __init__(self, cells, router):
        self.view = CalibrationView()
        self.cells = cells
        self.tare_offsets = []
        self.reference_values = []
        self.configuration_level = 0
        self.router = router
        self.button = Button(on_click=self.on_click)
        self.view.draw_configuration_level(0)

    def on_click(self):
        if self.configuration_level != 3:
            self.view.draw_loading_indicator(self.configuration_level)
            
        if self.configuration_level == 0: # reset reference units
            for cell in self.cells:
                cell.hx.set_reference_unit(1)
            self.tare()
            self.configuration_level = 1
            self.view.draw_configuration_level(1)
            return
        if self.configuration_level == 1: # get new reference units
            self.update_reference_units()
            self.view.draw_configuration_level(2)
            self.configuration_level = 2
            return
        if self.configuration_level == 2: # final tare and persist
            self.tare()
            self.persist_calibration()
            self.configuration_level = 3
            self.view.draw_configuration_level(3) # finish message

    def tare(self):
        self.tare_offsets = []
        for cell in self.cells:
            hx = cell.hx
            hx.reset()
            hx.tare(15)
            self.tare_offsets.append(hx.get_offset_A())


    def update_reference_units(self):
        '''
         Updates the reference units by using the known weight.
        '''  
        self.reference_values = []
        for cell in self.cells:
            hx = cell.hx
            val = hx.get_weight(15)/90
            self.reference_values.append(val)
            hx.power_down()
            hx.power_up()
            sleep(0.1)
            hx.set_reference_unit(val)

    def persist_calibration(self):
        if len(self.reference_values) == 0 or len(self.tare_offsets) == 0:
            print("Reference or tare values are missing.")
            return

        calibration_data = []
        for i, tare_offset in enumerate(self.tare_offsets):
            calibration_data.append({
                "reference": self.reference_values[i],
                "tare_offset": tare_offset,
            })
        f = open("./weight_calibration.json", "w")
        f.write(json.dumps(calibration_data, ensure_ascii=False, indent=2))
        f.close()    

    def cleanup(self, next_screen):        
        self.view.cleanup()
        self.button.cleanup()
        # GPIO.cleanup()


