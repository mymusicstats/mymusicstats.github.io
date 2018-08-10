describe('My Music Stats Submit button test', function() {
  it('should take the username & fetch details', function() {
    browser.driver.get('http://localhost/~admin/mymusicstats/');
    expect(browser.driver.getTitle()).toEqual('My Music Stats - Visualise your Last.fm data, analyse your music habits.');
    browser.driver.findElement(by.id('userName')).sendKeys('shashnk-ssriva');
    browser.driver.findElement(by.id('submitBtn')).click();
  });
});
