import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
import { ThemeMode } from 'config';
import { getChartData } from 'pages/utils/prospects/api';


const areaChartOptions = {
  chart: {
    type: 'area',
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    width: 1
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      type: 'vertical',
      inverseColors: false,
      opacityFrom: 0.5,
      opacityTo: 0
    }
  },
  grid: {
    strokeDashArray: 4
  }
};

const filterDataByTimeframe = (data, filter) => {
  const filterMap = {
    "Last 3 months": 3,
    "Last 6 months": 6,
    "Last 12 months": 12
  };

  const monthsToShow = filterMap[filter] || 12;
  // reverse for getting latest months******************
  return data.slice(0, monthsToShow).reverse(); 
};

const RepeatCustomerChart = ({ selectedFilter }) => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch data*****************
        const response = await getChartData();

        // filter the data*******************
        const filteredData = filterDataByTimeframe(response, selectedFilter); 

        // Extract month names******************
        const categories = filteredData.map(item => item.month); 
        
        // Extract counts*********************
        const seriesData = filteredData.map(item => item.count);   

        setOptions((prevState) => ({
          ...prevState,
          colors: ["#4a00e5", "#4a00e5"],
          xaxis: {
            ...prevState.xaxis,
            categories,
            labels: {
              style: {
                colors: new Array(categories.length).fill(secondary)
              }
            }
          },
          yaxis: {
            labels: {
              style: {
                colors: [secondary]
              }
            }
          },
          grid: {
            borderColor: line
          },
          theme: {
            mode: mode === ThemeMode.DARK ? 'dark' : 'light'
          }
        }));

        // Update series with dynamic data ***********$$$$$******$$$$$$$$$$$$$$$
        setSeries([{
          name: 'Page Views',
          data: seriesData
        }]);

      } catch (error) {
        console.error("Error fetching chart data: ", error);
      } finally {
        // Stop loading once data is fetched*************
        setLoading(false);  
      }
    };

    fetchData();
  }, [mode, primary, secondary, line, theme, selectedFilter]);//dependancy &&&&&&&&&&&*************

  return loading ? <div>Loading...</div> : <ReactApexChart options={options} series={series} type="area" height={260} />;
};

export default RepeatCustomerChart;
