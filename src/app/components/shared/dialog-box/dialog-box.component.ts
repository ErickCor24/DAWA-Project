import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-box',
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './dialog-box.component.html',
  styleUrl: './dialog-box.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogBoxComponent implements OnInit {

  readonly dialogRef = inject(MatDialogRef<DialogBoxComponent>);
  readonly data = inject(MAT_DIALOG_DATA);


  @Input() title: string = '';
  @Input() info: string = '';

  @Output() clicked = new EventEmitter<boolean>;


  ngOnInit(): void {
    this.title = this.data.title;
    this.info = this.data.info;
   }

  confirmationDialog = () => {
    this.clicked.emit(true);
    this.dialogRef.close(true);
  }
}
