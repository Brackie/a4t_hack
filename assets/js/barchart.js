var ctx = document.getElementById("barchart")

function getData(url)
{
    fetch(url)
    .then(response => response.json())
    .then(data => data)
}

function splitAmount(data)
{
    let arr = new Array();

    let inKind = data.filter((datum)=>{return datum.amount == 'INKIND'});

    arr.push(inKind);
    arr.push(data.filter((datum) => {return datum.amount != 'INKIND'}));
    
    return arr;
}

function splitRecepient(data)
{
    let arr = new Array();
    arr.push(data.filter((datum)=>{return datum.recepient == "National Government"}));  // National
    arr.push(data.filter((datum)=>{return datum.recepient != "National Government"}));  // County
    return arr;
}

function getCountyTotals(county, county_data)
{
    let countyInfo = county_data.filter((datum)=>{return data.counties.includes(county)});
    return countyInfo.reduce((datum)=>{return datum.amount})
}

var barchart = new Chart(ctx, {
    type:'bar',
    data: {
        datasets: [{
            label: '',
            data: [],
            borderWidth: 1
        }],
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});