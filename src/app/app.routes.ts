import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./data-input/data-input.module').then(m => m.DataInputModule)
    },
    {
        path: 'results',
        loadChildren: () => import('./data-output/data-output.module').then(m => m.DataOutputModule)
    }
];
