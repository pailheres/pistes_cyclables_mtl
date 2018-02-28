# pistes_cyclables_mtl
- format Montreal cycling infrastructure geojson file to be able to load it in a layer in https://www.openstreetmap.org/
- the geojson file come from here : http://donnees.ville.montreal.qc.ca/dataset/pistes-cyclables

# python module to install
within anaconda prompt you need to install packages with the following commands :
 - conda install pyproj

# start jupyter
within anaconda prompt, go to this the directory where you cloned this project and start jupyter with the following command :
 - jupyter notebook

In the browser page, open the pistes_cyclable_mtl.ipynb notebook and run all the cells
A formated geojson output file will be created in the data_out dir. This will be the file used to the webpage
You can view the result by loading index.html into a web browser