import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from '../../components/shared/dialog-box/dialog-box.component';
import { map, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DialogService {



  constructor(private dialog: MatDialog, private router: Router) { }

  openDialog = (title: string, info: string, runFunction: () => void, path?: string): Observable<boolean> => {
    const dialogref = this.dialog.open(DialogBoxComponent, {
      data: { title, info }
    });

    return dialogref.afterClosed().pipe(
      map(x => x === true),
      tap(confirmed => {
        if (confirmed) {
          runFunction();
          if (path) {
            this.router.navigate([path]);
          }
        }
      })
    )
  }

}
