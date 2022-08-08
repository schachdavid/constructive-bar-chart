import RPi.GPIO as GPIO
import datetime
import json

from lib.router import Router
from lib.weight_cell import WeightCell
from lib.rfid_reader import RFIDReader

from screens.game.controller import GameController
from screens.select_game.controller import SelectGameController
from screens.game_feedback.controller import GameFeedbackController
from screens.game_feedback_flex.controller import GameFeedbackFlexController

from display_manager import dm

config = json.load(open("../data-vis-screen-based/src/data.json"))

def game_feedback_factory(cells, controllerConstructor):
    def game_feedback_with_cells(*args):
        return controllerConstructor(cells, *args)
    return game_feedback_with_cells
  
    
try:
    weight_cell_pins = [
        [5, 6],
        [7, 23],
        [18, 26],
        [27, 12],
        [13, 14]
    ]
    
    # setup weight cells once at the beginning 
    weight_calibration = [1181, 1094, 1044, 1173, 1075]
    weight_tare = [582234, 649203, -8388608, 178541, 1754914]


    cells = list(
        map(
            lambda i: WeightCell(
                weight_cell_pins[i][0],
                weight_cell_pins[i][1],
                weight_calibration[i],
                weight_tare[i]
            ), 
            range(5)
        )
    )

    router_config = {
        "SelectGame": SelectGameController,
        "Game": GameController,
        "GameFeedback": game_feedback_factory(cells, GameFeedbackController),
        "GameFeedbackFlex": game_feedback_factory(cells, GameFeedbackFlexController),

    }
    router = Router(router_config)

    def on_tag_read(uid):
        id = ''.join(str(v) for v in uid)
        print("read", id)
        current = next(filter(lambda x: x["id"] == id, config), None)
        if current != None:
            router.push("Game", current)

    def on_tag_remove():
        print("removed tag")
        router.push("SelectGame")
        dm.clean_displays()


    rfid_reader = RFIDReader(on_tag_read=on_tag_read, on_tag_remove=on_tag_remove)    

    router.push("SelectGame")

except (KeyboardInterrupt, SystemExit):
    router.current.cleanup()
    rfid_reader.cleanup()
    sys.exit(0)
    GPIO.cleanup()
