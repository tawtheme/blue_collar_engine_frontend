import { Component } from '@angular/core';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss'],
})
export class FaqsComponent {
  ngOnInit(): void {
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach((item) => {
      item.addEventListener('show.bs.collapse', () => {
        accordionItems.forEach((i) => i.classList.remove('opened'));
        item.classList.add('opened');
      });
    });
  }
}
