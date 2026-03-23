import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Point } from '../../models/optimize-response';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnChanges {
  @Input() points: Point[] = [];
  @Input() routes: number[][] = [];
  @ViewChild('mapCanvas') mapCanvas!: ElementRef<HTMLCanvasElement>;

  readonly vehicleColors = ['#007bff', '#6610f2', '#e83e8c', '#fd7e14', '#20c997', '#17a2b8'];

  ngOnChanges(changes: SimpleChanges): void {
    if (this.points && this.routes) {
      if (this.mapCanvas) {
        this.drawMap();
      } else {
        setTimeout(() => this.drawMap());
      }
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.drawMap();
  }

  private drawMap() {
    if (!this.mapCanvas?.nativeElement) return;
    
    const canvas = this.mapCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fix scaling by adjusting canvas physical size to matches display size
    canvas.width = canvas.parentElement?.clientWidth || 600;
    canvas.height = 400; // fixed height

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (this.points.length === 0) return;

    // Calculate bounding box
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    this.points.forEach(p => {
      if (p.x < minX) minX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.x > maxX) maxX = p.x;
      if (p.y > maxY) maxY = p.y;
    });

    const padding = 30; // some padding so dots don't cut off at edges
    const width = canvas.width - padding * 2;
    const height = canvas.height - padding * 2;
    
    // Scale factors
    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;
    const scaleX = width / rangeX;
    const scaleY = height / rangeY;

    // Function to map coordinate
    const mapCoord = (x: number, y: number) => ({
      cx: padding + (x - minX) * scaleX,
      cy: canvas.height - (padding + (y - minY) * scaleY) // Invert Y so higher is at the top
    });

    // Draw Routes
    this.routes.forEach((route, vIndex) => {
      if (route.length < 2) return;
      
      const vColor = this.vehicleColors[vIndex % this.vehicleColors.length];
      ctx.beginPath();
      ctx.strokeStyle = vColor;
      ctx.lineWidth = 2;

      for (let i = 0; i < route.length; i++) {
        const pId = route[i];
        const p = this.points.find(point => point.id === pId);
        if (p) {
          const { cx, cy } = mapCoord(p.x, p.y);
          if (i === 0) ctx.moveTo(cx, cy);
          else ctx.lineTo(cx, cy);
        }
      }
      ctx.stroke();
    });

    // Draw Points
    this.points.forEach(p => {
      const { cx, cy } = mapCoord(p.x, p.y);
      
      let color = '#ccc'; // default
      // Depot vs Customer (Assuming id 0 is depot, often colored differently but user specified priorities)
      if (p.priority === 3) color = '#ff4d4d'; // vermelho
      else if (p.priority === 2) color = '#ffcc00'; // amarelo
      else if (p.priority === 1) color = '#33cc33'; // verde
      
      // se id for 0, pode ser uma cor especial, mas vou assumir default black se não bater
      if (p.id === 0) color = '#000000'; // Depot usually ID 0

      ctx.beginPath();
      ctx.arc(cx, cy, p.id === 0 ? 8 : 6, 0, 2 * Math.PI); // Depot slightly larger
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#fff'; // white border
      ctx.lineWidth = 1;
      ctx.stroke();

      // draw ID
      ctx.fillStyle = '#000';
      ctx.font = 'bold 10px Arial';
      ctx.fillText(p.id.toString(), cx + 8, cy - 8);
    });
  }
}
