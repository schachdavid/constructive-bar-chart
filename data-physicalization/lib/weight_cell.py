from lib.hx711 import HX711
from statistics import mean

def get_median(items):
    sorted_list = items.copy()
    sorted_list.sort()
    return sorted_list[1]


class WeightCell:
    def __init__(self, dt, sck, weight_calibration, weight_tare):
        print(f"{dt} {sck}")
        self.hx = HX711(dt, sck)
        self.hx.set_reading_format("MSB", "MSB")
        self.hx.set_reference_unit(weight_calibration)
        self.hx.reset()
        self.hx.tare() # set a fixed offset or tare every time
        # self.hx.set_offset_A(weight_tare)
        self.weight_hist = [1, 1, 1]
        self.last_weight = 1
        self.changed = False

    def get_weight(self):
        weight = int(self.hx.get_weight(1))

        if weight < 0 or weight > 700 or weight is None:
            weight = self.last_weight

        # add weight to weight hist 
        self.weight_hist = [weight] + self.weight_hist[:-1]

        weight = get_median(self.weight_hist)       
        self.last_weight = weight 

        return weight    




