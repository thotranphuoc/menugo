import { Injectable } from '@angular/core';

declare var google: any;

@Injectable()

export class GchartService {

    constructor(
    ) { }

    // draw a pie chart
    drawChart(TITLE: string, WIDTH: number, HEIGHT: number, DATA_ARRAY: any[]) {
        return new Promise((resolve, reject) => {
            console.log('starting draw chart');
            let data = new google.visualization.DataTable();
            data.addColumn('string', 'Product');
            data.addColumn('number', 'Total');
            data.addRows(DATA_ARRAY);
            let options = {
                'title': TITLE,
                // 'width': WIDTH,
                // 'height': HEIGHT
            }
            resolve({ data: data, options: options });
        })
    }
}
