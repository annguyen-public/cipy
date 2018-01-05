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
exports.loaded = function(args) {
    num = 0;
    loaded_offset = 0;
    page = args.object;
    page.bindingContext = pageData;
    recipeList.empty();
    recipeList.load(loaded_offset);
    loaded_offset += LOAD_LIMIT;

    var myStack = page.getViewById("recipeList");
    /*myStack.on(gestures.GestureTypes.swipe, function (args) {
        /*frameModule.topmost().navigate({
            moduleName: "next-page"
        });*/
        /*console.log("swipped");
    });*/
    myStack.on(gestures.GestureTypes.swipe, function (args) {
        var next_module = "";
        var name = "fade";
        if(args.direction == 1)
        {
            next_module = "breakfast_page/breakfast-page";
            name = "slideRight";
        }
        else if(args.direction == 2)
        {
            next_module = "dinner_page/dinner-page";
            name = "slideLeft";
        }

        frameModule.topmost().navigate({
            moduleName: next_module,
            transition: {
                duration: 350,
                name: name
            }
        });
        console.log("Swipe Direction: " + args.direction);
    });

    /*myStack.on(gestures.GestureTypes.touch, function (args) {
        console.log(args.action);
    });*/
};

exports.loadMoreRecipes = function(args) {
    //recipeList.empty();
    recipeList.load(loaded_offset);
    loaded_offset += LOAD_LIMIT;
}
