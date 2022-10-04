from queue import PriorityQueue, Queue
import heapq
import threading
from heapq import heappush, heappop


class UniquePriorityQueue(Queue):
    def __init__(self, comparator):
        '''
        A PriorityQueue which holds only unique items.
        New added items replace old duplicates.

            Parameters:
                comparator (function): The comparator to use to find duplicates
        '''
        super().__init__()
        self.queue = []
        self.comparator = comparator

    def _qsize(self):
        return len(self.queue)

    def _put(self, item):
        for (i, current_item) in enumerate(self.queue):
            if item[1].port == current_item[1].port:
                self.queue.pop(i)
        heappush(self.queue, item)

    def _get(self):
        return heappop(self.queue)