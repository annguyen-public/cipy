var point2star = require('~/shared/common.js');
var config = require("../../shared/config");
var observableModule = require("data/observable");
var fetchModule = require("fetch");
var ObservableArray = require("data/observable-array").ObservableArray;

function RecipeListViewModel(items) {
    var viewModel = new ObservableArray(items);

    viewModel.load = function(offset) {
    	return fetch(config.apiUrl + "newest_recipes/" + offset)
    	.then(handleErrors)
    	.then(function(response) {
        	return response.json();
    	}).then(function(recipes) {
            for (var i = 0; i < recipes.length; i++) {
                var stars = point2star(recipes[i].point);
                viewModel.push({
                    recipe_id: recipes[i].id,
                    img_src: recipes[i].img_url,
                    recipe_name: recipes[i].recipe_name,
                    user_name: recipes[i].name,
                    star1: String.fromCharCode(stars[0]),
                    star2: String.fromCharCode(stars[1]),
                    star3: String.fromCharCode(stars[2]),
                    star4: String.fromCharCode(stars[3]),
                    star5: String.fromCharCode(stars[4])
                });
            }
    	});
	};

	viewModel.empty = function() {
    	while (viewModel.length) {
        	viewModel.pop();
    	}
    };

    return viewModel;
}

function handleErrors(response) {
    if (!response.ok) {
        console.log(JSON.stringify(response));
        throw Error(response.statusText);
    }
    return response;
}

module.exports = RecipeListViewModel;