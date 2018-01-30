Object.defineProperty(exports, "__esModule", { value: true });
const frameModule = require("ui/frame");
//const Observable = require("data/observable").Observable;
//var pageData = new Observable();

var ObservableArray = require("data/observable-array").ObservableArray;

var observableModule = require("data/observable");

var SingleViewModel = require("./single-view-model");

var http = require("http");
var config = require("../shared/config");

var view = require("ui/core/view");
var page;

var ingredient_array = [];
var direction_array = [];

//const SingleViewModel = require("./single-view-model");

/* ***********************************************************
* Use the "onNavigatingTo" handler to initialize the page binding context.
*************************************************************/
function onNavigatingTo(args) {
    /* ***********************************************************
    * The "onNavigatingTo" event handler lets you detect if the user navigated with a back button.
    * Skipping the re-initialization on back navigation means the user will see the
    * page in the same data state that he left it in before navigating.
    *************************************************************/
    if (args.isBackNavigation) {
        return;
    }

    page = args.object;
    //page.bindingContext = pageData;

    page.bindingContext = SingleViewModel.instance;

    while (ingredient_array.length) {
            ingredient_array.pop();
    }

    while (direction_array.length) {
            direction_array.pop();
    }

    const context = page.navigationContext;
    set_recipe_info(context.tapped_recipe);
    set_recipe_ingedients(context.tapped_recipe['recipe_id']);
    set_recipe_directions(context.tapped_recipe['recipe_id']);

    SingleViewModel.instance.set('selectedDay', 0);
}


function set_recipe_ingedients(recipe_id){
    http.getJSON(config.apiUrl + "get_ingredients/" + recipe_id)
    .then(function(ingredients) {
        for (var i = 0; i < ingredients.length; i++) {
            ingredient_array.push(
                {
                    name: ingredients[i].name,
                    unit_name: ingredients[i].unit_name,
                    quantity: ingredients[i].quantity,
                    selected: false
                }
            );
        }
        var ingredient_list = view.getViewById(page, "ingredient_list");
        ingredient_list.items = ingredient_array; 
    }, function(error) {
        console.error(JSON.stringify(error));
    });
}

exports.ingredient_toggle_selected = function(args) {
    ingredient_array[args.index].selected = !ingredient_array[args.index].selected;
    var ingredient_list = view.getViewById(page, "ingredient_list");
    ingredient_list.items = ingredient_array;
    ingredient_list.refresh();
}

function set_recipe_directions(recipe_id){
    http.getJSON(config.apiUrl + "get_directions/" + recipe_id)
    .then(function(directions) {
        for (var i = 0; i < directions.length; i++) {
            direction_array.push(
                {
                    direct_order: directions[i].direct_order,
                    direction: directions[i].direction,
                    selected: false
                }
            );
        }
        var direction_list = view.getViewById(page, "direction_list");
        direction_list.items = direction_array;
    }, function(error) {
        console.error(JSON.stringify(error));
    });
}

exports.direction_toggle_selected = function(args) {
    direction_array[args.index].selected = !direction_array[args.index].selected;
    var direction_list = view.getViewById(page, "direction_list");
    direction_list.items = direction_array;
    direction_list.refresh();
}

function set_recipe_info(recipe){
    SingleViewModel.instance.set('img_src', recipe['img_src']);
    SingleViewModel.instance.set('recipe_name', recipe['recipe_name']);

    http.getJSON(config.apiUrl + "get_recipe/" + recipe['recipe_id'])
    .then(function(recipe_info) {
        SingleViewModel.instance.set('recipe_overview', recipe_info[0].recipe_overview);
        SingleViewModel.instance.set('ingredient_num', recipe_info[0].ingredient_count);
        SingleViewModel.instance.set('cooking_time', recipe_info[0].cook_time);
    }, function(error) {
        console.error(JSON.stringify(error));
    });
}

/* ***********************************************************
* According to guidelines, if you have a drawer on your page, you should always
* have a button that opens it. Get a reference to the RadSideDrawer view and
* use the showDrawer() function to open the app drawer section.
*************************************************************/
function onDrawerButtonTap(args) {
    const sideDrawer = frameModule.topmost().getViewById("sideDrawer");
    sideDrawer.showDrawer();
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;

