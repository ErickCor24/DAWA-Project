import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-button',
  imports: [MatButtonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent implements OnInit{
  
  @Input() name: string = '';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() class: string = ''; 
  @Output() clicked = new EventEmitter<string>;
  
  ngOnInit(): void {
  }

  onClick(){
    this.clicked.emit();
  }
}
