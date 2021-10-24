#!/usr/bin/env python
# coding: utf-8

# In[1]:


import numpy as np
import matplotlib.pyplot as plt
from scipy.interpolate import RegularGridInterpolator

def interp_with_drift(point_1_y = 2,
                      point_2_y = 3,
                      G_1_x=1):
    ## defining the dips position
    G_1 = np.array([[0., 1.]])

    G_1_x = G_1_x
    G_1_y = 1

    G_1_tiled = np.tile(G_1, [2, 1])

    # In[3]:

    def squared_euclidean_distance(x_1, x_2):
        try:
            sqd = np.sqrt(np.reshape(np.sum(x_1 ** 2, 1), newshape=(x_1.shape[0], 1)) + \
                          np.reshape(np.sum(x_2 ** 2, 1), newshape=(1, x_2.shape[0])) - \
                          2 * (x_1 @ x_2.T))
        except RuntimeWarning:
            sqd = 0.

        return sqd

    # In[5]:

    def cartesian_dist(x_1, x_2):
        return np.concatenate([
            np.tile(x_1[:, 0] - np.reshape(x_2[:, 0], [x_2.shape[0], 1]), [1, 2]),
            np.tile(x_1[:, 1] - np.reshape(x_2[:, 1], [x_2.shape[0], 1]), [1, 2])], axis=0)

    h_u = cartesian_dist(G_1, G_1)
    h_v = h_u.T

    # In[5]:

    a = np.concatenate([np.ones([G_1.shape[0], G_1.shape[0]]), np.zeros([G_1.shape[0], G_1.shape[0]])], axis=1)
    b = np.concatenate([np.zeros([G_1.shape[0], G_1.shape[0]]), np.ones([G_1.shape[0], G_1.shape[0]])], axis=1)

    perpendicularity_matrix = np.concatenate([a, b], axis=0)

    # In[7]:

    dist_tiled = squared_euclidean_distance(G_1_tiled, G_1_tiled)

    # In[8]:

    a_T = 5
    c_o_T = a_T ** 2 / 14 / 3

    # In[9]:

    def cov_gradients(dist_tiled):
        
        condition1 = 0
        a = (h_u*h_v)
        b = dist_tiled**2

        t1 =  np.divide(a, b, out=np.zeros_like(a), where=b!=0)
        t2 = -c_o_T*((-14/a_T**2)+
                    105/4*dist_tiled/a_T**3 -
                    35/2 * dist_tiled**3 / a_T **5 +
                    21 /4 * dist_tiled**5/a_T**7)+\
            c_o_T * 7 * (9 * dist_tiled ** 5 -
                        20 * a_T ** 2 * dist_tiled ** 3 +
                        15 * a_T ** 4 * dist_tiled -
                        4 * a_T ** 5) / (2 * a_T ** 7)
        t3 = perpendicularity_matrix * \
            c_o_T * ((-14 / a_T ** 2) + 105 / 4 * dist_tiled / a_T ** 3 -
                    35 / 2 * dist_tiled ** 3 / a_T ** 5 +
                    21 / 4 * dist_tiled ** 5 / a_T ** 7)
        t4 = 1/3*np.eye(dist_tiled.shape[0])

        condition2 = t1 * t2 - t3 + t4

        C_G = np.where(dist_tiled==0, condition1, condition2) ## adding nugget effect
        return C_G


    # In[10]:

    dist_tiled = dist_tiled + np.eye(dist_tiled.shape[0])

    C_G = cov_gradients(dist_tiled)

    C_G

    # ### covariance of interface points

    # In[11]:

    # layer1 = np.array([[0, 0], [2, 0]])
    # layer2 = np.array([[0, 2], [2, 2]])

    layer1 = np.array([[0, 0], [2, 0], [3, 0], [4, 0]])
    layer2 = np.array([[0, 2], [2, point_1_y], [3, point_2_y]])

    number_of_layer = 2

    # In[11]:

    number_of_points_per_surface = np.array([layer1.shape[0], layer2.shape[0]])

    # In[13]:

    def set_rest_ref_matrix(number_of_points_per_surface):
        ref_layer_points = np.repeat(np.stack([layer1[-1], layer2[-1]], axis=0),
                                     repeats=number_of_points_per_surface - 1, axis=0)
        rest_layer_points = np.concatenate([layer1[0:-1], layer2[0:-1]], axis=0)
        return ref_layer_points, rest_layer_points

    # In[14]:

    ref_layer_points, rest_layer_points = set_rest_ref_matrix(number_of_points_per_surface)

    # In[15]:

    sed_rest_rest = squared_euclidean_distance(rest_layer_points, rest_layer_points)
    sed_ref_rest = squared_euclidean_distance(ref_layer_points, rest_layer_points)
    sed_rest_ref = squared_euclidean_distance(rest_layer_points, ref_layer_points)
    sed_ref_ref = squared_euclidean_distance(ref_layer_points, ref_layer_points)

    # In[16]:

    def cov_interface(ref_layer_points, rest_layer_points):
        sed_rest_rest = squared_euclidean_distance(rest_layer_points, rest_layer_points)
        sed_ref_rest = squared_euclidean_distance(ref_layer_points, rest_layer_points)
        sed_rest_ref = squared_euclidean_distance(rest_layer_points, ref_layer_points)
        sed_ref_ref = squared_euclidean_distance(ref_layer_points, ref_layer_points)

        C_I = c_o_T * ((1 - 7 * (sed_rest_rest / a_T) ** 2 + 35 / 4 * (sed_rest_rest / a_T) ** 3 - 7 / 2 * (
                sed_rest_rest / a_T) ** 5 + 3 / 4 * (sed_rest_rest / a_T) ** 7) - (
                               1 - 7 * (sed_ref_rest / a_T) ** 2 + 35 / 4 * (sed_ref_rest / a_T) ** 3 - 7 / 2 * (
                               sed_ref_rest / a_T) ** 5 + 3 / 4 * (sed_ref_rest / a_T) ** 7) - (
                               1 - 7 * (sed_rest_ref / a_T) ** 2 + 35 / 4 * (sed_rest_ref / a_T) ** 3 - 7 / 2 * (
                               sed_rest_ref / a_T) ** 5 + 3 / 4 * (sed_rest_ref / a_T) ** 7) + (
                               1 - 7 * (sed_ref_ref / a_T) ** 2 + 35 / 4 * (sed_ref_ref / a_T) ** 3 - 7 / 2 * (
                               sed_ref_ref / a_T) ** 5 + 3 / 4 * (sed_ref_ref / a_T) ** 7))

        return C_I

    # In[17]:

    C_I = cov_interface(ref_layer_points, rest_layer_points)

    # In[18]:

    C_I

    # ### Covariance of interface points and gradients

    # In[19]:

    sed_dips_rest = squared_euclidean_distance(G_1_tiled, rest_layer_points)
    sed_dips_ref = squared_euclidean_distance(G_1_tiled, ref_layer_points)

    # In[20]:

    ## Cartesian distance between dips and interface points

    def cartesian_dist_no_tile(x_1, x_2):
        return np.concatenate([
            np.transpose((x_1[:, 0] - np.reshape(x_2[:, 0], [x_2.shape[0], 1]))),
            np.transpose((x_1[:, 1] - np.reshape(x_2[:, 1], [x_2.shape[0], 1])))], axis=0)

    hu_rest = cartesian_dist_no_tile(G_1, rest_layer_points)
    hu_ref = cartesian_dist_no_tile(G_1, ref_layer_points)

    # In[21]:

    def cov_interface_gradients(hu_rest, hu_ref):
        C_GI = (hu_rest * (- c_o_T * ((-14 / a_T ** 2) + 105 / 4 * sed_dips_rest / a_T ** 3 -
                                      35 / 2 * sed_dips_rest ** 3 / a_T ** 5 +
                                      21 / 4 * sed_dips_rest ** 5 / a_T ** 7)) - \
                hu_ref * (-c_o_T * ((-14 / a_T ** 2) + 105 / 4 * sed_dips_ref / a_T ** 3 -
                                    35 / 2 * sed_dips_ref ** 3 / a_T ** 5 +
                                    21 / 4 * sed_dips_ref ** 5 / a_T ** 7)))
        return C_GI

    # In[22]:

    C_GI = cov_interface_gradients(hu_rest, hu_ref)
    C_IG = C_GI.T

    # ### Kriging Matrix

    # In[23]:

    K = np.concatenate([np.concatenate([C_G, C_GI], axis=1),
                        np.concatenate([C_IG, C_I], axis=1)], axis=0)

    # In[26]:

    import pandas as pd
    pd.DataFrame(K)

    # In[27]:

    b = np.concatenate([[G_1_x, G_1_y], np.zeros(K.shape[0] - G_1.shape[0] * 2)], axis=0)
    b = np.reshape(b, newshape=[b.shape[0], 1])
    b

    # In[28]:

    w = np.linalg.solve(K, b)
    w

    # ### Interpolation without Universal term

    # In[29]:

    ## create grid

    xx = np.arange(-.5, 4.5, 0.1)
    yy = np.arange(-.5, 4.5, 0.1)
    XX, YY = np.meshgrid(xx, yy)
    X = (np.reshape(XX, [-1])).T
    Y = (np.reshape(YY, [-1])).T

    grid = np.stack([X, Y], axis=1)

    # In[30]:

    hu_Simpoints = cartesian_dist_no_tile(G_1, grid)

    # In[31]:

    sed_dips_SimPoint = squared_euclidean_distance(G_1_tiled, grid)

    # In[32]:

    # gradient contribution
    sigma_0_grad = w[:G_1.shape[0] * 2] * (
            -hu_Simpoints * (- c_o_T * ((-14 / a_T ** 2) + 105 / 4 * sed_dips_SimPoint / a_T ** 3 -
                                        35 / 2 * sed_dips_SimPoint ** 3 / a_T ** 5 +
                                        21 / 4 * sed_dips_SimPoint ** 5 / a_T ** 7)))

    sigma_0_grad = np.sum(sigma_0_grad, axis=0)

    # In[33]:

    sed_rest_SimPoint = squared_euclidean_distance(rest_layer_points, grid)
    sed_ref_SimPoint = squared_euclidean_distance(ref_layer_points, grid)

    # In[34]:

    # surface point contribution
    sigma_0_interf = -w[G_1.shape[0] * 2:] * (c_o_T * ((1 - 7 * (sed_rest_SimPoint / a_T) ** 2 +
                                                        35 / 4 * (sed_rest_SimPoint / a_T) ** 3 -
                                                        7 / 2 * (sed_rest_SimPoint / a_T) ** 5 +
                                                        3 / 4 * (sed_rest_SimPoint / a_T) ** 7) -
                                                       (1 - 7 * (sed_ref_SimPoint / a_T) ** 2 +
                                                        35 / 4 * (sed_ref_SimPoint / a_T) ** 3 -
                                                        7 / 2 * (sed_ref_SimPoint / a_T) ** 5 +
                                                        3 / 4 * (sed_ref_SimPoint / a_T) ** 7)))
    sigma_0_interf = np.sum(sigma_0_interf, axis=0)

    # In[35]:

    interpolate_result = sigma_0_grad + sigma_0_interf
    intp = np.reshape(interpolate_result, [50, 50])

    # In[36]:

    #
    # plt.contour(XX,YY,intp)
    # plt.colorbar()
    # plt.plot(layer1[:,0], layer1[:,1], 'ro')
    # plt.plot(layer2[:,0], layer2[:,1], 'bo')
    #
    # plt.plot(G_1[0,0], G_1[0,1], 'go')

    # ## add drift term

    # In[37]:

    U = np.concatenate([np.eye(number_of_layer),
                        np.stack([ref_layer_points[:, 0] - rest_layer_points[:, 0],
                                  ref_layer_points[:, 1] - rest_layer_points[:, 1]])], axis=1)

    U_T = U.T

    # In[38]:

    ### new K matrix

    zero_matrix = np.zeros([2, 2])

    K_U = np.concatenate([np.concatenate([K, U_T], axis=1), np.concatenate([U, zero_matrix], axis=1)], axis=0)

    # In[39]:

    pd.DataFrame(K_U)

    # In[40]:

    ### universal contribution
    sigma_0_1st_drift = np.sum(grid * (w[-2:]).T, axis=1)
    sigma_0_1st_drift

    # In[41]:

    # rhs b-vector
    b = np.concatenate([[G_1_x, G_1_y], np.zeros(K_U.shape[0] - G_1.shape[0] * 2)], axis=0)
    b = np.reshape(b, newshape=[b.shape[0], 1])

    # In[42]:

    w = np.linalg.solve(K_U, b)
    w

    # In[43]:

    # gradient contribution
    sigma_0_grad = w[:G_1.shape[0] * 2] * (
            -hu_Simpoints * (- c_o_T * ((-14 / a_T ** 2) + 105 / 4 * sed_dips_SimPoint / a_T ** 3 -
                                        35 / 2 * sed_dips_SimPoint ** 3 / a_T ** 5 +
                                        21 / 4 * sed_dips_SimPoint ** 5 / a_T ** 7)))

    sigma_0_grad = np.sum(sigma_0_grad, axis=0)

    # surface point contribution
    sigma_0_interf = -w[G_1.shape[0] * 2:-2] * (c_o_T * ((1 - 7 * (sed_rest_SimPoint / a_T) ** 2 +
                                                          35 / 4 * (sed_rest_SimPoint / a_T) ** 3 -
                                                          7 / 2 * (sed_rest_SimPoint / a_T) ** 5 +
                                                          3 / 4 * (sed_rest_SimPoint / a_T) ** 7) -
                                                         (1 - 7 * (sed_ref_SimPoint / a_T) ** 2 +
                                                          35 / 4 * (sed_ref_SimPoint / a_T) ** 3 -
                                                          7 / 2 * (sed_ref_SimPoint / a_T) ** 5 +
                                                          3 / 4 * (sed_ref_SimPoint / a_T) ** 7)))
    sigma_0_interf = np.sum(sigma_0_interf, axis=0)

    # In[44]:

    sigma_0_1st_drift = np.sum(grid * (w[-2:]).T, axis=1)
    sigma_0_1st_drift

    # In[45]:

    interpolate_result = sigma_0_grad + sigma_0_interf + sigma_0_1st_drift

    intp = np.reshape(interpolate_result, [50, 50])  # reshape the result to matrix shape

    return intp


def plot_interp_with_drift(point_1_y = 2.,
                           point_2_y = 3.,
                           G_1_x=1.,
                           show_contours=False,
                           show_field=False,
                           pick_contour=False,
                           contour_val=2):

    intp = interp_with_drift(point_1_y=point_1_y,
                             point_2_y=point_2_y,
                             G_1_x=G_1_x)

    plt.figure(figsize=(14, 8))

    ## defining the dips position
    G_1 = np.array([[0., 1.]])

    G_1_x = 1
    G_1_y = 1

    G_1_tiled = np.tile(G_1, [2, 1])

    # layer1 = np.array([[0, 0], [2, 0]])
    # layer2 = np.array([[0, 2], [2, 2]])

    layer1 = np.array([[0, 0], [2, 0], [3, 0], [4, 0]])
    layer2 = np.array([[0, 2], [2, point_1_y], [3, point_2_y]])

    number_of_layer = 2

    ## create grid

    xx = np.arange(-.5, 4.5, 0.1)
    yy = np.arange(-.5, 4.5, 0.1)
    XX, YY = np.meshgrid(xx, yy)
    X = (np.reshape(XX, [-1])).T
    Y = (np.reshape(YY, [-1])).T

    grid = np.stack([X, Y], axis=1)

    if show_contours:
        plt.contour(XX, YY, intp, 20)
    if show_field:
        plt.pcolor(XX, YY, intp, alpha=0.6)

    if show_contours or show_field:
        try:
            plt.colorbar()
        except IndexError:
            pass

    if pick_contour:
        plt.contour(XX, YY, intp,
                    levels=np.array([contour_val]),
                    linewidths=3)

    plt.plot(layer1[:, 0], layer1[:, 1], 'ro')
    plt.plot(layer2[:, 0], layer2[:, 1], 'bo')

    plt.xlim([0,4.])
    plt.ylim([-.5,3.5])

    plt.plot(G_1[0, 0], G_1[0, 1], 'go')


def get_lithology_from_interp_with_drift(point_1_y = 2.,
                           point_2_y = 3.,
                           G_1_x = 1.):

    # similar to interp_with_drift, but not generating a plot, only returing the interpolated and mapped lithologies
    # for example for uncertainty quantification

    intp = interp_with_drift(point_1_y=point_1_y,
                             point_2_y=point_2_y,
                             G_1_x=G_1_x)

    xx = np.arange(-.5, 4.5, 0.1)
    yy = np.arange(-.5, 4.5, 0.1)
    XX, YY = np.meshgrid(xx, yy)
    X = (np.reshape(XX, [-1])).T
    Y = (np.reshape(YY, [-1])).T
    grid = np.stack([X, Y], axis=1)

    # perform regular grid interpolation
    my_interpolating_function = RegularGridInterpolator((xx, yy), intp.T)

    # extract lithologies
    layer_1_interp = np.ones((50, 50))
    layer_2_interp = np.ones((50, 50)) * 2

    l1_bool = interp < my_interpolating_function([0, 0])
    l2_bool = interp < my_interpolating_function([0, 2])
    layer_1_interp = l1_bool * layer_1_interp
    layer_2_interp = l2_bool * layer_2_interp

    return layer_1_interp + layer_2_interp


def create_litho_plot(layer_interp):
    plt.figure(figsize=(14, 8))
    xx = np.arange(-.5, 4.5, 0.1)
    yy = np.arange(-.5, 4.5, 0.1)
    XX, YY = np.meshgrid(xx, yy)
    plt.pcolor(XX, YY, layer_interp, alpha=0.6)

