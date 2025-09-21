import time
import os
import psutil
import matplotlib.pyplot as plt
import numpy as np
import random
from memory_profiler import memory_usage
from wardrop_server import calculate_equilibrium_from_data

class WardropPerformanceTest:
    def __init__(self):

        self.node_sizes = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
        self.cost_function_modes = ['linear', 'quadratic', 'mixed']
        self.num_instances = 15
        self.edge_multiplier = 4
        self.overall_results = {}

    def generate_directed_network(self, num_nodes, cost_function_mode='linear', a_range=(0.5, 2.0), b_range=(0.0, 1.0)):

        nodes = []
        edges = []

        for i in range(num_nodes):
            if i == 0:
                nodes.append({'id': f'node_{i}', 'type': 'source', 'totalFlow': 10})
            elif i == num_nodes - 1:
                nodes.append({'id': f'node_{i}', 'type': 'sink'})
            else:
                nodes.append({'id': f'node_{i}', 'type': 'node'})

        max_possible_edges = num_nodes * (num_nodes - 1)
        desired_edge_count = min(self.edge_multiplier * num_nodes, max_possible_edges)
        all_possible_edges = [(i, j) for i in range(num_nodes) for j in range(num_nodes) if i != j]
        chosen_edges = random.sample(all_possible_edges, desired_edge_count)
        edge_id = 0

        for (i, j) in chosen_edges:

            a = random.uniform(a_range[0], a_range[1])
            b = random.uniform(b_range[0], b_range[1])

            if cost_function_mode == 'linear':
                cost_str = f"{a:.3f}*x + {b:.3f}"
            elif cost_function_mode == 'quadratic':
                cost_str = f"{a:.3f}*x**2 + {b:.3f}"
            elif cost_function_mode == 'mixed':
                if random.random() < 0.5:
                    cost_str = f"{a:.3f}*x + {b:.3f}"
                else:
                    cost_str = f"{a:.3f}*x**2 + {b:.3f}"
            else:
                cost_str = f"{a:.3f}*x + {b:.3f}"

            edges.append({'id': f'edge_{edge_id}', 'source': f'node_{i}', 'target': f'node_{j}', 'costFunction': cost_str})
            edge_id += 1

        initial_guess = [1] * len(edges)

        return {'nodes': nodes, 'edges': edges, 'initial_guess': initial_guess}

    def run_performance_test(self, num_nodes, cost_function_mode='linear'):

        test_network = self.generate_directed_network(num_nodes, cost_function_mode)
        wall_start = time.time()
        result = calculate_equilibrium_from_data(test_network)
        wall_end = time.time()
        exec_time = wall_end - wall_start

        return exec_time, result

    def run(self):

        for mode in self.cost_function_modes:

            print(f"\n=== Testing mode: {mode} ===")
            mode_results = []

            for instance in range(1, self.num_instances + 1):
                instance_results = []
                print(f"\nInstance {instance}:")

                for n in self.node_sizes:
                    exec_time, res = self.run_performance_test(n, mode)
                    poa = res.get('network', {}).get('price_of_anarchy', None)
                    eqIterations = res.get('network', {}).get('equilibrium_iterations', None)
                    SoIterations = res.get('network', {}).get('social_optimal_iterations', None)
                    poa = poa if poa is not None else -1
                    num_edges = len(self.generate_directed_network(n, mode)['edges'])
                    summary = {
                        'num_nodes': n,
                        'num_edges': num_edges,
                        'exec_time': exec_time,
                        'poa': poa,
                        'eqIterations': eqIterations,
                        'SoIterations': SoIterations
                    }
                    
                    instance_results.append(summary)

                    print(f"Nodes: {n}, Edges: {num_edges}, Exec Time: {exec_time:.4f} sec, "
                          f" PoA: {poa}, Equilibrium Iterations: {eqIterations}, "
                          f"Social Optimality Iterations: {SoIterations}")

                mode_results.append(instance_results)
                
            self.overall_results[mode] = mode_results

if __name__ == '__main__':
    wpt = WardropPerformanceTest()
    wpt.run()
