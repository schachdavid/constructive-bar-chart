from pirc522 import RFID
from time import sleep
import RPi.GPIO as GPIO
import threading

class RFIDReader:
    def __init__(self, on_tag_read=lambda x: None, on_tag_remove=lambda x: None):
        self.is_running = True
        self.reader = RFID(pin_mode=GPIO.BCM, pin_rst=25, pin_irq=24)
        self.thread = threading.Thread(target=thread_function, args=(lambda : self.is_running,  self.reader, on_tag_read, on_tag_remove))
        self.thread.start()

    def cleanup(self):
        self.is_running = False

def is_tag_available(reader):
    # enable IRQ on detect
    reader.init()
    reader.irq.clear()
    reader.dev_write(0x04, 0x00)
    reader.dev_write(0x02, 0xA0)

    reader.init()
    reader.dev_write(0x04, 0x00)
    reader.dev_write(0x02, 0xA0)

    reader.dev_write(0x09, 0x26)
    reader.dev_write(0x01, 0x0C)
    reader.dev_write(0x0D, 0x87)

    is_available = reader.irq.wait(0.1)

    reader.irq.clear()
    reader.init()

    return is_available

def thread_function(is_running, reader, on_tag_read, on_tag_remove):
    tag_active = False
    last_reading_tag_available = False

    while is_running():
        sleep(0.2)
        if not is_tag_available(reader):         
            if tag_active and not last_reading_tag_available:
                tag_active = False
                on_tag_remove()
            else:
                last_reading_tag_available = False
            continue
        last_reading_tag_available = True
        if tag_active:
            continue
        error, tag_type = reader.request()
        if not error:
            error, uid = reader.anticoll()
            if not error:
                on_tag_read(uid)
                tag_active = True
            reader.stop_crypto()
        print("tag loop finished")

