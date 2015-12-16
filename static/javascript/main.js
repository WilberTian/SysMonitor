$(function(){
    var systemInfoViewModel;
    var initBinding = true;
    
    var totalPoints = 50;
    var plotOptions = {
        series: {
            shadowSize: 0
        },
        yaxis: {
            min: 0,
            max: 100
        },
        xaxis: {
            show: false
        }
    }
    
    var memoryDiagramObj = {
        "memoryData": [],
        "memoryPlot": null,
        "init": function(){
            // init Memory diagram based on logical core number
            $(".diagram-row").append('<div class="diagram-container col-md-2"><div id="memoryDiagram" class="diagram-placeholder"></div></div>');
            for (var i = 0; i < totalPoints; ++i) {
                this.memoryData.push([i, 0])
            }
            this.memoryPlot = $.plot("#memoryDiagram", [{label: "Memory(%)", data: this.memoryData}], plotOptions);
            
        },
        "update": function(result){
            // update diagram timely with the data from server
            for (var i = 0; i < totalPoints-1; ++i) {
                this.memoryData[i][1] = this.memoryData[i+1][1]
            }
            this.memoryData[totalPoints-1][1] = result["memoryInfo"]["virtual_memory_percent"];
            this.memoryPlot.setData([this.memoryData]);
            this.memoryPlot.draw();
        }
        
    }
    
    var cpuDiagramObj = {
        "coreNum":1,
        "cpuData": [],
        "cpuPlot": [],
        "init": function(result){
            // init CPU diagram based on logical core number
            this.coreNum = result["cpuInfo"]["logical_core"];
        
            for(var j = 0; j < this.coreNum; j++){
                $(".diagram-row").append('<div class="diagram-container col-md-2"><div id="cpuDiagram'+j+'" class="diagram-placeholder"></div></div>');
                this.cpuData[j] = []
                for (var i = 0; i < totalPoints; i++) {
                    
                    this.cpuData[j].push([i, 0])
                }  
                temp = $.plot("#cpuDiagram"+j, [{label: "core " + (j+1), data: this.cpuData[j]}], plotOptions);
                
                this.cpuPlot.push(temp);
            }
        },
        "update": function(result){
            // update diagram timely with the data from server
            for(var j = 0; j < this.coreNum; j++){
                for (var i = 0; i < totalPoints - 1; i++) {
                    this.cpuData[j][i][1] = this.cpuData[j][i+1][1];
                }  
                this.cpuData[j][totalPoints-1][1] = result["cpuInfo"]["cpu_percent"][j]["percent"];   
                this.cpuPlot[j].setData([this.cpuData[j]]);
                this.cpuPlot[j].draw();
            }
        }
    }
    
    function longPolling(){
        setTimeout(function(){
            $.ajax({
                url: "/system_info",
                error: function (XMLHttpRequest, textStatus, errorThrown) {

                },
                success: function (result, textStatus) {
                    if(initBinding){
                        systemInfoViewModel = ko.mapping.fromJS(result);
                        ko.applyBindings(systemInfoViewModel); 
                        initBinding = false;
                        $('#over').hide();
                        $('#layout').hide();
                        cpuDiagramObj.init(result);
                        memoryDiagramObj.init();
                    }
                    else{
                        ko.mapping.fromJS(result, systemInfoViewModel);
                        
                        memoryDiagramObj.update(result);
                        cpuDiagramObj.update(result);
                    }
                },
                complete: longPolling,
            });
        }, 500);
    }
      
    // use long polling to get system info from server
    longPolling();
    
})
