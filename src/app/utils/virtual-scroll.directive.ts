import { Directive, ElementRef, Input, OnInit, OnDestroy, signal, computed } from '@angular/core';

@Directive({
  selector: '[appVirtualScroll]',
  standalone: true
})
export class VirtualScrollDirective implements OnInit, OnDestroy {
  @Input() itemHeight = 200; // Altura estimada de cada item
  @Input() bufferSize = 5; // Itens extras para renderizar fora da viewport
  
  private container!: HTMLElement;
  private scrollListener?: () => void;
  
  visibleRange = signal({ start: 0, end: 10 });
  
  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.container = this.el.nativeElement;
    this.setupVirtualScroll();
  }

  ngOnDestroy() {
    if (this.scrollListener) {
      this.container.removeEventListener('scroll', this.scrollListener);
    }
  }

  private setupVirtualScroll() {
    this.scrollListener = () => {
      const scrollTop = this.container.scrollTop;
      const containerHeight = this.container.clientHeight;
      
      const start = Math.max(0, Math.floor(scrollTop / this.itemHeight) - this.bufferSize);
      const visibleCount = Math.ceil(containerHeight / this.itemHeight);
      const end = start + visibleCount + (this.bufferSize * 2);
      
      this.visibleRange.set({ start, end });
    };

    this.container.addEventListener('scroll', this.scrollListener, { passive: true });
    
    // Calcular range inicial
    this.scrollListener();
  }
}