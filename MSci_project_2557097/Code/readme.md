# Selfish Traffic Routing: A Visual Tool

Modern traffic networks face increasing complexity due to urbanisation, congestion, and decentralised decision-making. Theoretical frameworks such as Wardrop Equilibrium and Social Optimality highlight the relationship between individual route choices and overall efficiency. However, practical applications are hindered by computational challenges, limited visualisation capabilities, and a lack of tools for research.  In this work, an interactive visual tool that integrates theoretical traffic flow models with modern numerical optimisation techniques to compute and visualise Wardrop Equilibrium, Social Optimality, and the Price of Anarchy in real time is presented. Using a Flask-based Python backend, Sequential Least Squares Programming (SLSQP) is used to find the equilibrium and socially optimal flows, while a React-based frontend offers an intuitive interface for constructing networks, defining cost functions, and dynamically visualising routing outcomes. Validation on established examples such as the Pigou and Braess networks confirms that the computed results align with theoretical predictions. Additionally, performance evaluations on randomly generated networks demonstrate scalability and robustness. Our tool not only combines the application of theoretical models with practical traffic management but also provides a platform for researchers and practitioners to experiment with and analyse the impact of decentralised, selfish routing on overall network efficiency.

## File Structure

- **backend/**
  - `wardrop_server.py`: Flask server and calculator.
  - `WardropAnalysis.py`: Parses performance summary logs, computes average metrics (execution time, Price of Anarchy, and convergence iterations) for various network sizes and cost function modes, then visualises these trends using line plots.
  - `WardropEvaluation.py`: Contains the `WardropPerformanceTest` class, which systematically generates random directed networks and evaluates the performance of the traffic optimisation routines by measuring execution time, iteration counts for equilibrium and social optimal flows, and the resulting Price of Anarchy.
  - `peformance_summary.txt`: Contains evaluation results from the 450 runs.
  - `requirements.txt`: Lists the Python packages required to run the backend (Flask, Flask-CORS, NumPy, SciPy, Sympy, etc.) and Evaluation (matplotlib).

- **frontend/**
  - `node_modules/`: Directory for all installed Node.js dependencies.
  - `public/`: Contains public assets such as images, and other static files.
  - **src/**
    - **components/**: Contains all React components.
      - **edges/**: 
        - `CostEdge.js`: Implements a custom edge component.
      - **helpers/**: 
        - `alphaName.js`: Generates alphabetical labels (e.g. A, B, C).
        - `formatter.js`: Contains formatting utilities.
        - `idGenerator.js`: Provides functions to generate unique IDs for nodes and edges (and to reset these counters if needed).
        - `routeFinder.js`: Implements algorithms (e.g. depth-first search) to compute possible routes through the network.
      - **Modals/**: 
        - `HowToUseModal.js`: Displays a draggable modal that provides user instructions on how to interact with the network editor.
        - `ResultsModal.js`: Shows the computation results, including edge flows, network costs, and route information.
      - **nodes/**: 
        - `Default.js`: Renders a custom intermediate node.
        - `SinkNode.js`: Renders a custom sink node.
        - `SourceNode.js`: Renders a custom source node that includes total flow input.
      - `DnDContext.js`: Provides a React context to manage the drag-and-drop state throughout the application.
      - `DnDFlow.js`: Main component that renders the interactive network canvas, handles node and edge creation, drag-and-drop interactions, and communicates with the backend.
      - `predefinedNetworks.js`: Exports predefined network configurations (e.g., Pigou Network, Braess Network, complex networks) for quick project setup.
      - `SideBar.js`: Sidebar component offering controls to edit edge cost functions, manage edges, and display helpful instructions.
      - `WelcomePage.js`: The entry-page component that lets users choose a predefined network or start a new blank project.
    - `App.js`: Main entry point that ties together the welcome page, the drag-and-drop network editor (DnDFlow), and all context providers.
    - `index.css`: Global CSS styling for the frontend.
    - `index.js`: Bootstraps the React application.
    - `reportWebVitals.js`: Report web performance metrics.
  - `package.json`: Defines project metadata, scripts, and Node.js dependencies.
  - `package-lock.json`: Auto-generated file that locks dependency versions.

- `README.md`

## Build and Run Instructions

My application is fully deployed online, with the frontend hosted on Netlify and the backend on GCP. You can access the live version at https://2557097h.netlify.app/. Detailed build instructions are also provided if you prefer to run the application locally or if the hosted version goes offline.

### Requirements

**Backend:**
- Python 3.13 or higher (Will likely work with earlier versions however this is the version it was tested on)
- Packages: Flask, Flask-CORS, NumPy, SciPy, Sympy See `requirements.txt`.

**Frontend:**
- Tested using Node.js v20.18.0 and npm 10.8.2 (Will likely work with earlier versions however this is the version it was tested on)

Both tested on Windows 11

### Backend Setup

1. **Install Python**

2. **Navigate to the backend folder:**
    cd Backend

3. **Install the required packages**
    pip install -r requirements.txt

4. **Run the Flask server**
    python wardrop_server.py

### Frontend Setup

1. **Navigate to the frontend folder:**
    cd Frontend

2. **Install Node dependencies**
    npm install

3. **Start the development server**
    npm start

You should now be able to use the frontend in combination with the backend.

### Testing

**Backend:**

If you would like to test the backend seperately from the frontend:

- Use curl to send a POST request with a JSON body to `http://127.0.0.1:5000/calculate-equilibrium`. The expected response includes computed edge flows for both Wardrop Equilibrium and Social Optimality, as well as the overall network cost and Price of Anarchy.

For example: curl.exe --% -X POST http://127.0.0.1:5000/calculate-equilibrium -H "Content-Type: application/json" -d "{\"nodes\":[{\"id\":\"A\",\"type\":\"source\",\"totalFlow\":1},{\"id\":\"B\",\"type\":\"sink\"}],\"edges\":[{\"id\":\"0\",\"source\":\"A\",\"target\":\"B\",\"costFunction\":\"x\"},{\"id\":\"1\",\"source\":\"A\",\"target\":\"B\",\"costFunction\":\"1\"}]}"

Otherwise this will test the backend and the frontend:

**Frontend and backend:**

1. Open `http://localhost:3000` in your web browser.
2. Start with a predefined network (e.g., Pigou Network) or a blank project.
3. Drag and drop nodes onto the canvas; create connections (edges) between nodes.
4. Update the cost functions for edges via the sidebar.
5. Click the “Compute Wardrop” button to trigger the backend computation.
6. Review the displayed results in the modal, including calculated flows and possible routes.






