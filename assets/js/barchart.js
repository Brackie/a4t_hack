var chart = document.getElementById('chart');
$(document).ready(function(){
    switchChart('bar-chart');
    $(document).on('click', '.dropdown-content a', function(event) {
        console.log($(this).attr('id'));
        switchChart($(this).attr('id'));
    });
    $('#total-aid').text(getTotalAid(splitAmount(funding)[1]));
});

function switchChart(id){
    if (id == 'bar-chart') {
        getAmounts();
        $('#title').text('Total Cash Donations');
    } else if(id == 'pie-chart'){
        getCounties();
        $('#title').text('Money Disbursed Per County');
    }
}

function getAmounts(){
    let amounts = splitAmount(funding);

    var mycanvas = document.createElement("canvas");
    var ctx = mycanvas.getContext('2d');

    var barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: amounts[0],
            datasets: [
            {
                barThickness: 40,
                maxBarThickness: 50,
                minBarLength: 2,
                label: 'Amount Disbursed',
                data: amounts[1],
                backgroundColor: bgColors(amounts[1].length)
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        display: false
                    },
                    gridLines: {
                        display: false
                    }
                }],
                xAxes: [{
                    ticks: {
                        beginAtZero: true,
                        display: false
                    },
                    gridLines: {
                        display: false
                    }
                }]
            },
            legend: {
                display: false
            },
            responsive: true,
            responsiveAnimationDuration: 0
        }
    });

    chart.innerHTML = '';
    chart.append(mycanvas);
}

function getCounties(){
    // getting county totals
    let cntyData = splitRecepient(funding)[1].filter((da)=>{ return da.amount !== 'INKIND'; });
    let counties = getValidCounties(cntyData);
    let countyAmounts = counties.map((county)=>{
        return getCountyTotals(county, cntyData)
    });

    var mycanvas = document.createElement("canvas");
    var ctx = mycanvas.getContext('2d');

    var doughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: counties,
            datasets: [{
                label: 'Amount',
                data: countyAmounts,
                backgroundColor: bgColors(counties.length)
            }]
        },
        options: {
            cutoutPercentage: 75,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        display: false
                    },
                    gridLines: {
                        display: false
                    }
                }],
                xAxes: [{
                    ticks: {
                        beginAtZero: true,
                        display: false
                    },
                    gridLines: {
                        display: false
                    }
                }]
            },
            legend: {
                position: 'right'
            },
            responsive: true,
            responsiveAnimationDuration: 0
        }
    });

    chart.innerHTML = '';
    chart.append(mycanvas);
}

// function getGovt(){
//     // getting county totals
//     let cntyData = splitRecepient(funding)[1].filter((da)=>{ return da.amount !== 'INKIND'; });
//     let counties = getValidCounties(cntyData);
//     let countyAmounts = counties.map((county)=>{
//         return getCountyTotals(county, cntyData)
//     });

//     var mycanvas = document.createElement("canvas");
//     var ctx = mycanvas.getContext('2d');

//     var doughnutChart = new Chart(ctx, {
//         type: 'polarArea',
//         data: {
//             labels: ,
//             datasets: [{
//                 label: 'Amount',
//                 data: countyAmounts,
//                 backgroundColor: bgColors(counties.length)
//             }]
//         },
//         options: {
//             cutoutPercentage: 75,
//             scales: {
//                 yAxes: [{
//                     ticks: {
//                         beginAtZero: true,
//                         display: false
//                     },
//                     gridLines: {
//                         display: false
//                     }
//                 }],
//                 xAxes: [{
//                     ticks: {
//                         beginAtZero: true,
//                         display: false
//                     },
//                     gridLines: {
//                         display: false
//                     }
//                 }]
//             },
//             legend: {
//                 position: 'right'
//             },
//             responsive: true,
//             responsiveAnimationDuration: 0
//         }
//     });

//     chart.innerHTML = '';
//     chart.append(mycanvas);
// }

function bgColors(arr_length){
    let bgCols = [];

    for (var i = 0; i < arr_length; i++)
        bgCols.push(randomRGB()); 

    return bgCols
}


function splitAmount(data)
{
    let arr = new Array();

    let inKind = data.filter((datum)=>{return datum.amount == 'INKIND'});
    let cash = data.filter((datum) => {return datum.amount != 'INKIND'});

    arr.push(cash.map((elem) => { return elem.date; }));
    arr.push(cash.map((elem)=> { return elem.amount; }));
    
    return arr;
}

function splitRecepient(data)
{
    let arr = new Array();
    arr.push(data.filter((datum)=>{return datum.recepient == "National Government"}));  // National
    arr.push(data.filter((datum)=>{return datum.recepient != "National Government"}));  // County
    return arr;
}

function getTotalAid(data)
{
    return data.reduce((elem)=>{ return elem; });
}

function getValidCounties(county_data)
{
    let counties = county_data.map((cty)=>{
        return cty.counties[0];
    });

    let uniqueCounties = Array.from(new Set(counties));
    return uniqueCounties;
}

function getCountyTotals(county, county_data)
{
    let countyInfo = county_data.filter((datum)=>{return datum.counties.includes(county)});
    let amounts = countyInfo.map((datum)=>{return datum.amount;});
    return amounts.reduce((datum)=>{return datum.amount})
}

function randomRGB(){
    function randomNum(max)
    {
        return Math.floor(Math.random(max) * Math.floor(max));
    }
    let r = randomNum(255);
    let g = randomNum(255);
    let b = randomNum(255);
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}

                // var salesCtx = document.getElementById('salesChart').getContext('2d');
                
                // var productCtx = document.getElementById('productsChart').getContext('2d');


                // var lineChart = new Chart(profitsCtx, {
                //     type: 'line',
                //     data: {
                //         labels: ['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5', 'Label 7'],
                //         datasets: [{
                //             label: 'Amount',
                //             data: [12, 19, 13, 15, 22, 23],
                //             backgroundColor: 'rgba(62, 70, 192)'
                //         }]
                //     },
                //     options: {
                //         scales: {
                //             yAxes: [{
                //                 ticks: {
                //                     beginAtZero: true,
                //                     display: false
                //                 },
                //                 gridLines: {
                //                     display: false
                //                 }
                //             }],
                //             xAxes: [{
                //                 ticks: {
                //                     beginAtZero: true,
                //                     display: false
                //                 },
                //                 gridLines: {
                //                     display: false
                //                 }
                //             }]
                //         },
                //         legend: {
                //             display: false
                //         },
                //         responsive: true,
                //         responsiveAnimationDuration: 0
                //     }
                // });

// function splitExpenditure(data){
//     let natGov = data.filter((datumn)=>{
//         return datum.expending_body == 'Nattional Government'
//     })
//     let countyGov = data.filter((datumn))
// }