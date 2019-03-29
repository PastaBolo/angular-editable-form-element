import { Directive, ViewContainerRef, TemplateRef, Input, Inject } from '@angular/core';
import { ControlContainer } from '@angular/forms';

import { nonEditableTemplatesToken } from './default-template/non-editable-templates.token';

@Directive({
  selector: '[edit]'
})
export class EditDirective {
  @Input() editControlName: string;
  @Input() editTemplateType: string;

  @Input() set edit(enabled: boolean) {
    let tmpl = this.tmpl;
    let context = {};

    this.vcr.clear();

    if (!enabled) {
      const type = this.editTemplateType || 'defaultTmpl'
      if (!this.nonEditableTemplates[type]) throw new Error(`${type} template is not defined`);

      tmpl = this.nonEditableTemplates[type];
      context = { $implicit: this.controlContainer.control.get(this.editControlName) };
    }

    this.vcr.createEmbeddedView(tmpl, context);
  }

  constructor(
    private vcr: ViewContainerRef,
    private tmpl: TemplateRef<any>,
    @Inject(nonEditableTemplatesToken) private nonEditableTemplates: any,
    private controlContainer: ControlContainer
  ) { }
}
