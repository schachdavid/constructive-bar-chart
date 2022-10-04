from PIL import ImageFont, Image


FONT_ASPECT_RATIO = 85/50

def get_max_font(width, text_length):
    return get_font(min(get_font_size(width, text_length),30))

def get_font_size(width, text_length):
    return int(width/text_length * FONT_ASPECT_RATIO)

def draw_centered_text(device, draw, font, text, y=None, inverted=False, x_offset=0, height=None, width=None):
    w, h = draw.textsize(text, font=font)
    w = w if width is None else width
    h = h if height is None else height
    x = device.width - w
    if y is None:
        y = (device.height - h*1.2) // 2

    if inverted:
        draw.rectangle([0 + x_offset, y+3, device.width, y + h], fill="white")
        draw.text((x // 2 + x_offset, y), text, fill="black", font=font)
    else:
        draw.text((x // 2 + x_offset, y), text, fill="white", font=font)

def get_font(size):
    return ImageFont.truetype("./resources/fonts/RobotoMono-Regular.ttf", size)

def get_bold_font(size):
    return ImageFont.truetype("./resources/fonts/RobotoMono-Medium.ttf", size)

def draw_check_mark(draw, x, y, size):
    draw.ellipse((x-size//2, y-size//2, x+size//2, y+size//2), fill="white")
    line_strength = 2
    draw.ellipse((x-size//2+line_strength, y-size//2+line_strength, x+size//2-line_strength, y+size//2-line_strength), fill="black")
    x0 = x-size//2-1
    y0 = y-size//2+1
    draw.line((x0+0.2*size, y0+0.5*size, x0+0.3*size, y0+0.7*size), fill="white", width=2)
    draw.line((x0+0.8*size, y0+0.3*size, x0+0.3*size, y0+0.7*size), fill="white", width=2)

def draw_chevron(draw, x, y, size, direction="top"):
    if direction == "top":
        draw.line((x+1, y-0.25*size//2+1, x-size//2, y+0.25*size//2), fill="white", width=2)
        draw.line((x, y-0.25*size//2, x+size//2, y+0.25*size//2), fill="white", width=2)
    if direction == "bottom":
        draw.line((x+1, y+0.25*size//2+1, x-size//2, y-0.25*size//2), fill="white", width=2)
        draw.line((x, y+0.25*size//2, x+size//2, y-0.25*size//2), fill="white", width=2)

def draw_spike(draw, x, y, width, height):
    a = (x-width//2, y+height//2)
    b = (x+width//2, y+height//2)
    c = (x, y-height//2)
    draw.line([a,c], fill="white", width=2)
    draw.line([b,c], fill="white", width=2)   

def draw_block(draw, x, y, size):
    draw.line((x, y, x+size*2.7, y), fill="white", width=1)
    draw.line((x, y, x, y+size), fill="white", width=1)
    draw.line((x, y+size, x+size*2.7, y+size), fill="white", width=1)
    draw.line((x+size*2.7, y, x+size*2.7, y+size), fill="white", width=1)

def draw_block_with_number(draw, x, y, size, number, position="top"):   
    text = str(number)
    font = get_font(13)
    w = draw.textsize(text, font=font)[0]
    x_text = x + (size * 2.7 - w) // 2
    w = 2.7 * size

    if position == "top":
        draw.line((x, y + 0.4 * size, x, y + size), fill="white", width=1)
        draw.line((x, y + size, x+w, y + size), fill="white", width=1)
        draw.line((x+w, y + 0.4 * size, x+w, y + size), fill="white", width=1)
        draw.text((x_text, y-4), text, fill="white", font=font)
    else:
        draw.line((x, y, x, y + size * 0.6), fill="white", width=1)
        draw.line((x, y, x+w, y), fill="white", width=1)
        draw.line((x+w, y, x+w, y + size * 0.6), fill="white", width=1)
        draw.text((x_text, y + size - 11), text, fill="white", font=font)
