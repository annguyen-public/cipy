const frameModule = require("ui/frame");

const LunchViewModel = require("./lunch-view-model");

var observableModule = require("data/observable");
var ObservableArray = require("data/observable-array").ObservableArray;
var page;
var RecipeListViewModel = require("../shared/view-models/recipe-list-view-model");

var gestures = require("ui/gestures");

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

    const page = args.object;
    page.bindingContext = new LunchViewModel();
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


var recipeList = new RecipeListViewModel([]);
var pageData = new observableModule.fromObject({
    recipeList: recipeList,
    recipe: ""
});

var loaded_offset = 0;
const LOAD_LIMIT = 5;

function NavigateTo(pre_next){    
    var next_module = "";
    var name = "fade";
    if(pre_next == 'previous')
    {
        next_module = "breakfast_page/breakfast-page";
        name = "slideRight";
    }
    else if(pre_next == 'next')
    {
        next_module = "dinner_page/dinner-page";
        name = "slideLeft";
    }

    frameModule.topmost().navigate({
        moduleName: next_module,
        transition: {
            duration: 0,
            name: name
        }
    });
}

exports.loaded = function(args) {
    num = 0;
    loaded_offset = 0;
    page = args.object;
    page.bindingContext = pageData;
    recipeList.empty();
    recipeList.load(loaded_offset);
    loaded_offset += LOAD_LIMIT;

    var recipesListView = page.getViewById("recipeList");
    recipesListView.on(gestures.GestureTypes.swipe, function (args) {
        if(args.direction == 1)
        {
            NavigateTo('previous');
        }
        else if(args.direction == 2)
        {
            NavigateTo('next');
        }
    });

    var pre_pageView = page.getViewById("pre_page");
    pre_pageView.on(gestures.GestureTypes.tap, function (args) {
        NavigateTo('previous');
    });

    var next_pageView = page.getViewById("next_page");
    next_pageView.on(gestures.GestureTypes.tap, function (args) {
        NavigateTo('next');
    });
};

exports.loadMoreRecipes = function(args) {
    recipeList.load(loaded_offset);
    loaded_offset += LOAD_LIMIT;
}

exports.listViewItemTap = function(args) {
    var tapped_recipe = args.view.bindingContext;
    frameModule.topmost().navigate({
        moduleName: 'single_page/single-page',
        context: { tapped_recipe: tapped_recipe},
        transition: {
            duration: 0,
            name: 'fade'
        }
    });
}
