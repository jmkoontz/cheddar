import React, { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import drilldown from 'highcharts/modules/drilldown.js';

drilldown(Highcharts);

const Pie = props => {
  const [chartData, setChartData] = useState();
  const [drilledDown, setDrilledDown] = useState(false);
  const [index, setIndex] = useState(-1);

  const getCategoryIndex = (category) => {
      for (let i in props.spendingByCategory) {
        if (props.spendingByCategory[i].name === category)
          return i;
      }
  };

  const buildChart = () => {
    let options = {
      chart: {
        type: 'pie',
        events: {
          drilldown: function(e) {
            console.log('drilling down')
            console.log(e)
            props.setTableMode('category');
            props.setTableCategory(e.seriesOptions.name);
            setDrilledDown(true);
            setIndex(getCategoryIndex(e.seriesOptions.name));
          },
          drillup: function(e) {
            console.log('drilling up')
            props.setTableMode('all');
            props.setTableCategory('');
            setDrilledDown(false);
            setIndex(-1);
          }
        }
      },
      title: {
        text: ''
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            format: '{point.name}: ${point.value:.2f}'
          }
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: `
          <span style="color:{point.color}">{point.name}</span>:
          <b>\${point.value:.2f}</b><br/>
          <b>{point.y:.2f}%</b> of total`
      },
      series: [
        {
          name: 'Categories',
          colorByPoint: true,
          data: []
        }
      ],
      drilldown: {
        series: []
      }
    };

    let totalSpending = 0;
    for (let i in props.spendingByCategory)
      totalSpending += props.spendingByCategory[i].spent;

    for (let i in props.spendingByCategory) {
      const slice = {
        name: props.spendingByCategory[i].name,
        y: (props.spendingByCategory[i].spent / totalSpending) * 100,
        value: props.spendingByCategory[i].spent,
        drilldown: props.spendingByCategory[i].name
      };

      const drilldown = {
        name: slice.name,
        id: slice.name,
        data: []
      };

      for (let j in props.spendingByCategory[i].transactions) {
        let data = {
          name: props.spendingByCategory[i].transactions[j].name,
          y: (props.spendingByCategory[i].transactions[j].amount / slice.value) * 100,
          value: props.spendingByCategory[i].transactions[j].amount
        };

        drilldown.data.push(data);
      }

      options.series[0].data.push(slice);
      options.drilldown.series.push(drilldown);
    }

    if (drilledDown) {
      console.log('drilled down, resetting')
      console.log(options);
      // options.series[0].data[0].firePointEvent('click');
    }

    setChartData(options);
  };

  useEffect(
    () => {
      if (props.spendingByCategory && props.spendingByCategory.length) {
        console.log('spending updated')
        buildChart();
      }
    },
    [props.spendingByCategory]
  );

  return (
    <div>
      <HighchartsReact allowChartUpdate={true} highcharts={Highcharts} options={chartData} />
    </div>
  );
};

export default Pie;
