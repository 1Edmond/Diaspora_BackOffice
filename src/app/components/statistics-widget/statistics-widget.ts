import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountUpDirective } from 'ngx-countup';

@Component({
  selector: 'app-statistics-widget',
  standalone: true,
  imports: [CommonModule, CountUpDirective],
  templateUrl: './statistics-widget.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StatisticsWidgetComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) value!: number;
  @Input() prefix?: string = '';
  @Input() suffix?: string = '';
  @Input() icon: string = 'solar:chart-square-bold-duotone';
  @Input() avatarClass: string = 'bg-soft-primary text-primary';
  @Input() trend?: { value: number; isUp: boolean; text?: string };
  @Input() decimalPlaces?: number;

  get calculatedDecimals(): number {
    if (this.decimalPlaces !== undefined) return this.decimalPlaces;
    return Number.isInteger(this.value) ? 0 : 2;
  }
}
