
function point2star(point) {
	const icon_star_empty = "0xf006";
	const icon_star = "0xf005";
	const icon_star_half = "0xf089";

	var full_star_num = parseInt(point/2);
	var half_start = point%2;
	var empty_star_num = 5 - (full_star_num + half_start);

	var star_arr = new Array(icon_star, icon_star, icon_star, icon_star, icon_star);
	var arr_index = 0;

	for (var i = 0; i < full_star_num; i++) {
		star_arr[arr_index++] = icon_star;
	}

	if(half_start)
		star_arr[arr_index++] = icon_star_half;

	for (var i = 0; i < empty_star_num; i++) {
		star_arr[arr_index++] = icon_star_empty;
	}

	return star_arr;
	//return "0xf005;0xf089";
}
module.exports = point2star;
