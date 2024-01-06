"""Bezier quadratic example: Dash board

(c) Florian Wellmann, CG3

Run locally:
python bezier_dash_app.py

Deply e.g. over 

"""
import dash
from dash import dcc, html, Input, Output
from dash import callback_context

import plotly.graph_objs as go
import numpy as np


def quadratic_bezier(t, P0, P1, P2):
    x0, y0 = P0
    x1, y1 = P1
    x2, y2 = P2
    Bx = (1-t)**2 * x0 + 2*(1-t) * t * x1 + t**2 * x2
    By = (1-t)**2 * y0 + 2*(1-t) * t * y1 + t**2 * y2
    return (Bx, By)


app = dash.Dash(__name__, external_stylesheets=['https://codepen.io/chriddyp/pen/bWLwgP.css'])

app.layout = html.Div([
    dcc.Graph(id='bezier-curve'),
    html.Div([
        html.Div([
            html.H5("Point P0", style={'textAlign': 'center'}),
            html.Div([
                html.Label('x0', style={'paddingTop': '10px'}),
                dcc.Slider(
                    id='x0-slider', 
                    min=-5, 
                    max=5, 
                    value=0, 
                    step=0.1, 
                    marks={i: str(i) for i in range(-5, 6)},
                    tooltip={"placement": "bottom", "always_visible": False},
                    className='dcc_control'
                ),
                html.Label('y0', style={'paddingTop': '10px'}),
                dcc.Slider(
                    id='y0-slider', 
                    min=-5, 
                    max=5, 
                    value=0, 
                    step=0.1, 
                    marks={i: str(i) for i in range(-5, 6)},
                    tooltip={"placement": "bottom", "always_visible": False},
                    className='dcc_control'
                ),
            ], style={'padding': '10px'}),
        ], className='three columns'),

        html.Div([
            html.H5("Point P1", style={'textAlign': 'center'}),
            html.Div([
                html.Label('x1', style={'paddingTop': '10px'}),
                dcc.Slider(
                    id='x1-slider', 
                    min=-5, 
                    max=5, 
                    value=1, 
                    step=0.1, 
                    marks={i: str(i) for i in range(-5, 6)},
                    tooltip={"placement": "bottom", "always_visible": False},
                    className='dcc_control'
                ),
                html.Label('y1', style={'paddingTop': '10px'}),
                dcc.Slider(
                    id='y1-slider', 
                    min=-5, 
                    max=5, 
                    value=2, 
                    step=0.1, 
                    marks={i: str(i) for i in range(-5, 6)},
                    tooltip={"placement": "bottom", "always_visible": False},
                    className='dcc_control'
                ),
            ], style={'padding': '10px'}),
        ], className='three columns'),

         html.Div([
            html.H5("Point P2", style={'textAlign': 'center'}),
            html.Div([
                html.Label('x2', style={'paddingTop': '10px'}),
                dcc.Slider(
                    id='x2-slider', 
                    min=-5, 
                    max=5, 
                    value=2, 
                    step=0.1, 
                    marks={i: str(i) for i in range(-5, 6)},
                    tooltip={"placement": "bottom", "always_visible": False},
                    className='dcc_control'
                ),
                html.Label('y2', style={'paddingTop': '10px'}),
                dcc.Slider(
                    id='y2-slider', 
                    min=-5, 
                    max=5, 
                    value=0, 
                    step=0.1, 
                    marks={i: str(i) for i in range(-5, 6)},
                    tooltip={"placement": "bottom", "always_visible": False},
                    className='dcc_control'
                ),
            ], style={'padding': '10px'}),
        ], className='three columns'),
        html.Div([
            html.H5("Parameter t"),
            dcc.Slider(id='t-slider', min=0, max=1, value=0, step=0.01, marks={i/10: str(i/10) for i in range(0, 11)},
                       tooltip={"placement": "bottom", "always_visible": False})
        ], className='three columns'),
    ], className='row', style={'marginTop': '20px', 'marginBottom': '50px'})
], style={'textAlign': 'center', 'width': '90%', 'maxWidth': '1100px', 'margin': '0 auto'})


@app.callback(
    Output('bezier-curve', 'figure'),
    [Input('t-slider', 'value'),
     Input('x0-slider', 'value'),
     Input('y0-slider', 'value'),
     Input('x1-slider', 'value'),
     Input('y1-slider', 'value'),
     Input('x2-slider', 'value'),
     Input('y2-slider', 'value')]
)
def update_graph(t, x0, y0, x1, y1, x2, y2):
    ctx = callback_context

    if not ctx.triggered:
        trigger_id = 'No inputs yet...'
    else:
        trigger_id = ctx.triggered[0]['prop_id'].split('.')[0]

    P0 = (x0, y0)
    P1 = (x1, y1)
    P2 = (x2, y2)

    # Compute the Bézier curve
    t_values = np.linspace(0, 1, 100)
    curve_points = [quadratic_bezier(t_val, P0, P1, P2) for t_val in t_values]
    curve_x, curve_y = zip(*curve_points)

    # Point at current t value
    point_t = quadratic_bezier(t, P0, P1, P2)

    # Intermediate points for construction lines
    point_t1 = ((1-t)*x0 + t*x1, (1-t)*y0 + t*y1)
    point_t2 = ((1-t)*x1 + t*x2, (1-t)*y1 + t*y2)

    # Create Plotly traces
    trace_curve = go.Scatter(x=curve_x, y=curve_y, mode='lines', name='Bézier Curve')
    trace_control_points = go.Scatter(x=[x0, x1, x2], y=[y0, y1, y2], mode='markers', name='Control Points', marker=dict(color='red'))
    trace_point_t = go.Scatter(x=[point_t[0]], y=[point_t[1]], mode='markers', name=f'Point at t={t:.2f}', marker=dict(color='green', size=12))
    trace_construction_lines = go.Scatter(x=[x0, x1, x1, x2, point_t1[0], point_t2[0]], y=[y0, y1, y1, y2, point_t1[1], point_t2[1]], mode='lines', name='Construction Lines', line=dict(dash='dash', color='magenta'))

    # Combine traces into a figure
    figure = {
        'data': [trace_curve, trace_control_points, trace_point_t, trace_construction_lines],
        'layout': go.Layout(
            title='Quadratic Bézier Curve with t Parameter',
            xaxis={'title': 'X', 'range': [-5, 5]},
            yaxis={'title': 'Y', 'range': [-5, 5]},
            margin={'l': 40, 'b': 40, 't': 40, 'r': 10},
            legend={'x': 0, 'y': 1},
            hovermode='closest'
        )
    }

    return figure


if __name__ == '__main__':
    app.run_server(debug=True)
