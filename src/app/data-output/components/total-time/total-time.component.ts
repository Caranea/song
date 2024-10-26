import { Component, ViewChild, inject } from '@angular/core';
import { ChartOptions, ChartType, ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { JsonHandlerService } from '../../../data-input/services/json-reader/json-reader.service';
import { combineLatest, map, zip } from 'rxjs';
import { IndexedDbService } from '../../../shared/indexedDB/services/db-service/indexed-db.service';

@Component({
  selector: 'app-total-time',
  templateUrl: './total-time.component.html',
  standalone: true,
  imports: [BaseChartDirective],
  styleUrl: './total-time.component.scss',
})
export class TotalTimeComponent {
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;
  private jsonHandlerService = inject(JsonHandlerService);
  private indexedDBService = inject(IndexedDbService);

  constructor() {
    this.jsonHandlerService.years$.subscribe((years) => {
      this.barChartData.labels = years;

      const observableArray = [];
      const data: number[] = [];

      for (let year of years) {
        observableArray.push(this.jsonHandlerService.getEntriesByYear(year));
      }

      zip(...observableArray).subscribe((entriesByYear) => {
        entriesByYear.forEach((entries, index) => {
          entries.forEach((entry) => {
            data[index] = data[index] ? data[index] + entry.occurrenceCount : entry.occurrenceCount;
        })
        this.barChartData.datasets[0].data = data;
        this.barChartData = { ...this.barChartData }
      })

  })})}
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
  };

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [
    ],
    datasets: [
      {
        label: 'Songs listened to in a year',
        backgroundColor: 'rgb(79, 70, 229, 0.4)',
        data: [],
      },
    ]
  }
}
