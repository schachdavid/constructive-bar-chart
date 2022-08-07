from functools import reduce
from math import floor
import kmeans1d
import numpy as np

MAX_NUM_BLOCKS=31

def round_and_match_total(ratios, num_blocks):
    floored_diff_tuples = []
    total = 0
    for (i, ratio) in enumerate(ratios):
        if ratio < 0.5:
            floored_diff_tuples.append((0,0,i))
            continue
        if ratio < 1:
            floored_diff_tuples.append((1,0,i))
            total = total + 1
            continue
        floored = floor(ratio)
        total = total + floored
        floored_diff_tuples.append((floored,ratio-floored, i))
    floored_diff_tuples.sort(key=lambda tup: tup[1], reverse=True)
    for i in range(total,num_blocks):
        (floored, diff, index) = floored_diff_tuples[i-total]
        floored_diff_tuples[i-total] = (floored+1, diff, index)
    floored_diff_tuples.sort(key=lambda tup: tup[2])
    return [d[0] for d in floored_diff_tuples]

def get_error(a,b):
    error_list = [abs(item_a-b[i]) for (i, item_a) in enumerate(a)]
    return (sum(error_list), error_list)

def find_solutions(correct_ratios):
    """
    Finds the solutions which gets closest to the correct ratios using NUM_BLOCKs
    
    :return: list of solution, each solution is a list of the numbers of blocks per field
    """
    
    solutions = []
    for i in range(5,MAX_NUM_BLOCKS):
        ratios = [i * ratio for ratio in correct_ratios]
        blocks = round_and_match_total(ratios, i)
        error = get_error(correct_ratios, [block/i for block in blocks])
        solutions.append((error[0], error[1], blocks))
    solutions.sort(key=lambda tup: tup[0])

    # only use solutions where the errors are evenly distributed
    solutions = list(filter(lambda solution: not has_outliers(solution[1]), solutions))

    # cluster solutions in 10 classes
    clusters = kmeans1d.cluster([d[0] for d in solutions], 10)[0]

    best_solutions = []

    # get only solutions of the two best classes/clusters
    for (i, cluster) in enumerate(clusters):
        if cluster == 0 or cluster == 1:
            best_solutions.append(solutions[i][2])    

    return best_solutions

# find outliers using iqr
def has_outliers(errors):
    q3, q1 = np.percentile(errors, [75 ,25])
    iqr = q3 - q1
    upper_bound = (q3 + 2.5 * iqr)
    return any(e > upper_bound for e in errors)

   

