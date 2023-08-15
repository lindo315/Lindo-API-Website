window.onscroll = function()
{
  var currentScroll = window.pageYOffset;
  if(prevScroll > currentScroll)
  {
    document.getElementById("id-navigation").style.top = "0";
  }
  else
  {
    document.getElementById("id-navigation").style.top = "-100px";
  }
  prevScroll = currentScroll;
}