<script>
    //Current slide
    var currentSlideNumber = 1;
    //
    function nextOrPrevSlide(i) {
        showSlide(currentSlideNumber += i );
    }
    //Trigger function to go to the next slide when the next or previous arrow is clicked.
    function goToSlide(i) {
        showSlide(currentSlideNumber = i);
    }
    //Shows the correct slide.
    function showSlide(i) {
        var x;
        var slides = $(".slide");
        var clickableDots = $(".clickable-dot");
        if (i < 1) {
            currentSlideNumber = slides.length;
        }
        if (i > 3) {
            currentSlideNumber = 1;
        }
        for(x = 0; x < slides.length; ++x){
            slides[x].style.display = "none";
        }
        for(x = 0; x < clickableDots.length; ++x){
            clickableDots[x].className = clickableDots[x].className.replace("active", "");
        }
        slides[currentSlideNumber-1].style.display = "block";
        clickableDots[currentSlideNumber-1].className += " active";
    }
    //Starting from the first slide when the page loads.
    goToSlide(1);
</script>