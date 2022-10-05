import RPi.GPIO as GPIO
import json
import time

from lib.router import Router
from lib.weight_cell import WeightCell
from lib.rfid_reader import RFIDReader

from screens.game.controller import GameController
from screens.game_feedback.controller import GameFeedbackController
from screens.game_feedback_flex.controller import GameFeedbackFlexController
from screens.display_test.controller import DisplayTestController
from screens.calibration.controller import CalibrationController
from screens.select_game.controller import SelectGameController

from display_manager import DisplayManager

config = json.load(open("../data-vis-screen-based/src/data.json"))


def controller_cell_factory(cells, controllerConstructor):
    def controller_with_cells(*args):
        return controllerConstructor(cells, *args)
    return controller_with_cells
  
    
try:
    weight_cell_pins = [
        [5, 6],
        [7, 23],
        [18, 26],
        [27, 12],
        [13, 14]
    ]
    
    # setup weight cells once at the beginning 
    weight_calibration = json.load(open("./weight_calibration.json"))


    cells = list(
        map(
            lambda i: WeightCell(
                weight_cell_pins[i][0],
                weight_cell_pins[i][1],
                weight_calibration[i]["reference"],
                weight_calibration[i]["tare_offset"],
            ), 
            range(5)
        )
    )

    router_config = {
        "SelectGame": SelectGameController,
        "Game": controller_cell_factory(cells, GameController),
        "GameFeedback": GameFeedbackController,
        "GameFeedbackFlex": controller_cell_factory(cells, GameFeedbackFlexController),
        "DisplayTest": DisplayTestController,
        "Calibration": controller_cell_factory(cells, CalibrationController),
    }
    router = Router(router_config)

    CALIBRATION_TAG_UID = "1352131711548"
    DISPLAY_TEST_TAG_UID = "103902611584"

    def on_tag_read(uid):
        id = ''.join(str(v) for v in uid)
        print("read", id, "at", time.time())

        if id == DISPLAY_TEST_TAG_UID:
            router.push("DisplayTest")
            return
        if id == CALIBRATION_TAG_UID:
            router.push("Calibration")
            return  

        current = next(filter(lambda x: x["id"] == id, config), None)
        if current != None:
            router.push("Game", current)

    def on_tag_remove():
        print("removed tag")
        router.push("SelectGame")
        DisplayManager.instance().clean_displays()


    rfid_reader = RFIDReader(on_tag_read=on_tag_read, on_tag_remove=on_tag_remove)

    router.push("SelectGame")

except (KeyboardInterrupt, SystemExit):
    router.current.cleanup()
    rfid_reader.cleanup()
    sys.exit(0)
    GPIO.cleanup()
