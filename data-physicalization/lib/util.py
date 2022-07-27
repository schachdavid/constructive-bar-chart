AVAILABLE_BLOCKS = 20;

def figure_out_block_size(config):
    total = sum(d["value"] for d in config["fields"])
    raw_blocksize = total / AVAILABLE_BLOCKS
    nice_borders = [1, 2.5, 5, 7.5]
    num_digits = len(str(round(raw_blocksize)))
    scale_block = 1 / pow(10, num_digits - 1)
    scaled_block_size = raw_blocksize * scale_block
    closest_border = min(nice_borders, key=lambda d:abs(d-scaled_block_size))

    # scale back
    return closest_border * (1 / scale_block)

def timing(f):
    def wrap(*args, **kwargs):
        time1 = time.time()
        ret = f(*args, **kwargs)
        time2 = time.time()
        print('{:s} function took {:.3f} ms'.format(f.__name__, (time2-time1)*1000.0))

        return ret
    return wrap



   