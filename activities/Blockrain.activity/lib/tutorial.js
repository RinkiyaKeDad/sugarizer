define(["webL10n"], function (l10n) {
	var tutorial = {};
	tutorial.start = function() {
		var steps = [
			{
				element: "",
				orphan: true,
				placement: "bottom",
				title: l10n.get("TutoExplainTitle"),
				content: l10n.get("TutoExplainContent")
			},
			{
				element: "#canvas",
				placement: "top",
				title: l10n.get("TutoCanvasTitle"),
				content: l10n.get("TutoCanvasContent")
			},
			{
				element: "#up-arrow",
				placement: "right",
				title: l10n.get("TutoRotateTitle"),
				content: l10n.get("TutoRotateContent")
			},
			{
				element: "#down-arrow",
				placement: "right",
				title: l10n.get("TutoDownTitle"),
				content: l10n.get("TutoDownContent")
			},
			{
				element: "#left-arrow",
				placement: "left",
				title: l10n.get("TutoLeftTitle"),
				content: l10n.get("TutoLeftContent")
			},
			{
				element: "#right-arrow",
				placement: "left",
				title: l10n.get("TutoRightTitle"),
				content: l10n.get("TutoRightContent")
			},
			{
				element: "#btn-next",
				placement: "bottom",
				title: l10n.get("TutoThemeTitle"),
				content: l10n.get("TutoThemeContent")
			}
		];
		var tour = new Tour({
			template: "\
			<div class='popover tour'>\
				<div class='arrow'></div>\
				<h3 class='popover-title tutorial-title'></h3>\
				<div class='popover-content'></div>\
				<div class='popover-navigation' style='display: flex; flex-wrap:wrap; justify-content: center; align-items: center'>\
					<div class='tutorial-prev-icon icon-button' data-role='prev'>\
						<div class='tutorial-prev-icon1 web-activity'>\
							<div class='tutorial-prev-icon2 web-activity-icon'></div>\
							<div class='tutorial-prev-icon3 web-activity-disable'></div>\
						</div>\
						<div class='icon-tutorial-text'>"+l10n.get("TutoPrev")+"</div>\
					</div>\
					<span data-role='separator' style='margin: 4px'>|</span>\
					<div class='tutorial-next-icon icon-button' data-role='next'>\
						<div class='tutorial-next-icon1 web-activity'>\
							<div class='tutorial-next-icon2 web-activity-icon'></div>\
							<div class='tutorial-next-icon3 web-activity-disable'></div>\
						</div>\
						<div class='icon-tutorial-text'>"+l10n.get("TutoNext")+"</div>\
					</div>\
					<div class='tutorial-end-icon icon-button' data-role='end'>\
						<div class='tutorial-end-icon1 web-activity'>\
							<div class='tutorial-end-icon2 web-activity-icon'></div>\
							<div class='tutorial-end-icon3 web-activity-disable'></div>\
						</div>\
						<div class='icon-tutorial-text'>"+l10n.get("TutoEnd")+"</div>\
					</div>\
				</div>\
			</div>",
			storage: false,
			backdrop: true,
			steps: steps
		});
		tour.init();
		tour.start(true);

	};

	return tutorial;
});