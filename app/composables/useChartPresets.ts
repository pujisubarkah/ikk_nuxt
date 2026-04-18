type ChartOptions = Record<string, any>;

type BaseOptionsInput = {
  type: string;
  height?: number;
};

type BarHorizontalOptionsInput = {
  categories: string[];
  height?: number;
  stacked?: boolean;
};

type RadarOptionsInput = {
  categories: string[];
  height?: number;
  fillOpacity?: number;
};

type LineOptionsInput = {
  categories: string[];
  height?: number;
  smooth?: boolean;
  curve?: 'smooth' | 'straight' | 'stepline';
};

type PieOptionsInput = {
  labels: string[];
  height?: number;
  donut?: boolean;
  donutSize?: string;
  legendPosition?: 'top' | 'right' | 'bottom' | 'left';
};

export function useChartPresets() {
  const base = ({ type, height = 350 }: BaseOptionsInput): ChartOptions => ({
    chart: {
      type,
      height,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 450,
      },
    },
    legend: {
      position: 'top',
      fontSize: '13px',
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 4,
    },
  });

  const barHorizontal = ({
    categories,
    height = 350,
    stacked = false,
  }: BarHorizontalOptionsInput): ChartOptions => {
    const baseOptions = base({ type: 'bar', height });

    return {
      ...baseOptions,
      chart: {
        ...baseOptions.chart,
        stacked,
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 4,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories,
      },
    };
  };

  const radar = ({
    categories,
    height = 350,
    fillOpacity = 0.2,
  }: RadarOptionsInput): ChartOptions => ({
    ...base({ type: 'radar', height }),
    xaxis: {
      categories,
    },
    fill: {
      opacity: fillOpacity,
    },
    stroke: {
      width: 2,
    },
    markers: {
      size: 4,
      hover: {
        size: 6,
      },
    },
  });

  const line = ({
    categories,
    height = 350,
    smooth = true,
    curve,
  }: LineOptionsInput): ChartOptions => ({
    ...base({ type: 'line', height }),
    stroke: {
      curve: curve ?? (smooth ? 'smooth' : 'straight'),
      width: 3,
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      hover: {
        size: 7,
      },
    },
    xaxis: {
      categories,
    },
  });

  const pie = ({
    labels,
    height = 350,
    donut = false,
    donutSize = '65%',
    legendPosition = 'right',
  }: PieOptionsInput): ChartOptions => {
    const chartType = donut ? 'donut' : 'pie';
    const baseOptions = base({ type: chartType, height });

    return {
      ...baseOptions,
      labels,
      legend: {
        ...baseOptions.legend,
        position: legendPosition,
      },
      plotOptions: donut
        ? {
            pie: {
              donut: {
                size: donutSize,
              },
            },
          }
        : undefined,
    };
  };

  return {
    base,
    barHorizontal,
    radar,
    line,
    pie,
  };
}