from screens.display_test.view import View

class DisplayTestController:
    def __init__(self, router):
        self.view = View()
        self.view.draw()

    def cleanup(self, next_screen):        
        self.view.cleanup()
