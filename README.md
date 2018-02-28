# pistes_cyclables_mtl
- format Montreal cycling infrastructure geojson file to be able to load it in a layer in https://www.openstreetmap.org/
- the geojson file come from here : http://donnees.ville.montreal.qc.ca/dataset/pistes-cyclables

# Anaconda
Install latest version of anaconda (python 3.x or more) from https://www.anaconda.com/download/ 

# python module to install
within anaconda prompt you need to install packages with the following commands :
 - conda install pyproj

# Start jupyter
within anaconda prompt, go to the directory where you cloned this project and start jupyter with this command :
 - jupyter notebook

# Jupyter
In the browser page, open the pistes_cyclable_mtl.ipynb notebook and run all the cells
A formated geojson output file will be created in the data_out dir. This will be the file used to the webpage

# View in web browser
You can view the result by loading index.html into a web browser