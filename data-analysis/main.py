import json
from solutions_finder import find_solutions
from functools import reduce

data = json.load(open('raw-data.json'))

for config in data:
    total = reduce(lambda a, b: a+b["value"], config["data"], 0)
    ratios = list(map(lambda d: d["value"]/total, config["data"]))
    config["solutions"] = find_solutions(ratios)

# write file into src dir of react app to import it later
f = open("../data-vis-screen-based/src/data.json", "w")
f.write(json.dumps(data, ensure_ascii=False, indent=2))
f.close()

f = open("../data-physicalization/data.json", "w")
f.write(json.dumps(data, ensure_ascii=False, indent=2))
f.close()



