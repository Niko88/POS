import { POSPage } from './app.po';

describe('pos App', function() {
  let page: POSPage;

  beforeEach(() => {
    page = new POSPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
