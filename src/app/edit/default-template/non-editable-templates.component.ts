import { Component, ViewChild, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-default-template',
  template: `
    <ng-template #defaultTmpl let-control>
      <span class="not-editable-default">{{ control.value }}</span>
    </ng-template>
  `,
})
export class NonEditableTemplatesComponent {
  @ViewChild('defaultTmpl') defaultTmpl: TemplateRef<any>;
}
