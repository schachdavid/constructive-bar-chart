from PIL import Image, ImageDraw

class canvas(object):   
    def __init__(self, device, should_cancel, background=None, dither=False):
        self.draw = None
        self.should_cancel = should_cancel
        if background is None:
            self.image = Image.new("RGB" if dither else device.mode, device.size)
        else:
            assert background.size == device.size
            self.image = background.copy()
        self.device = device
        self.dither = dither

    def __enter__(self):
        self.draw = ImageDraw.Draw(self.image)
        return self.draw

    def __exit__(self, type, value, traceback):
        if self.should_cancel():
            # return early here to avoid heavy display call
            return False

        if type is None:

            if self.dither:
                self.image = self.image.convert(self.device.mode)

            # do the drawing onto the device
            self.device.display(self.image)

        del self.draw   # Tidy up the resources
        return False    # Never suppress exceptions