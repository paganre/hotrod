from PIL import Image
import json

FILES = {
    'files/checkmark.jpg': ['../levels/S/last_frame.json', '../dist/levels/S/last_frame.json'],
}


def process_files():
    for input_filename, target_filenames in FILES.items():
        im = Image.open(input_filename, 'r')
        data = [[im.getpixel((i, j)) for j in range(im.size[1])]
                for i in range(im.size[0])]
        data = [[sum(arr)//len(arr) for arr in row] for row in data]
        for target_filename in target_filenames:
            with open(target_filename, 'w') as f:
                f.write(json.dumps(data))


if __name__ == '__main__':
    process_files()
