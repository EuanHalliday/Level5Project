from flask import Flask, request, jsonify
from flask_cors import CORS
import sympy as sp
from scipy.optimize import minimize
import numpy as np
from collections import defaultdict
import matplotlib.pyplot as plt
import io
import base64


app = Flask(__name__)
CORS(app)

def parse_network(data):

    nodes = data.get('nodes', [])
    edges = data.get('edges', [])

    node_types = {}
    source_flows = {}

    for node in nodes:
        node_id = node['id']
        node_type = node['type']
        node_types[node_id] = node_type

        if node_type == 'source':
            if 'totalFlow' in node:
                source_flows[node_id] = float(node.get('totalFlow', 0))
            elif 'data' in node and 'totalFlow' in node['data']:
                source_flows[node_id] = float(node['data']['totalFlow'])

    return nodes, edges, node_types, source_flows

def build_potential_and_total_cost_functions(edges):

    edge_ids = [edge['id'] for edge in edges]
    flow_symbols = sp.symbols(edge_ids)

    potential_expr = 0
    total_cost_expr = 0

    for edge, flow_sym in zip(edges, flow_symbols):
        cost_str = edge['costFunction']
        cost_expr = sp.sympify(cost_str, locals={'x': flow_sym})
        potential_expr += sp.integrate(cost_expr, (flow_sym, 0, flow_sym))
        total_cost_expr += cost_expr * flow_sym

    potential_func = sp.lambdify(flow_symbols, potential_expr, 'numpy')
    total_cost_func = sp.lambdify(flow_symbols, total_cost_expr, 'numpy')

    return potential_func, total_cost_func, edge_ids

def build_constraints(nodes, edges, node_types, source_flows, edge_ids):

    incoming = defaultdict(list)
    outgoing = defaultdict(list)

    for edge in edges:
        source = edge['source']
        target = edge['target']
        outgoing[source].append(edge['id'])
        incoming[target].append(edge['id'])
    constraints = []

    for node in nodes:
        node_id = node['id']
        if node_types[node_id] in ['source', 'sink']:
            continue
        inc = incoming[node_id]
        out = outgoing[node_id]
        def balance(f, inc=inc, out=out, edge_ids=edge_ids):
            return sum(f[edge_ids.index(e)] for e in inc) - sum(f[edge_ids.index(e)] for e in out)
        constraints.append({'type': 'eq', 'fun': balance})

    for source_id, total_flow in source_flows.items():
        out = outgoing[source_id]
        def source_flow(f, out=out, total_flow=total_flow, edge_ids=edge_ids):
            return sum(f[edge_ids.index(e)] for e in out) - total_flow
        constraints.append({'type': 'eq', 'fun': source_flow})
    return constraints

def calculate_equilibrium_from_data(data):

    try:
        nodes, edges, node_types, source_flows = parse_network(data)
    except Exception as e:
        return {"error": f"Invalid input data: {str(e)}"}
    if not edges:
        return {"error": "No edges provided."}

    try:
        potential_func, total_cost_func, edge_ids = build_potential_and_total_cost_functions(edges)
    except ValueError as e:
        return {"error": str(e)}

    try:
        constraints = build_constraints(nodes, edges, node_types, source_flows, edge_ids)
    except Exception as e:
        return {"error": f"Error building constraints: {str(e)}"}

    try:

        initial_guess = np.array(data.get('initial_guess', [1] * len(edge_ids)), dtype=float)
        bounds = []

        for edge in edges:
            source = edge['source']
            if node_types[source] == 'source':
                bounds.append((0, source_flows[source]))
            else:
                bounds.append((0, None))

        potential_wrapper = lambda f: potential_func(*f)
        eq_result = minimize(
            potential_wrapper,
            initial_guess,
            method='SLSQP',
            bounds=bounds,
            constraints=constraints,
        )
        if not eq_result.success:
            return {"error": f"Equilibrium Optimization failed: {eq_result.message}"}
        equilibrium_flow = eq_result.x
        potential_value = potential_func(*equilibrium_flow)

        total_cost_wrapper = lambda f: total_cost_func(*f)
        equilibrium_cost = total_cost_wrapper(equilibrium_flow)
        social_result = minimize(
            total_cost_wrapper,
            initial_guess,
            method='SLSQP',
            bounds=bounds,
            constraints=constraints,
        )
        if not social_result.success:
            return {"error": f"Social Optimal Optimization failed: {social_result.message}"}
        social_flow = social_result.x
        social_cost = total_cost_wrapper(social_flow)

        poa = equilibrium_cost / social_cost if social_cost > 0 else float('inf')

        dec = 3

        eq_flow_rounded = [round(float(flow), dec) for flow in equilibrium_flow]
        potential_value = round(float(potential_value), dec)
        equilibrium_cost = round(float(equilibrium_cost), dec)
        social_flow_rounded = [round(float(flow), dec) for flow in social_flow]
        social_cost = round(float(social_cost), dec)
        poa = round(float(poa), dec)

        results = {
            'flows': {
                'equilibrium_flow': {},
                'social_optimal_flow': {}
            },
            'network': {
                'equilibrium_total_cost': equilibrium_cost,
                'social_optimal_total_cost': social_cost,
                'price_of_anarchy': poa,
                'equilibrium_iterations': eq_result.nit,
                'social_optimal_iterations': social_result.nit,
            }
        }
        for i, eid in enumerate(edge_ids):
            results['flows']['equilibrium_flow'][eid] = eq_flow_rounded[i]
            results['flows']['social_optimal_flow'][eid] = social_flow_rounded[i]
        results['results'] = {sid: {"totalFlow": total_flow} for sid, total_flow in source_flows.items()}
        return results
    except ValueError as e:
        return {"error": str(e)}
    except Exception as e:
        return {"error": f"An unexpected error occurred: {str(e)}"}

@app.errorhandler(Exception)
def handle_exception(e):
    response = jsonify({"error": str(e)})
    response.status_code = 200
    return response

@app.route('/calculate-equilibrium', methods=['POST'])
def calculate_equilibrium_route():
    data = request.get_json()
    result = calculate_equilibrium_from_data(data)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
