import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewRecipe } from './create-new-recipe';

describe('CreateNewRecipe', () => {
  let component: CreateNewRecipe;
  let fixture: ComponentFixture<CreateNewRecipe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewRecipe],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateNewRecipe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
