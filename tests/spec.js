// spec.js
describe('IoTSchool Test App', function() {
  var url = 'http://127.0.0.1:8080';
  var email = "rryanavila9@gmail.com";
  var pass = "deco3801lhc";


  it('should have a title on Landing ', function() {
    console.log("Testing Title on Landing Page")
    browser.get(url);
    expect(browser.getTitle()).toEqual('IoT School');
});

    it('Login with Wrong Password', function() {
    console.log("Testing Login with Wrong Password");
    browser.get(url);
    browser.driver.sleep(1000);
    element(by.id('loginbutton')).click().then(function(){
        browser.driver.sleep(100);
        element(by.id('useremail')).sendKeys("rryanavila9@gmail.com");
        element(by.id('passwordlogin')).sendKeys("deco3801lhca");
        element(by.id('submitlogin')).click();
        browser.driver.sleep(2000);
        var alertDialog = browser.switchTo().alert();
        expect(alertDialog.getText()).toEqual("Wrong Password");
        browser.driver.sleep(1000);
        alertDialog.accept();
    });
});

  it('Login Working', function() {
    console.log("Testing Login");
    browser.get(url);
    browser.driver.sleep(500);
    element(by.id('loginbutton')).click().then(function(){
       browser.driver.sleep(100);
       element(by.id('useremail')).sendKeys(email);
       element(by.id('passwordlogin')).sendKeys(pass);
       element(by.id('submitlogin')).click();
       browser.driver.sleep(3000);
       expect(browser.getTitle()).toEqual('Dashboard | IoT School');
       expect(element(by.id('loginuser')).getInnerHtml()).toEqual('Signed In as IoT School');
   });
});

  it('should have a title on School Landing ', function() {
    console.log("Testing Title on School Landing Page");
    browser.get(url+'/schools/');
    expect(browser.getTitle()).toEqual('Dashboard | IoT School');
});

  it('should have a title on Photon Page Landing ', function() {
    console.log("Testing Title on Photon Page Landing Page");
    browser.get(url+'/schools/photon.html');
    expect(browser.getTitle()).toEqual('Photon Management | IoT School');
});

  it('will test the photon exsistence ', function() {
    console.log("Testing Photon");
    browser.get(url+'/schools/photon.html');
    browser.driver.sleep(3000);
    var count = element.all(by.repeater('photon in photons'));
    count.then(function(result){
        expect(result.length).toBeGreaterThan(1);
    });
});

 it('Check correct title', function() {
    browser.get(url+'/schools/data.html');
    browser.driver.sleep(2000);
    expect(browser.getTitle()).toEqual('Data | IoT School');
 });

 it('Check all items returned are correct type', function () {
    console.log("Test Correct Type");
     browser.driver.sleep(1000);
     element(by.id("temperatureCheck")).click().then(function() {
         element(by.id("searchData")).click().then(function() {
            browser.driver.sleep(2000);
            element(by.id('searchData')).click();
            browser.driver.sleep(5000);
            element.all(by.repeater('event in eventgroup').column('event.data.type').row(0)).then(function(args){
                console.log(args.getText());
                expect(args.getText()).toContain('temperature');
            })
         });
     });
 });

  it('should Logout ', function() {
    console.log("Testing Logout")
    browser.get(url+'/schools/');
    element(by.id('logoutbutton')).click();
    browser.driver.sleep(100);
    expect(browser.getTitle()).toEqual('IoT School');
});


});
