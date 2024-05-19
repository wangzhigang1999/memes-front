import {AfterViewInit, Directive, ElementRef, EventEmitter, OnDestroy, Output} from '@angular/core';

@Directive({
  selector: '[appLazyLoad]'
})
export class LazyLoadDirective implements AfterViewInit, OnDestroy {
  @Output() lazyLoad = new EventEmitter<void>();

  private observer: IntersectionObserver | undefined;

  constructor(private element: ElementRef) {
  }

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.lazyLoad.emit();
          // @ts-ignore
          this.observer.unobserve(this.element.nativeElement);
        }
      });
    });

    this.observer.observe(this.element.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
