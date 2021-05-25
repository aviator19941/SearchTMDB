console.log("trending");

window.onload = function() {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            let data = JSON.parse(xhttp.responseText);
            data.forEach(element => {
                var curBackdrop = element['backdrop_path'];
                var title = element['title'];
                let backdrop_url = "./static/backdrop-placeholder.jpg";
                if (curBackdrop != null) {
                    backdrop_url = "https://image.tmdb.org/t/p/w500" + curBackdrop;
                }

                var imgElem = document.createElement("img");
                imgElem.setAttribute("src", backdrop_url);
                imgElem.setAttribute("alt", title);
                document.getElementById("first-slideshow").appendChild(imgElem);
            });

            const slideshowImages = document.querySelectorAll(".slides .first-slideshow img");
            const slidesFooter = document.querySelector(".slides .slides-footer");
            const slidesText = document.querySelector(".slides .slides-footer p");

            const nextImageDelay = 5000;
            let currentImageCounter = 0; // setting a variable to keep track of the current image (slide)
            slidesText.innerHTML = data[currentImageCounter]['title'] + " (" + data[currentImageCounter]['release_date'] + ")";

            slideshowImages[currentImageCounter].style.opacity = 1;
            slidesText.style.opacity = 1;
            slidesFooter.style.opacity = 1;

            setInterval(nextImage, nextImageDelay);

            function nextImage() {
                slideshowImages[currentImageCounter].style.opacity = 0;
                slidesText.style.opacity = 0;
                slidesFooter.style.opacity = 0;

                setTimeout(() => {
                    currentImageCounter = (currentImageCounter+1) % slideshowImages.length;

                    slideshowImages[currentImageCounter].style.opacity = 1;
                    slidesText.innerHTML = data[currentImageCounter]['title'] + " (" + data[currentImageCounter]['release_date'] + ")";
                    slidesText.style.opacity = 1;
                    slidesFooter.style.opacity = 1;
                }, 300);
            }
        }
    };

    var xhttp2 = new XMLHttpRequest();
    xhttp2.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            let data = JSON.parse(xhttp2.responseText);
            let names = [];
            console.log(data);
            console.log("tv");
            data.forEach(element => {
                let curBackdrop = element['backdrop_path'];
                let name = element['name'];
                let backdrop_url = "./static/backdrop-placeholder.jpg";
                if (curBackdrop != null) {
                    backdrop_url = "https://image.tmdb.org/t/p/w500" + curBackdrop;
                }

                var imgElem = document.createElement("img");
                imgElem.setAttribute("src", backdrop_url);
                imgElem.setAttribute("alt", name);
                document.getElementById("second-slideshow").appendChild(imgElem);
            });

            const slideshowImages = document.querySelectorAll(".slides2 .second-slideshow img");
            const slidesFooter = document.querySelector(".slides2 .slides-footer");
            const slidesText = document.querySelector(".slides2 .slides-footer p");

            const nextImageDelay = 5000;
            let currentImageCounter = 0; // setting a variable to keep track of the current image (slide)
            slidesText.innerHTML = data[currentImageCounter]['name'] + " (" + data[currentImageCounter]['first_air_date'] + ")";

            slideshowImages[currentImageCounter].style.opacity = 1;
            slidesText.style.opacity = 1;
            slidesFooter.style.opacity = 1;

            setInterval(nextImage, nextImageDelay);

            function nextImage() {
                slideshowImages[currentImageCounter].style.opacity = 0;
                slidesText.style.opacity = 0;
                slidesFooter.style.opacity = 0;

                setTimeout(() => {
                    currentImageCounter = (currentImageCounter+1) % slideshowImages.length;

                    slideshowImages[currentImageCounter].style.opacity = 1;
                    slidesText.innerHTML = data[currentImageCounter]['name'] + " (" + data[currentImageCounter]['first_air_date'] + ")";
                    slidesText.style.opacity = 1;
                    slidesFooter.style.opacity = 1;
                }, 300);
            }
        }
    };
    xhttp.open("GET", "/trending", true);
    xhttp2.open("GET", "/tv", true);
    xhttp.send();
    xhttp2.send();
}