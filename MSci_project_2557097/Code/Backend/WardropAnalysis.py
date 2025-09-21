import re
import matplotlib.pyplot as plt
import numpy as np

class WardropAnalysis:
    def __init__(self, filename):
        self.filename = filename
        self.data = {}
        self.averages = {}
        
    def parse_file(self):
        data = {}
        current_mode = None
        with open(self.filename, "r") as f:
            for line in f:
                line = line.strip()
                mode_match = re.match(r"=== Testing mode:\s*(.+)\s*===", line)
                if mode_match:
                    current_mode = mode_match.group(1)
                    if current_mode not in data:
                        data[current_mode] = {}
                    continue
                if line.startswith("Instance"):
                    continue
                if line.startswith("Nodes:"):

                    m = re.match(
                        r"Nodes:\s*(\d+),\s*Edges:\s*(\d+),\s*Exec Time:\s*([\d\.]+)\s*sec,\s*PoA:\s*([\d\.\-]+)"
                        r"(?:,\s*Equilibrium Iterations:\s*([\w\-]+),\s*Social Optimality Iterations:\s*([\w\-]+))?",
                        line)
                    if m:
                        nodes = int(m.group(1))
                        exec_time = float(m.group(3))
                        poa = float(m.group(4))
                        eq_iter = m.group(5)
                        so_iter = m.group(6)

                        if eq_iter is not None:
                            eq_iter = None if eq_iter.lower() in ['none', '-'] else int(eq_iter)
                        if so_iter is not None:
                            so_iter = None if so_iter.lower() in ['none', '-'] else int(so_iter)
                        if nodes not in data[current_mode]:
                            data[current_mode][nodes] = {
                                'exec_time': [],
                                'poa': [],
                                'eqIterations': [],
                                'SoIterations': []
                            }
                        data[current_mode][nodes]['exec_time'].append(exec_time)
                        data[current_mode][nodes]['poa'].append(poa)
                        data[current_mode][nodes]['eqIterations'].append(eq_iter)
                        data[current_mode][nodes]['SoIterations'].append(so_iter)
        self.data = data
        return data

    def compute_averages(self):

        averages = {}

        for mode, nodes_data in self.data.items():
            averages[mode] = {}

            for nodes, metrics in nodes_data.items():
                valid_indices = [i for i, x in enumerate(metrics['poa']) if x >= 1]
                invalid_count = len(metrics['poa']) - len(valid_indices)
                total_count = len(metrics['poa'])

                if valid_indices:
                    avg_exec = np.mean([metrics['exec_time'][i] for i in valid_indices])
                    avg_poa = np.mean([metrics['poa'][i] for i in valid_indices])
                    valid_eq = [metrics['eqIterations'][i] for i in valid_indices if metrics['eqIterations'][i] is not None]
                    valid_so = [metrics['SoIterations'][i] for i in valid_indices if metrics['SoIterations'][i] is not None]
                    avg_eq = np.mean(valid_eq) if valid_eq else None
                    avg_so = np.mean(valid_so) if valid_so else None
                    
                else:
                    avg_exec = None
                    avg_poa = None
                    avg_eq = None
                    avg_so = None

                averages[mode][nodes] = {
                    'avg_exec_time': avg_exec,
                    'avg_poa': avg_poa,
                    'avg_eqIterations': avg_eq,
                    'avg_SoIterations': avg_so,
                    'invalid_count': invalid_count,
                    'total_count': total_count
                }
        self.averages = averages
        return averages

    def print_averages(self):

        overall_total = 0
        overall_invalid = 0

        for mode in sorted(self.averages.keys()):
            print(f"Mode: {mode}")

            for nodes in sorted(self.averages[mode].keys()):
                avg_exec = self.averages[mode][nodes]['avg_exec_time']
                avg_poa = self.averages[mode][nodes]['avg_poa']
                avg_eq = self.averages[mode][nodes]['avg_eqIterations']
                avg_so = self.averages[mode][nodes]['avg_SoIterations']
                invalid_count = self.averages[mode][nodes]['invalid_count']
                total_count = self.averages[mode][nodes]['total_count']
                overall_total += total_count
                overall_invalid += invalid_count

                print(f"  Nodes: {nodes}, Avg Exec Time: {avg_exec:.4f} sec, Avg PoA: {avg_poa:.3f}, " +
                      f"Avg Equilibrium Iterations: {avg_eq if avg_eq is not None else 'None'}, " +
                      f"Avg Social Optimality Iterations: {avg_so if avg_so is not None else 'None'}, " +
                      f"Invalid: {invalid_count}/{total_count}")
                      
            print("")
        print(f"Overall Total Instances: {overall_total}")
        print(f"Overall Invalid Results: {overall_invalid}")

    def plot_averages(self):
        modes = sorted(self.averages.keys())
        
        # Average Execution Time vs. Number of Nodes (Line Plot)
        plt.figure()
        for mode in modes:
            nodes = sorted(self.averages[mode].keys())
            avg_exec_times = [self.averages[mode][n]['avg_exec_time'] for n in nodes]
            plt.plot(nodes, avg_exec_times, marker='o', label=mode)
        plt.xlabel('Number of Nodes')
        plt.ylabel('Average Execution Time (sec)')
        plt.title('Execution Time vs. Number of Nodes')
        plt.legend()
        plt.grid(True)
        plt.show()

        # Average PoA vs. Number of Nodes (Line Plot)
        plt.figure()
        for mode in modes:
            nodes = sorted(self.averages[mode].keys())
            avg_poas = [self.averages[mode][n]['avg_poa'] if self.averages[mode][n]['avg_poa'] is not None else np.nan for n in nodes]
            plt.plot(nodes, avg_poas, marker='o', label=mode)
        plt.xlabel('Number of Nodes')
        plt.ylabel('Average Price of Anarchy')
        plt.title('Price of Anarchy vs. Number of Nodes')
        plt.legend()
        plt.grid(True)
        plt.show()
        
        # Average Equilibrium Iterations vs. Number of Nodes (Line Plot)
        plt.figure()
        for mode in modes:
            nodes = sorted(self.averages[mode].keys())
            avg_eq = [self.averages[mode][n]['avg_eqIterations'] if self.averages[mode][n]['avg_eqIterations'] is not None else np.nan for n in nodes]
            plt.plot(nodes, avg_eq, marker='o', label=mode)
        plt.xlabel('Number of Nodes')
        plt.ylabel('Average Wardrop Equilibrium Iterations')
        plt.title('Wardrop Equilibrium Iterations vs. Number of Nodes')
        plt.legend()
        plt.grid(True)
        plt.show()

        # Average Social Optimality Iterations vs. Number of Nodes (Line Plot)
        plt.figure()
        for mode in modes:
            nodes = sorted(self.averages[mode].keys())
            avg_so = [self.averages[mode][n]['avg_SoIterations'] if self.averages[mode][n]['avg_SoIterations'] is not None else np.nan for n in nodes]
            plt.plot(nodes, avg_so, marker='o', label=mode)
        plt.xlabel('Number of Nodes')
        plt.ylabel('Average Social Optimality Iterations')
        plt.title('Social Optimality Iterations vs. Number of Nodes')
        plt.legend()
        plt.grid(True)
        plt.show()
            
    def run(self):
        self.parse_file()
        self.compute_averages()
        self.print_averages()
        self.plot_averages()

if __name__ == "__main__":
    wa = WardropAnalysis("performance_summary.txt")
    wa.run()
