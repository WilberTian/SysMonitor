# SysMonitor 
A simple tool to show the system info (CPU, Memroy, Disk, and process)   
1. Server side will use psutil to get system info and Flask-RESTful to proivde rest APIs   
2. Browser side will poll data from server; use knocoutjs to bind the data; also for CPU and Memroy usage, use flot.js to create realtime diagram

### Requirements   
install Python27   
pip install Flask-RESTful   
pip install psutil   

### Run   
python app.py

### Screenshot   
![sysmonitor](https://cloud.githubusercontent.com/assets/5880320/11862095/c6b41b80-a4c1-11e5-98aa-bd139880ff04.PNG)
