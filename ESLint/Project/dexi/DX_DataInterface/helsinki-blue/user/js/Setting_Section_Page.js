

let wb; //读取完成的数据
// let chartData;
let myChart;


window.onload = function() {
    // setMyChartData();
    
}

//导入
function importf(obj) { 
    if (!obj.files) {
        return;
    }
    let f = obj.files[0];
    let reader = new FileReader();
    reader.onload = function (e) {
        let data = e.target.result;

        wb = XLSX.read(data, {
            type: 'binary'
        });
        
        // let sheetData = JSON.stringify(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]));
        // let sheetData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        let sheetData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        // console.log('sheetData: ', sheetData);

        // 验证表格数据是否有效
        // 先判断是否有数据

        // 非两列、某一列有无效数据、x轴数据非递增，直接return

        // 按两列中最短长度截取另一列长度，确保长度一致

        // 创建保存数据的对象
        let excelData = {
            x: [],
            y: []
        };

        let tableData = [];

        for (const key in sheetData) {
            if (sheetData.hasOwnProperty(key)) {
                const element = sheetData[key];

                // 是数值，转成number
                excelData.x.push(Number(element.x));
                excelData.y.push(Number(element.y));
                
                let tableObj = {
                    "x-value": Number(element.x),
                    "y-value": Number(element.y)
                }

                tableData.push(tableObj);
            }
        }

        // 刷新表格数据
        layui.use('table', function () {
            var table = layui.table;
            g_table_config.data = tableData;
        
            table.render(g_table_config);
        
        });

        // 刷新折线图数据
        setMyChartData(excelData);
    };

    reader.readAsBinaryString(f);
}

// 设置折线图 模拟断面图形
function setMyChartData(chartData) {
    //  如果 echart 实例存在
    if (myChart != null && myChart != "" && myChart != undefined) {
        //  销毁实例
        myChart.dispose();
    }
    //  基于准备好的dom，初始化echarts实例
    myChart = echarts.init(document.getElementById('echartDemo'));

    let option = {
        title: {
            text: '河道断面',
            x: 'center'
        },
        tooltip : {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        grid: {
            left: '3%',
            right: '12%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                name: '岸边距离（米）',
                type : 'category',
                boundaryGap : false,
                data : chartData.x
            }
        ],
        yAxis : [
            {
                name: '河道高程（米）',
                type : 'value',
                max: 700
            }
        ],
        series : 
            {
                name: '河道高程（米）',
                data: chartData.y,
                type: 'line',
                smooth: true, //  是否为平滑曲线
                itemStyle: {
                    normal: {
                        color: '#666', //  折线颜色
                    }
                },
                areaStyle: { //  折线下是否填充
                    normal: {}
                }
            }
    };
    
    //  用于使chart自适应高度和宽度, 因为初始隐藏的标签在初始化图表的时候因为获取不到容器的实际高宽，可能会绘制失败
    $(window).on('resize', function () {
        myChart.resize();
    });
    myChart.setOption(option);
}

// table表格配置
var g_table_config = {
    elem: '#table_view',
    data: null,
    limit: 1000,
    height: 'full-110',
    cellMinWidth: 135, 
    cols: [[
        { field: 'x-value', title: '岸边距离（米）', },
        { field: 'y-value', title: '河道高程（米）', },
    ]],
};

layui.use('table', function () {
    var table = layui.table;

    table.render(g_table_config);

});

function initTableView(tableData) {
    layui.use('table', function () {
        var table = layui.table;
        g_table_config.data = tableData;
    
        table.render(g_table_config);
    
    });
    
}

