import { NgModule, ComponentFactoryResolver, Injector, Type } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditDirective } from './edit.directive';
import { NonEditableTemplatesComponent } from './default-template/non-editable-templates.component';
import { nonEditableTemplatesToken } from './default-template/non-editable-templates.token';
import { ModuleWithProviders } from '@angular/compiler/src/core';

const nonEditableTemplatesFactory = (component: Type<any>) => (cfr: ComponentFactoryResolver, injector: Injector) => {
  return {
    ...cfr.resolveComponentFactory(NonEditableTemplatesComponent).create(injector).instance,
    ...cfr.resolveComponentFactory(component).create(injector).instance
  };
}

const nonEditableTemplatesProvider = (component: Type<any>) => ({
  provide: nonEditableTemplatesToken,
  useFactory: nonEditableTemplatesFactory(component),
  deps: [ComponentFactoryResolver, Injector]
})

@NgModule({
  declarations: [EditDirective, NonEditableTemplatesComponent],
  imports: [CommonModule],
  exports: [EditDirective],
  providers: [nonEditableTemplatesProvider(NonEditableTemplatesComponent)],
  entryComponents: [NonEditableTemplatesComponent]
})
export class EditModule {
  static withNonEditableTemplates(component: Type<any>): ModuleWithProviders {
    return {
      ngModule: EditModule,
      providers: [nonEditableTemplatesProvider(component)]
    }
  }
}
