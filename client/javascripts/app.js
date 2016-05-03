var main = function (vm) {
    "use strict";
    console.log("SANITY CHECK");

    $(".tabs a span").toArray().forEach(function (element) {
        var $element = $(element);

        // create a click handler for this element
        $element.on("click", function () {
            var $content,
                $input,
                $button,
                i;

            $(".tabs a span").removeClass("active");
            $element.addClass("active");
            $("main .content").empty();

            if ($element.parent().is(":nth-child(1)")) { //Newest
                $content = $("<ul>");
				
                for (i = vm.listArray.length-1; i >= 0; i--) {
                    $content.append($("<li>").text(vm.listArray[i].description));
                }
            } else if ($element.parent().is(":nth-child(2)")) { //Oldest
                $content = $("<ul>");
                vm.listArray.forEach(function (todo) {
                    $content.append($("<li>").text(todo.description));
                });

            } else if ($element.parent().is(":nth-child(3)")) { //Tags
                var tags = [];

                vm.listArray.forEach(function (toDo) {
                    toDo.tags.forEach(function (tag) {
                        if (tags.indexOf(tag) === -1) {
                            tags.push(tag);
                        }
                    });
                });
                console.log(tags);

                var tagObjects = tags.map(function (tag) {
                    var toDosWithTag = [];

                    vm.listArray.forEach(function (toDo) {
                        if (toDo.tags.indexOf(tag) !== -1) {
                            toDosWithTag.push(toDo.description);
                        }
                    });

                    return { "name": tag, "toDos": toDosWithTag };
                });

                console.log(tagObjects);

                tagObjects.forEach(function (tag) {
                    var $tagName = $("<h3>").text(tag.name),
                        $content = $("<ul>");


                    tag.toDos.forEach(function (description) {
                        var $li = $("<li>").text(description);
                        $content.append($li);
                    });

                    $("main .content").append($tagName);
                    $("main .content").append($content);
                });

            } else if ($element.parent().is(":nth-child(4)")) { //Add
                var $input = $("<input>").addClass("description"),
                    $inputLabel = $("<p>").text("Description: "),
                    $tagInput = $("<input>").addClass("tags"),
                    $tagLabel = $("<p>").text("Tags: "),
                    $button = $("<span>").text("+");

                $button.on("click", function () {
                    var description = $input.val(),
                        tags = $tagInput.val().split(","),
                        newToDo = {"description":description, "tags":tags};

                    $.post("todos", newToDo, function (result) {
                        console.log(result);

                        // update toDos
                        vm.listArray = result.map(function (toDo) {
                            return { "description": toDo.description, "tags": toDo.tags };
                        });

                        $input.val("");
                        $tagInput.val("");
                    });
                });

                $content = $("<div>").append($inputLabel)
                                     .append($input)
                                     .append($tagLabel)
                                     .append($tagInput)
                                     .append($button);
            }

            $("main .content").append($content);

            return false;
        });
    });

    $(".tabs a:first-child span").trigger("click");
};

$(document).ready(function () {
	var vm = {
		listArray: ko.observableArray([])
    };
    ko.applyBindings(vm);
	
    $.getJSON("todos.json", function (toDoObjects) {
		vm.listArray = toDoObjects.map(function (toDo) {
			return { "description": toDo.description, "tags": toDo.tags };
		});
        main(vm);
    });
});
