import { Component, ViewChild, inject } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { JsonHandlerService } from '../../../data-input/services/json-reader/json-reader.service';
import { map, zip } from 'rxjs';
@Component({
  selector: 'app-top-artists',
  templateUrl: './top-artists.component.html',
  standalone: true,
  imports: [BaseChartDirective],
  styleUrl: './top-artists.component.scss'
})
export class TopArtistsComponent {
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;
  private jsonHandlerService = inject(JsonHandlerService);

  constructor() {
    this.jsonHandlerService.years$.subscribe((years) => {
      this.lineChartData.labels = years;

      const artistsDataset: {
        label: string;
        data: number[];
        fill: boolean;
        tension: number;
        borderColor: string;
        backgroundColor: string;
      }[] = []

      const observableArray = [];

      for (let year of years) {
        observableArray.push(this.jsonHandlerService.topArtistsByYear(year).pipe(map(topArtists => topArtists.splice(0, 5))));
      }

      zip(...observableArray).subscribe((topArtistsByYears) => {
        topArtistsByYears.forEach((topArtists, index) => {
          topArtists.forEach((artist) => {
            const dataset = artistsDataset.find((dataset) => dataset.label.toLowerCase().trim() === artist.artist.toLowerCase().trim());
            if (!dataset) {
              const dataset = {
                label: artist.artist,
                data: new Array(years.length).fill(0),
                fill: true,
                tension: 0.5,
                borderColor: `hsla(${Math.floor(Math.random() * 360)}, 82%, 57%, 0.3)`
                ,
                backgroundColor: 'rgba(255,0,0,0.0)'
              }
              dataset.data[index] = artist.cumulativeListens;
              artistsDataset.push(dataset)
            } else {
              dataset.data[index] = artist.cumulativeListens;
            }
          })
        })
        this.lineChartData.datasets = artistsDataset;
        this.lineChartData = { ...this.lineChartData }
      })

    });
  }

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
    ],
    datasets: [
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          boxHeight: 3,
        },
        onClick: (event, item) => {
          const mappedDatasets = this.lineChartData.datasets.map((dataset) => {
            if (dataset.label === item.text) {
              dataset.borderColor = (dataset.borderColor as string).slice(0, -2) + '9)';
            } else {
              dataset.borderColor = (dataset.borderColor as string).slice(0, -2) + '1)';
            }
            return dataset;
          })
          this.lineChartData.datasets = mappedDatasets;
          this.updateChart();
        }
      }
    }
  };

  public lineChartLegend = true;

  private updateChart() {
    if (this.chart && this.chart.chart && this.chart.chart.config) {
      this.chart.chart.update();
    }
  }
}
