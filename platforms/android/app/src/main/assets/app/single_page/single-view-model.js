const observableModule = require("data/observable");

/*function SingleViewModel() {
    const viewModel = observableModule.fromObject({

    });

    return viewModel;
}

module.exports = SingleViewModel;*/

var SingleViewModel = (function (_super) {
    __extends(SingleViewModel, _super);
    function SingleViewModel() {
        var _this = _super.call(this) || this;
        _this.selectedDay = 0;
        _this.filter();
        return _this;
    }
    Object.defineProperty(SingleViewModel.prototype, "selectedDay", {
        get: function () {
            return this._selectedDay;
        },
        set: function (value) {
            if (this._selectedDay !== value) {
                this._selectedDay = value;
                this.filter();
            }
        },
        enumerable: true,
        configurable: true
    });
    SingleViewModel.prototype.filter = function () {
        //console.log(this._selectedDay);
        //this.set("ingredients", allSessions);
        //console.log(allSessions);
        switch(this._selectedDay){
            case 0:
                this.set("isDisp_over_view", true);
                this.set("isDisp_ingredients", false);
                this.set("isDisp_directions", false);
                break;
            case 1:                
                this.set("isDisp_over_view", false);
                this.set("isDisp_ingredients", true);
                this.set("isDisp_directions", false);
                break;
            case 2:                
                this.set("isDisp_over_view", false);
                this.set("isDisp_ingredients", false);
                this.set("isDisp_directions", true);
                break;
        }
    };
    return SingleViewModel;
}(observableModule.Observable));
exports.SingleViewModel = SingleViewModel;
exports.instance = new SingleViewModel();