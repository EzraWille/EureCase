import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { getCSSVariableValue } from '../../../../../../app/core/kt/_utils';
@Component({
  selector: 'app-counter-chart',
  templateUrl: './counter-chart.component.html',
  styleUrls: ['./counter-chart.component.scss']
})
export class CounterChartComponent implements OnInit , OnChanges {

  @Input() chartColor: string = '';
  @Input() chartHeight!: string;
  @Input() chartPercentage!: number;

  chartOptions: any = {};
  base:string = "#0778b9"
  constructor() {}


  ngOnInit(): void {
    this.chartOptions = this.getChartOptions(this.chartHeight, this.chartColor, this.chartPercentage);
}

ngOnChanges(changes: SimpleChanges): void {
  if (changes['chartPercentage'] && !changes['chartPercentage'].firstChange) {
      this.chartOptions = this.getChartOptions(this.chartHeight, this.chartColor, this.chartPercentage);
  }
}

  getChartOptions(chartHeight: string, chartColor: string ,chartPercentage: number) {
    const baseColor = getCSSVariableValue('--bs-' + chartColor);
    const lightColor = getCSSVariableValue('--bs-light-' + chartColor);
    const labelColor = getCSSVariableValue('--bs-gray-700');

    return {
      series: [chartPercentage],
      chart: {
        fontFamily: 'inherit',
        height: chartHeight,
        type: 'radialBar',

      },
      plotOptions: {

        radialBar: {
          hollow: {
            margin: 0,
             size: '65%',

          },
          dataLabels: {
            name: {
              show: false,
              fontWeight: '700',
            },
            value: {
              color: labelColor,
              fontSize: '30px',
              fontWeight: '700',
              offsetY: 12,
              show: true,
              formatter: function (val: number) {
                return val + '%';
              },
            },
          },
          track: {
            background: lightColor,
            strokeWidth: '100%',
          },
        },
      },
      colors: [baseColor],
      stroke: {
        lineCap: 'round',
      },
      labels: ['Progress'],
    };
  }

}

