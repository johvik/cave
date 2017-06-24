import { CavePage } from './app.po';

describe('cave App', () => {
  let page: CavePage;

  beforeEach(() => {
    page = new CavePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect<any>(page.getParagraphText()).toEqual('Sensors');
  });
});
