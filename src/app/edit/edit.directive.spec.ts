import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Component, ViewChild, TemplateRef } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { EditModule } from './edit.module';

const form = new FormGroup({
  firstname: new FormControl('James'),
  date: new FormControl('14/07/1789')
});

@Component({
  template: `
    <ng-template #dateTmpl let-control>
      <span class="not-editable-date">{{ control.value }}</span>
    </ng-template>
  `
})
class NonEditableTemplates {
  @ViewChild('dateTmpl') dateTmpl: TemplateRef<any>;
}

@Component({
  template: `
    <ng-template #defaultTmpl let-control>
      <span class="override-not-editable-default">{{ control.value }}</span>
    </ng-template>
  `
})
class OverrideDefaultTemplate {
  @ViewChild('defaultTmpl') defaultTmpl: TemplateRef<any>;
}

@Component({
  template: `
    <form [formGroup]="form">
      <input type="text" *edit="edition; controlName: 'firstname'" formControlName="firstname">
    </form>
  `
})
class WithoutTemplateHostComponent {
  edition: boolean;
  form = form;
}

@Component({
  template: `
    <form [formGroup]="form">
      <input type="text" *edit="edition; controlName: 'firstname'" formControlName="firstname">
      <input type="date" *edit="edition; controlName: 'date'; templateType: 'dateTmpl'" formControlName="date">
    </form>
  `
})
class WithTemplatesHostComponent {
  edition: boolean;
  form = form;
}

class HostView {
  constructor(private fixture) { }
  get input() { return this.fixture.debugElement.query(By.css('input')); }
  get defaultTemplate() { return this.fixture.debugElement.query(By.css('.not-editable-default')); }
  get dateTemplate() { return this.fixture.debugElement.query(By.css('.not-editable-date')); }
  get overrideDefaultTemplate() { return this.fixture.debugElement.query(By.css('.override-not-editable-default')); }
}

fdescribe('EditDirective', () => {

  describe('Without additional non-editable templates', () => {
    let component: WithoutTemplateHostComponent;
    let fixture: ComponentFixture<WithoutTemplateHostComponent>;
    let hostView: HostView;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [WithoutTemplateHostComponent],
        imports: [ReactiveFormsModule, EditModule]
      });
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(WithoutTemplateHostComponent);
      component = fixture.componentInstance;
      hostView = new HostView(fixture);
    });

    describe('edition is disabled', () => {
      beforeEach(() => {
        component.edition = false;
        fixture.detectChanges();
      });

      it('should display the not editable templates', () => {
        expect(hostView.defaultTemplate).toBeTruthy();
        expect(hostView.defaultTemplate.nativeElement.textContent).toContain(form.get('firstname').value);

        expect(hostView.input).toBeFalsy();
      });
    });

    describe('edition is enabled', () => {
      beforeEach(() => {
        component.edition = true;
        fixture.detectChanges();
      });

      it('should display the default template', () => {
        expect(hostView.defaultTemplate).toBeFalsy();
        expect(hostView.input).toBeTruthy();
      });
    });
  });

  describe('With non-editable templates defined in a component', () => {
    let component: WithTemplatesHostComponent;
    let fixture: ComponentFixture<WithTemplatesHostComponent>;
    let hostView: HostView;

    beforeEach(() => {
      TestBed
        .configureTestingModule({
          declarations: [WithTemplatesHostComponent, NonEditableTemplates],
          imports: [ReactiveFormsModule, EditModule.withNonEditableTemplates(NonEditableTemplates)]
        })
        .overrideModule(BrowserDynamicTestingModule, {
          set: { entryComponents: [NonEditableTemplates] }
        });
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(WithTemplatesHostComponent);
      component = fixture.componentInstance;
      hostView = new HostView(fixture);
    });

    describe('edition is disabled', () => {
      beforeEach(() => {
        component.edition = false;
        fixture.detectChanges();
      });

      it('should display the not editable templates', () => {
        expect(hostView.defaultTemplate).toBeTruthy();
        expect(hostView.defaultTemplate.nativeElement.textContent).toContain(form.get('firstname').value);

        expect(hostView.dateTemplate).toBeTruthy();
        expect(hostView.dateTemplate.nativeElement.textContent).toContain(form.get('date').value);

        expect(hostView.input).toBeFalsy();
      });
    });

    describe('edition is enabled', () => {
      beforeEach(() => {
        component.edition = true;
        fixture.detectChanges();
      });

      it('should display the default template and the date template', () => {
        expect(hostView.defaultTemplate).toBeFalsy();
        expect(hostView.dateTemplate).toBeFalsy();
        expect(hostView.input).toBeTruthy();
      });
    });
  });

  describe('With custom non-editable default template', () => {
    let component: WithoutTemplateHostComponent;
    let fixture: ComponentFixture<WithoutTemplateHostComponent>;
    let hostView: HostView;

    beforeEach(() => {
      TestBed
        .configureTestingModule({
          declarations: [WithoutTemplateHostComponent, OverrideDefaultTemplate],
          imports: [ReactiveFormsModule, EditModule.withNonEditableTemplates(OverrideDefaultTemplate)]
        })
        .overrideModule(BrowserDynamicTestingModule, {
          set: { entryComponents: [OverrideDefaultTemplate] }
        });
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(WithoutTemplateHostComponent);
      component = fixture.componentInstance;
      hostView = new HostView(fixture);
    });

    describe('edition is disabled', () => {
      beforeEach(() => {
        component.edition = false;
        fixture.detectChanges();
      });

      it('should display the not editable templates', () => {
        expect(hostView.overrideDefaultTemplate).toBeTruthy();
        expect(hostView.overrideDefaultTemplate.nativeElement.textContent).toContain(form.get('firstname').value);

        expect(hostView.input).toBeFalsy();
      });
    });

    describe('edition is enabled', () => {
      beforeEach(() => {
        component.edition = true;
        fixture.detectChanges();
      });

      it('should display the default template and the date template', () => {
        expect(hostView.overrideDefaultTemplate).toBeFalsy();
        expect(hostView.input).toBeTruthy();
      });
    });
  });
});