
var webdriver = require('selenium-webdriver'),

    driver = new webdriver.Builder()
        //.usingServer('http://localhost:4445/wd/hub')
        .withCapabilities({
          username: 'project_implicit'
          , accessKey: 'a6aa63fe-29fa-464b-b273-303cae01f461'
          , browserName: 'firefox'
          , tags: ["e2e","testing","IAT"]
          , name: "IAT e2e test"
        })
        .build();



function getStimuli(){
	return driver.executeScript(function(){
		var trial = require('app/trial/current_trial')();

		if (!trial){
			return false;
		} else {
			return {
				stim: trial._stimulus_collection.first().attributes.data,
				id: trial._id
			};
		}
	});
}

function action(data){

	if (!data){
		return false;
	}

	var key = false;
	var stimData = data.stim;

	if (stimData.handle == 'instructions') {
		key = ' ';
	} else {
		if (!stimData.side){
			return false;
		}
		key = stimData.side == 'left' ? 'e' : 'i';
	}
	console.log(stimData,key);
	// press correct key
	driver.findElement({tagName:'body'}).sendKeys(key);

	// wait for the next trial (wait for trial_id change...)
	driver.wait(function(){
		return driver.executeScript(function(trial_id){
			return require('app/trial/current_trial')()._id !== trial_id;
		}, data.id);
	});

	return true;
}

function progress(){
	getStimuli().then(action).then(function(ok){
		if (ok){
			progress();
		} else {
			driver.executeScript(function(){
				return window.jsErrors;
			}).then(function(jsErrors){
				console.log(jsErrors);
				if (jsErrors.length){
					//throw new Error('js Errors encountered');
				}
			});

			driver.quit();
		}

	});
}



driver.manage().timeouts().setScriptTimeout(10000);


// navigate to page
//driver.get('https://dw2.psyc.virginia.edu/implicit/common/all/js/pip-0.1.0/dist/index.jsp?i=../examples/iat.js');
driver.get('http://localhost/pip/dist/index.html?url=../examples/iat.js')
//	driver.get('https://dw2.psyc.virginia.edu/implicit/common/all/js/pip-0.1.0/src/index.html?url=../examples/iat.js')
	.then(function(){
		driver.executeAsyncScript(function(){
			var callback = arguments[arguments.length -1];
			window.jsErrors = [];
			window.onerror = function(errorMessage) {
				window.jsErrors[window.jsErrors.length] = errorMessage;
			};

			require(['js/config'],function(){
				require(['jquery'],function($){
					$( document ).ajaxError(function( event, request, settings ) {
						throw new Error ("Error requesting page: " + settings.url );
					});
				});
				callback.call(null, "jsErrors activated");
			});
		});
	});

// wait for first trial to be ready
driver.wait(function(){
	return driver.executeScript(function(){
		return require.defined('app/trial/current_trial') && require('app/trial/current_trial')()._id;
	});

}).then(progress);

