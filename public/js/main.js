$(document).ready(function(){
  $(".ct_menu_bar").click(function(){
    $("main").addClass("ct_active");
  })
  $(".ct_close_sidebar").click(function(){
    $("main").removeClass("ct_active");
  })
})
 $(window).on("load", function () {
    $(".ct_loader_main").fadeOut();
  });


var options = {
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      series: [
        {
          name: 'Dataset 1',
          data: [30, 40, 25, 45, 35, 20, 30, 0] // purple bars
        },
        {
          name: 'Dataset 2',
          data: [0, 50, 0, 50, 0, 60, 0, 70] // green bars
        }
      ],
      colors: ['#6A5ACD', '#002FAA'], // purple and green
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug'],
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          }
        }
      }
    };

    var chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();


    var options2 = {
      chart: {
        type: 'line',
        height: 350,
        id: 'chart2' // New chart ID
      },
       colors: ['#002FAA'],
      series: [{
        name: 'Sales',
        data: [1.5e6, 1.4e6, 1.3e6, 1.35e6, 2e6, 2.2e6, 2e6, 2.5e6, 2.1e6, 1.9e6, 2e6, 2.3e6]
      }],
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return (val / 1e6).toFixed(1) + "M";
          }
        }
      },
      markers: {
        size: 4,
        hover: {
          sizeOffset: 6
        }
      },
      stroke: {
        curve: 'smooth'
      }
    };

    var chart = new ApexCharts(document.querySelector("#chart2"), options2);
    chart.render();



      var options3 = {
      chart: {
        type: 'donut',
        id: 'myDonutChartId',
        height: 300
      },
      series: [20, 25, 35, 20], // Example values
      labels: ['Golf Clubs', 'Balls & Accessories', 'Apparel', 'Others'],
      colors: ['#CDDBFF', '#003DDD', '#061F61', '#7C9BEE'], // Custom colors
      dataLabels: {
        enabled: false
      },
      legend: {
        position: 'right'
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              total: {
                show: true,
                label: '',
                formatter: function (w) {
                  return '64%'; // Center label
                }
              }
            }
          }
        }
      }
    };

    var chart = new ApexCharts(document.querySelector("#myDonutChartId"), options3);
    chart.render();