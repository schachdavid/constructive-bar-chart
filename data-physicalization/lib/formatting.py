config = [
    {
        "factor": 1000000000000,
        "singular": "Billion",
        "plural": "Billionen",
        "short": "Bil.",
    },
    {
        "factor": 1000000000,
        "singular": "Milliarde",
        "plural": "Milliarden",
        "short": "Mrd.",
    },
    {
        "factor": 1000000,
        "singular": "Million",
        "plural": "Millionen",
        "short": "Mio.",
    },
    {
        "factor": 1000,
        "singular": "Tausend",
        "plural": "Tausend",
        "short": "Tsd.",
    }
]

def format_number(x):
    return "{0}".format(str(round(x, 1) if x % 1 else int(x))) 


def get_suffix_and_number(x, short=False):
    suffix = ""
    for level in config:
      if level["factor"] <= x:
        num = x / level["factor"]
        if short:
            return (level["short"], format_number(num))
        elif num == 1:
            return (level["singular"], format_number(num))
        else:
            return (level["plural"], format_number(num))
    return ("", format_number(x))


def format_number_with_suffix(x, short=False):
    suffix, num = get_suffix_and_number(x, short)
    return f"{num}\u2009{suffix}"






    
