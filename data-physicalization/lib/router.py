class Router:
    def __init__(self, config):
        self.config = config
        self.current = None

    def push(self, key, *args):
        if self.current != None:
            self.current.cleanup(key)   
        self.current = self.config[key](self, *args)
