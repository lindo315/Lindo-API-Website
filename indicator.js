document.addEventListener('DOMContentLoaded', function() {
  //Get all navigation links
  var navLinks = document.querySelectorAll('.navbar .link-list .list .a');

  //Add click event listeners to navigation links
  navLinks.forEach(function(link) {
    link.addEventListener('click', function(event) {
      event.preventDefault();

      //Get the target section's ID from the link's href attribute
      var targetId = link.getAttribute('href').substring(1);

      //Scroll to the target section smoothly
      var targetElement = document.getElementById(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  //Add scroll event listener for scrollspy functionality
  window.addEventListener('scroll', function() {
    //Get the current scroll position
    var scrollPos = window.scrollY || window.pageYOffset;

    //Iterate through sections and check if they are in the viewport
    document.querySelectorAll('section').forEach(function(section) {
      var top = section.offsetTop - 50; // Adjust offset as needed
      var bottom = top + section.offsetHeight;

      if (scrollPos >= top && scrollPos <= bottom) {
        //Remove 'active' class from all navigation links
        navLinks.forEach(function(link) {
          link.classList.remove('active');
        });

        //Add 'active' class to the corresponding navigation link
        var targetId = section.getAttribute('id');
        var correspondingNavLink = document.querySelector('.navbar .link-list .list .a[href="#' + targetId + '"]');
        if (correspondingNavLink) {
          correspondingNavLink.classList.add('active');
        }
      }
    });
  });
});


