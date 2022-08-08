import time

def timing(f, *args, **kwargs):
    time1 = time.time()
    ret = f(*args, **kwargs)
    time2 = time.time()
    print('{:s} function took {:.3f} ms'.format(f.__name__, (time2-time1)*1000.0))
    return ret

def get_error(a,b):
    error_list = [abs(item_a-b[i]) for (i, item_a) in enumerate(a)]
    return (sum(error_list), error_list)

def get_percentages(items):
    items_sum = sum(items)
    if items_sum==0:
        return 0
    return [item/items_sum for item in items]
