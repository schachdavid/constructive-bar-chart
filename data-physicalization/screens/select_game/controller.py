from screens.select_game.view import View

class SelectGameController:
    def __init__(self, router):
        self.view = View()
        self.view.draw()

    def cleanup(self):
        self.view.cleanup()
