
function ViewModel(){
   var self=this;
   self.textBoxValue= ko.observable("");

   self.availableComments=[
   {comment: "This is the first comment!"},
   {comment: "Here's the second one!"},
   {comment: "And this is one more."},
   {comment: "Here is another one!"}
   ];

   //editable data:
   //The list of comments:
   self.comments=ko.observableArray([
       self.availableComments[0],
       self.availableComments[1],
       self.availableComments[2],
       self.availableComments[3]
   ]);

   self.addComment=function(){
      self.comments.push({comment: self.textBoxValue()});
      $(".comment-input input").val("");
   };
}


ko.applyBindings(new ViewModel());
