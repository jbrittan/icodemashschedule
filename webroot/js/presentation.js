function Presentation($element)
{

  this.id = $element.attr("id");
  this.title = $element.find("li._title").html();
  this.location = $element.find("li._location").html();
  this.description = $element.find("div.description").html();
  this.startTime = new Date(Date.parse($element.find("li._startTime").html()));
  this.endTime = new Date(Date.parse($element.find("li._endTime").html()));

}


PresentationSort = {};


PresentationSort.byStartTime = function(a, b)
{
  if (a.startTime > b.startTime) {
    return 1;
  } else if (a.startTime < b.startTime) {
    return -1;
  } else {
    return a.title > b.title ? 1 : -1;
  }
}