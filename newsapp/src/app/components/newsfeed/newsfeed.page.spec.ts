import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewsfeedPage } from './newsfeed.page';

describe('NewsfeedPage', () => {
  let component: NewsfeedPage;
  let fixture: ComponentFixture<NewsfeedPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsfeedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
