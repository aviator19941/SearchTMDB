console.log("search");
let newVerticalWhiteLinePixelHeight = "";

function removeHomeLine(element) {
    var homeTab = document.getElementById("home-tab");
    var searchTab = document.getElementById("search-tab");
    var horizontalLineHome = document.getElementById("horizontal-line-home");
    var horizontalLineSearch = document.getElementById("horizontal-line-search");
    var trendingTitle = document.getElementById("trending-title");
    var tvTitle = document.getElementById("tv-title");
    var slides = document.getElementById("slides");
    var slides2 = document.getElementById("slides2");
    var searchArea = document.getElementById("search-area");
    var verticalLine = document.getElementById("vl");
    var footer = document.getElementById("footer");

    if (element == homeTab) {
        // change display of home tab to block
        searchTab.style.color = "rgb(172, 0, 15)";
        homeTab.style.color = "rgb(172, 0, 15)";
        if (homeTab.style.color == "rgb(172, 0, 15)") {
            if (searchTab.style.color == "rgb(172, 0, 15)") {
                document.getElementById("search-tab").removeAttribute("disabled");
                trendingTitle.style.display = "block";
                tvTitle.style.display = "block";
                slides.style.display = "block";
                slides2.style.display = "block";
                homeTab.className = "selected";
                searchTab.style.color = "white"
                document.getElementById("home-tab").setAttribute("disabled", "disabled")
                horizontalLineHome.style.opacity = 1;
                horizontalLineSearch.style.opacity = 0;
                searchArea.style.display = "none";
                verticalLine.style.height = "1230px";
                footer.style.marginTop = "147px";
            }
        }
    } else if (element == searchTab) {
        searchTab.style.color = "rgb(172, 0, 15)";
        homeTab.style.color = "rgb(172, 0, 15)";
        // change display of div to none
        if (searchTab.style.color == "rgb(172, 0, 15)") {
            if (homeTab.style.color == "rgb(172, 0, 15)") {
                // change home tab color to white
                homeTab.style.color = "white";
                // change search tab color to red
                searchTab.className = "selected";
                document.getElementById("home-tab").removeAttribute("disabled");
                document.getElementById("search-tab").setAttribute("disabled", "disabled");
                // set opacity of home line to 0
                horizontalLineHome.style.opacity = 0;
                // set opacity of search line to 1
                horizontalLineSearch.style.opacity = 1;
                trendingTitle.style.display = "none";
                tvTitle.style.display = "none";
                slides.style.display = "none";
                slides2.style.display = "none";
                searchArea.style.display = "block";
                if (keyword.value == "" && categories.value == "") {
                    verticalLine.style.height = "780px";
                } else if (keyword.value != "" && categories.value != "") {
                    verticalLine.style.height = newVerticalWhiteLinePixelHeight;
                }
                footer.style.marginTop = "10px";
            }
        }
        
    }
}

var justTurnedRed = false;

function tog(event) {
    let elem = document.getElementById(event.currentTarget.id);
    var curColor = window.getComputedStyle(elem, null).getPropertyValue("color");
    if (event.type === "mouseenter") {
        if (curColor == "rgb(255, 255, 255)") {
            justTurnedRed = true;
            elem.style.color = "#AC000F";
        }
    } else if (event.type === "mouseleave") {
        if (justTurnedRed) {
            elem.style.color = "white";
            justTurnedRed = false;
        } else {
            elem.style.color = curColor;
        }
    }
}
  
var homeTab = document.getElementById("home-tab");
var searchTab = document.getElementById("search-tab");
/*homeTab.addEventListener("mouseenter", tog);
homeTab.addEventListener("mouseleave", tog);
searchTab.addEventListener("mouseenter", tog);
searchTab.addEventListener("mouseleave", tog);*/

function showMovieDetails(movieId, overview) {
    // add modal on click of show more
    var xhttp = new XMLHttpRequest();
    var movieDetails = "/movie" + '?id=' + movieId;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            let element = JSON.parse(xhttp.responseText);
            let movieElem = element['movie'];
            let castList = element['cast'];
            let reviewsList = element['review'];

            // send GET request of movieId to flask
            var popup = document.getElementById("popup-container");
            var span = document.getElementsByClassName("close")[0];

            popup.style.display = "block";

            span.onclick = function() {
                clearDetailElements();
                popup.style.display = "none";
            }

            window.onclick = function(event) {
                if (event.target == popup) {
                    clearDetailElements();
                    popup.style.display = "none";
                }
            }

            let id = movieElem['id'];
            let title = movieElem['title'];
            let runtime = movieElem['runtime'];
            let releaseDate = movieElem['release_date'];
            let spokenLanguages = movieElem['spoken_languages'];
            let voteAvg = movieElem['vote_average'];
            let voteCount = movieElem['vote_count'];
            let posterPath = movieElem['poster_path'];
            let backdropPath = movieElem['backdrop_path'];
            let genres = movieElem['genres'];

            let languagesString = "Spoken languages: ";
            for (var i = 0; i < spokenLanguages.length; i++) {
                let language = spokenLanguages[i]['english_name'];
                if (language != undefined) {
                    if (i == spokenLanguages.length - 1) {
                        languagesString += language;
                    } else {
                        languagesString += language + ", ";
                    }
                }
            }
            if (languagesString.length == 18) {
                languagesString += "N/A";
            }

            if (voteAvg == "0" || voteAvg == "N/A") {
                voteAvg = "0.0";
            } else if (voteAvg == "5") {
                voteAvg = "5.0";
            }

            if (voteCount == "N/A") {
                voteCount = "0";
            }

            let genreString = "";
            if (genres[0] == "N/A") {
                genreString = "N/A";
            } else {
                for (var i = 0; i < genres.length; i++) {
                    if (i == genres.length - 1) {
                        genreString += genres[i]['name'];
                    } else {
                        genreString += genres[i]['name'] + ", ";
                    }
                }
            }

            if (releaseDate == null) {
                releaseDate = "N/A";
            }

            let yearGenre = releaseDate + " | " + genreString;

            let votes = "★ " + voteAvg + "/5";
            let voteCounts = voteCount + " votes";
            
            let posterPathUrl = "./static/posterpath_placeholder.jpg";
            if (posterPath != null) {
                posterPathUrl = "https://image.tmdb.org/t/p/w500" + posterPath;
            }

            let backdropPathUrl = "./static/backdrop-placeholder.jpg";
            if (backdropPath != null) {
                backdropPathUrl = "https://image.tmdb.org/t/p/w500" + backdropPath;
            }
            
            var imageDiv = document.createElement("div");
            var image = document.createElement("img");
            var textDiv = document.createElement("div");
            var detailsTitle = document.createElement("p");
            var yearGenreParagraph = document.createElement("p");
            var overviewParagraph = document.createElement("p");
            var languagesParagraph = document.createElement("p");
            var castDiv = document.createElement("div");
            let castParagraph = document.createElement("p");
            var reviewDiv = document.createElement("div");
            var reviewParagraph = document.createElement("p");

            var imageDivIdAttribute = "movieImageContainer";
            var imageIdAttribute = "movieImage";
            var textDivIdAttribute = "detailsContainer";
            var detailsTitleIdAttribute = "detailsTitle";
            var yearGenreIdAttribute = "year-genre";
            var overviewIdAttribute = "overview";
            var languagesIdAttribute = "languages";
            var castDivIdAttribute = "cast-container";
            let castParagraphIdAttribute = "cast";
            var reviewDivIdAttribute = "review-container";
            var reviewParagraphIdAttribute = "review";

            imageDiv.setAttribute("id", imageDivIdAttribute);
            image.setAttribute("id", imageIdAttribute);
            textDiv.setAttribute("id", textDivIdAttribute);
            detailsTitle.setAttribute("id", detailsTitleIdAttribute);
            yearGenreParagraph.setAttribute("id", yearGenreIdAttribute);
            overviewParagraph.setAttribute("id", overviewIdAttribute);
            languagesParagraph.setAttribute("id", languagesIdAttribute);
            castDiv.setAttribute("id", castDivIdAttribute);
            castParagraph.setAttribute("id", castParagraphIdAttribute);
            reviewDiv.setAttribute("id", reviewDivIdAttribute);
            reviewParagraph.setAttribute("id", reviewParagraphIdAttribute);

            imageDiv.className = "movie-image-container";
            image.className = "movie-image";
            textDiv.className = "details-container";
            detailsTitle.className = "details-title";
            yearGenreParagraph.className = "year-genre-details";
            overviewParagraph.className = "overview-details";
            languagesParagraph.className = "languages";
            castDiv.className = "cast-container";
            castParagraph.className = "cast-text";
            reviewDiv.className = "review-container";
            reviewParagraph.className = "review-text";

            image.setAttribute("src", backdropPathUrl);
            image.setAttribute("alt", title);
            let tmdbLink = "https://www.themoviedb.org/movie/" + movieId;

            detailsTitle.innerHTML = title + "<span><a href=" + tmdbLink + " class='tmdb-link' target='_blank'>&nbsp; &#9432; </a></span>";
            yearGenreParagraph.innerHTML = yearGenre + "<br><span class='voting-details'>" + votes + "&nbsp </span><span class='vote-counts-details'>" + voteCounts + "</span>";
            overviewParagraph.innerHTML = overview;
            languagesParagraph.innerHTML = languagesString;
            castParagraph.innerHTML = "Cast";
            reviewParagraph.innerHTML = "Reviews";

            document.getElementById("popup-content").appendChild(imageDiv);
            document.getElementById(imageDivIdAttribute).appendChild(image);
            document.getElementById("popup-content").appendChild(textDiv);
            document.getElementById(textDivIdAttribute).appendChild(detailsTitle);
            document.getElementById(textDivIdAttribute).appendChild(yearGenreParagraph);
            document.getElementById(textDivIdAttribute).appendChild(overviewParagraph);
            document.getElementById(textDivIdAttribute).appendChild(languagesParagraph);
            document.getElementById("popup-content").appendChild(castDiv);
            document.getElementById(castDivIdAttribute).appendChild(castParagraph);

            var ndx = 1;
            // TODO: if castList.length == 0, add "N/A" paragraph
            castList.forEach(castMember => {
                let nameCast = castMember['name'];
                let profilePath = castMember['profile_path'];
                let character = castMember['character'];

                let profilePathUrl = "./static/person-placeholder.jpg";
                if (profilePath != null) {
                    profilePathUrl = "https://image.tmdb.org/t/p/w500" + profilePath;
                }

                let profileDiv = document.createElement("div");
                let profileImage = document.createElement("img");
                let profileNameParagraph = document.createElement("p");
                let profileAsParagraph = document.createElement("p");
                let profileCharacterParagraph = document.createElement("p");

                let profileDivIdAttribute = "profileDiv" + ndx;
                let profileImageIdAttribute = "profileImage" + ndx;
                let profileNameParagraphIdAttribute = "profileName" + ndx;
                let profileAsParagraphIdAttribute = "profileAs" + ndx;
                let profileCharacterParagraphIdAttribute = "profileCharacter" + ndx;

                profileDiv.setAttribute("id", profileDivIdAttribute);
                profileImage.setAttribute("id", profileImageIdAttribute);
                profileNameParagraph.setAttribute("id", profileNameParagraphIdAttribute);
                profileAsParagraph.setAttribute("id", profileAsParagraphIdAttribute);
                profileCharacterParagraph.setAttribute("id", profileCharacterParagraphIdAttribute);

                profileDiv.className = "profile-div";
                profileImage.setAttribute("src", profilePathUrl);
                profileImage.className = "cast-image";
                profileNameParagraph.className = "cast-name";
                profileAsParagraph.className = "as-text";
                profileCharacterParagraph.className = "cast-character";

                profileNameParagraph.innerHTML = nameCast;
                profileAsParagraph.innerHTML = "AS";
                profileCharacterParagraph.innerHTML = character;

                document.getElementById(castDivIdAttribute).appendChild(profileDiv);
                document.getElementById(profileDivIdAttribute).appendChild(profileImage);
                document.getElementById(profileDivIdAttribute).appendChild(profileNameParagraph);
                document.getElementById(profileDivIdAttribute).appendChild(profileAsParagraph);
                document.getElementById(profileDivIdAttribute).appendChild(profileCharacterParagraph);

                ndx += 1;
            });
            if (castList.length == 0) {
                let notApplicableDiv = document.createElement("p");
                let notApplicableDivIdAttribute = "notApplicable";
                notApplicableDiv.setAttribute("id", notApplicableDivIdAttribute);
                notApplicableDiv.className = "not-applicable";
                notApplicableDiv.innerHTML = "N/A";
                document.getElementById(castDivIdAttribute).appendChild(notApplicableDiv);
            }

            document.getElementById("popup-content").appendChild(reviewDiv);
            document.getElementById(reviewDivIdAttribute).appendChild(reviewParagraph);

            ndx = 0;
            // TODO: if castList.length == 0, add "N/A" paragraph
            reviewsList.forEach(review => {
                let username = review['username'];
                let content = review['content'];
                let rating = review['rating'];
                let date = review['created_at'];

                let curReviewDiv = document.createElement("div");
                let ratingParagraph = document.createElement("p");
                let usernameDateParagraph = document.createElement("p");
                let reviewContentParagraph = document.createElement("p");
                let horizontalLine = document.createElement("hr");

                let curReviewDivIdAttribute = "curReviewDiv" + ndx;
                let usernameDateParagraphIdAttribute = "usernameDate" + ndx;
                let reviewContentParagraphIdAttribute = "reviewContent" + ndx;
                let horizontalLineIdAttribute = "horizontalLine" + ndx;
                
                curReviewDiv.setAttribute("id", curReviewDivIdAttribute);
                usernameDateParagraph.setAttribute("id", usernameDateParagraphIdAttribute);
                reviewContentParagraph.setAttribute("id", reviewContentParagraphIdAttribute);
                horizontalLine.setAttribute("id", horizontalLineIdAttribute);

                curReviewDiv.className = "cur-review-div";
                usernameDateParagraph.className = "username";
                ratingParagraph.className = "review-rating";
                reviewContentParagraph.className = "review-content";
                horizontalLine.className = "review-horizontal";

                usernameDateParagraph.innerHTML = username + " <span class='date'>on " + date + "</span>";
                if (rating != "N/A") {
                    ratingParagraph.innerHTML = "★ " + rating + "/5";;
                }
                reviewContentParagraph.innerHTML = content;

                document.getElementById(reviewDivIdAttribute).appendChild(curReviewDiv);
                document.getElementById(curReviewDivIdAttribute).appendChild(usernameDateParagraph);
                document.getElementById(curReviewDivIdAttribute).appendChild(ratingParagraph);
                document.getElementById(curReviewDivIdAttribute).appendChild(reviewContentParagraph);
                document.getElementById(curReviewDivIdAttribute).appendChild(horizontalLine);

                ndx += 1;
            });
            if (reviewsList.length == 0) {
                let notApplicableDiv = document.createElement("p");
                let notApplicableDivIdAttribute = "notApplicable";
                notApplicableDiv.setAttribute("id", notApplicableDivIdAttribute);
                notApplicableDiv.className = "not-applicable";
                notApplicableDiv.innerHTML = "N/A";
                document.getElementById(reviewDivIdAttribute).appendChild(notApplicableDiv);
            }
        }
    };

    xhttp.open("GET", movieDetails, true);
    xhttp.send();
}

function showTvDetails(tvId, overview) {
    // add modal on click of show more
    var xhttp = new XMLHttpRequest();
    var tvDetails = "/tvDetails" + '?id=' + tvId;
    console.log(tvDetails);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            let element = JSON.parse(xhttp.responseText);
            let tvElem = element['tv'];
            let castList = element['cast'];
            let reviewsList = element['review'];
            
            // send GET request of movieId to flask
            var popup = document.getElementById("popup-container");
            var span = document.getElementsByClassName("close")[0];

            popup.style.display = "block";

            span.onclick = function() {
                clearDetailElements();
                popup.style.display = "none";
            }

            window.onclick = function(event) {
                if (event.target == popup) {
                    clearDetailElements();
                    popup.style.display = "none";
                }
            }

            let id = tvElem['id'];
            let title = tvElem['name'];
            let runtime = tvElem['episode_run_time'];
            let releaseDate = tvElem['first_air_date'];
            let spokenLanguages = tvElem['spoken_languages'];
            let voteAvg = tvElem['vote_average'];
            let voteCount = tvElem['vote_count'];
            let posterPath = tvElem['poster_path'];
            let backdropPath = tvElem['backdrop_path'];
            let genres = tvElem['genres'];

            let languagesString = "Spoken languages: ";
            for (var i = 0; i < spokenLanguages.length; i++) {
                let language = spokenLanguages[i]['english_name'];
                if (language != undefined) {
                    if (i == spokenLanguages.length - 1) {
                        languagesString += language;
                    } else {
                        languagesString += language + ", ";
                    }
                }
            }
            if (languagesString.length == 18) {
                languagesString += "N/A";
            }
            
            if (voteAvg == "0" || voteAvg == "N/A") {
                voteAvg = "0.0";
            } else if (voteAvg == "5") {
                voteAvg = "5.0";
            }

            if (voteCount == "N/A") {
                voteCount = "0";
            }

            let genreString = "";
            if (genres[0] == "N/A") {
                genreString = "N/A";
            } else {
                for (var i = 0; i < genres.length; i++) {
                    if (i == genres.length - 1) {
                        genreString += genres[i]['name'];
                    } else {
                        genreString += genres[i]['name'] + ", ";
                    }
                }
            }
            
            if (releaseDate == null) {
                releaseDate = "N/A";
            }
            let yearGenre = releaseDate + " | " + genreString;

            let votes = "★ " + voteAvg + "/5";
            let voteCounts = voteCount + " votes";
            
            let posterPathUrl = "./static/posterpath_placeholder.jpg";
            if (posterPath != null) {
                posterPathUrl = "https://image.tmdb.org/t/p/w500" + posterPath;
            }

            let backdropPathUrl = "./static/backdrop-placeholder.jpg";
            if (backdropPath != null) {
                backdropPathUrl = "https://image.tmdb.org/t/p/w500" + backdropPath;
            }

            var imageDiv = document.createElement("div");
            var image = document.createElement("img");
            var textDiv = document.createElement("div");
            var detailsTitle = document.createElement("p");
            var yearGenreParagraph = document.createElement("p");
            var overviewParagraph = document.createElement("p");
            var languagesParagraph = document.createElement("p");
            var castDiv = document.createElement("div");
            let castParagraph = document.createElement("p");
            var reviewDiv = document.createElement("div");
            var reviewParagraph = document.createElement("p");

            var imageDivIdAttribute = "movieImageContainer";
            var imageIdAttribute = "movieImage";
            var textDivIdAttribute = "detailsContainer";
            var detailsTitleIdAttribute = "detailsTitle";
            var yearGenreIdAttribute = "year-genre";
            var overviewIdAttribute = "overview";
            var languagesIdAttribute = "languages";
            var castDivIdAttribute = "cast-container";
            let castParagraphIdAttribute = "cast";
            var reviewDivIdAttribute = "review-container";
            var reviewParagraphIdAttribute = "review";

            imageDiv.setAttribute("id", imageDivIdAttribute);
            image.setAttribute("id", imageIdAttribute);
            textDiv.setAttribute("id", textDivIdAttribute);
            detailsTitle.setAttribute("id", detailsTitleIdAttribute);
            yearGenreParagraph.setAttribute("id", yearGenreIdAttribute);
            overviewParagraph.setAttribute("id", overviewIdAttribute);
            languagesParagraph.setAttribute("id", languagesIdAttribute);
            castDiv.setAttribute("id", castDivIdAttribute);
            castParagraph.setAttribute("id", castParagraphIdAttribute);
            reviewDiv.setAttribute("id", reviewDivIdAttribute);
            reviewParagraph.setAttribute("id", reviewParagraphIdAttribute);

            imageDiv.className = "movie-image-container";
            image.className = "movie-image";
            textDiv.className = "details-container";
            detailsTitle.className = "details-title";
            yearGenreParagraph.className = "year-genre-details";
            overviewParagraph.className = "overview-details";
            languagesParagraph.className = "languages";
            castDiv.className = "cast-container";
            castParagraph.className = "cast-text";
            reviewDiv.className = "review-container";
            reviewParagraph.className = "review-text";

            image.setAttribute("src", backdropPathUrl);
            image.setAttribute("alt", title);
            let tmdbLink = "https://www.themoviedb.org/tv/" + tvId;

            detailsTitle.innerHTML = title + "<span><a href=" + tmdbLink + " class='tmdb-link' target='_blank'>&nbsp; &#9432; </a></span>";
            yearGenreParagraph.innerHTML = yearGenre + "<br><span class='voting-details'>" + votes + "&nbsp </span><span class='vote-counts-details'>" + voteCounts + "</span>";
            overviewParagraph.innerHTML = overview;
            languagesParagraph.innerHTML = languagesString;
            castParagraph.innerHTML = "Cast";
            reviewParagraph.innerHTML = "Reviews";

            document.getElementById("popup-content").appendChild(imageDiv);
            document.getElementById(imageDivIdAttribute).appendChild(image);
            document.getElementById("popup-content").appendChild(textDiv);
            document.getElementById(textDivIdAttribute).appendChild(detailsTitle);
            document.getElementById(textDivIdAttribute).appendChild(yearGenreParagraph);
            document.getElementById(textDivIdAttribute).appendChild(overviewParagraph);
            document.getElementById(textDivIdAttribute).appendChild(languagesParagraph);

            document.getElementById("popup-content").appendChild(castDiv);
            document.getElementById(castDivIdAttribute).appendChild(castParagraph);

            var ndx = 1;
            // TODO: if castList.length == 0, add "N/A" paragraph
            castList.forEach(castMember => {
                let nameCast = castMember['name'];
                let profilePath = castMember['profile_path'];
                let character = castMember['character'];

                let profilePathUrl = "./static/person-placeholder.jpg";
                if (profilePath != null) {
                    profilePathUrl = "https://image.tmdb.org/t/p/w500" + profilePath;
                }

                let profileDiv = document.createElement("div");
                let profileImage = document.createElement("img");
                let profileNameParagraph = document.createElement("p");
                let profileAsParagraph = document.createElement("p");
                let profileCharacterParagraph = document.createElement("p");

                let profileDivIdAttribute = "profileDiv" + ndx;
                let profileImageIdAttribute = "profileImage" + ndx;
                let profileNameParagraphIdAttribute = "profileName" + ndx;
                let profileAsParagraphIdAttribute = "profileAs" + ndx;
                let profileCharacterParagraphIdAttribute = "profileCharacter" + ndx;

                profileDiv.setAttribute("id", profileDivIdAttribute);
                profileImage.setAttribute("id", profileImageIdAttribute);
                profileNameParagraph.setAttribute("id", profileNameParagraphIdAttribute);
                profileAsParagraph.setAttribute("id", profileAsParagraphIdAttribute);
                profileCharacterParagraph.setAttribute("id", profileCharacterParagraphIdAttribute);

                profileDiv.className = "profile-div";
                profileImage.setAttribute("src", profilePathUrl);
                profileImage.className = "cast-image";
                profileNameParagraph.className = "cast-name";
                profileAsParagraph.className = "as-text";
                profileCharacterParagraph.className = "cast-character";

                profileNameParagraph.innerHTML = nameCast;
                profileAsParagraph.innerHTML = "AS";
                profileCharacterParagraph.innerHTML = character;

                document.getElementById(castDivIdAttribute).appendChild(profileDiv);
                document.getElementById(profileDivIdAttribute).appendChild(profileImage);
                document.getElementById(profileDivIdAttribute).appendChild(profileNameParagraph);
                document.getElementById(profileDivIdAttribute).appendChild(profileAsParagraph);
                document.getElementById(profileDivIdAttribute).appendChild(profileCharacterParagraph);

                ndx += 1;
            });
            if (castList.length == 0) {
                let notApplicableDiv = document.createElement("p");
                let notApplicableDivIdAttribute = "notApplicable";
                notApplicableDiv.setAttribute("id", notApplicableDivIdAttribute);
                notApplicableDiv.className = "not-applicable";
                notApplicableDiv.innerHTML = "N/A";
                document.getElementById(castDivIdAttribute).appendChild(notApplicableDiv);
            }

            document.getElementById("popup-content").appendChild(reviewDiv);
            document.getElementById(reviewDivIdAttribute).appendChild(reviewParagraph);

            ndx = 0;
            // TODO: if castList.length == 0, add "N/A" paragraph
            reviewsList.forEach(review => {
                let username = review['username'];
                let content = review['content'];
                let rating = review['rating'];
                let date = review['created_at'];

                let curReviewDiv = document.createElement("div");
                let ratingParagraph = document.createElement("p");
                let usernameDateParagraph = document.createElement("p");
                let reviewContentParagraph = document.createElement("p");
                let horizontalLine = document.createElement("hr");

                let curReviewDivIdAttribute = "curReviewDiv" + ndx;
                let usernameDateParagraphIdAttribute = "usernameDate" + ndx;
                let reviewContentParagraphIdAttribute = "reviewContent" + ndx;
                let horizontalLineIdAttribute = "horizontalLine" + ndx;
                
                curReviewDiv.setAttribute("id", curReviewDivIdAttribute);
                usernameDateParagraph.setAttribute("id", usernameDateParagraphIdAttribute);
                reviewContentParagraph.setAttribute("id", reviewContentParagraphIdAttribute);
                horizontalLine.setAttribute("id", horizontalLineIdAttribute);

                curReviewDiv.className = "cur-review-div";
                usernameDateParagraph.className = "username";
                ratingParagraph.className = "review-rating";
                reviewContentParagraph.className = "review-content";
                horizontalLine.className = "review-horizontal";

                usernameDateParagraph.innerHTML = username + " <span class='date'>on " + date + "</span>";
                if (rating != "N/A") {
                    ratingParagraph.innerHTML = "★ " + rating + "/5";;
                }
                reviewContentParagraph.innerHTML = content;

                document.getElementById(reviewDivIdAttribute).appendChild(curReviewDiv);
                document.getElementById(curReviewDivIdAttribute).appendChild(usernameDateParagraph);
                document.getElementById(curReviewDivIdAttribute).appendChild(ratingParagraph);
                document.getElementById(curReviewDivIdAttribute).appendChild(reviewContentParagraph);
                document.getElementById(curReviewDivIdAttribute).appendChild(horizontalLine);

                ndx += 1;
            });
            if (reviewsList.length == 0) {
                let notApplicableDiv = document.createElement("p");
                let notApplicableDivIdAttribute = "notApplicable";
                notApplicableDiv.setAttribute("id", notApplicableDivIdAttribute);
                notApplicableDiv.className = "not-applicable";
                notApplicableDiv.innerHTML = "N/A";
                document.getElementById(reviewDivIdAttribute).appendChild(notApplicableDiv);
            }
        }
    };

    xhttp.open("GET", tvDetails, true);
    xhttp.send();
}


function clearDetailElements() {
    var popup = document.getElementById("popup-content");
    while (popup.childNodes.length > 2) {
        popup.removeChild(popup.lastChild);
    }
}

function clearTextForm() {
    document.getElementById("formcenter").reset();

    clearAllSearchElements();
    let showResults = document.getElementById("show-results");
    showResults.style.opacity = 0;
}

function clearAllSearchElements() {
    var searchContainer = document.getElementById("search-container");
    while (searchContainer.childNodes.length > 2) {
        searchContainer.removeChild(searchContainer.lastChild);
    }

    // set height of vertical line and background to original
    var searchArea = document.getElementById("search-area");
    var verticalLine = document.getElementById("vl");
    searchArea.style.height = "715px";
    verticalLine.style.height = "780px";
}

function sendKeywordAndCategory(formElement) {
    //keyword
    //categories
    var form = document.getElementById("formcenter");
    function handleForm(event) { event.preventDefault(); }
    form.addEventListener('submit', handleForm);

    var keyword = document.getElementById("keyword");
    var categories = document.getElementById("categories");

    clearAllSearchElements();

    if (keyword.value == "" || categories.value == "") {
        alert("Please enter valid values.");
    } else if (keyword.value != "" && categories.value != "") {
        // send to flask /search endpoint and print data
        var params = "/search" + '?keyword=' + keyword.value + '&categories=' + categories.value;
        var xhttp = new XMLHttpRequest();
        let newHeight = 1000;
        let newVerticalWhiteLineHeight = 500;

        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let data = JSON.parse(xhttp.responseText);
                
                if (categories.value == "movies") {
                    if (data.length > 0) {
                        let showResults = document.getElementById("show-results");
                        var verticalWhiteLine = document.getElementById("vl");
                        showResults.style.opacity = 1;
                        showResults.style.textAlign = "left";
                        showResults.innerHTML = "Showing results...";

                        // create 1 div for each object (10 divs) in data under search-container
                        // IF KEYWORD.VALUE == "MOVIES" {}
                        let ndx = 1;
                        let dataLen = data.length;
                        data.forEach(element => {
                            let id = element['id'];
                            let title = element['title'];
                            let posterPath = element['poster_path'];
                            let releaseDate = element['release_date'];
                            let genres = element['genre_ids'];
                            let voteAvg = element['vote_average'];
                            let voteCount = element['vote_count'];
                            let overview = element['overview'];
                            
                            if (voteAvg == "0") {
                                voteAvg = "0.0";
                            } else if (voteAvg == "5") {
                                voteAvg = "5.0";
                            }

                            if (releaseDate == null) {
                                releaseDate = "N/A";
                            }

                            let genreString = "";
                            for (var i = 0; i < genres.length; i++) {
                                if (i == genres.length - 1) {
                                    genreString += genres[i];
                                } else {
                                    genreString += genres[i] + ", ";
                                }
                            }
                            let yearGenre = releaseDate + " | " + genreString;

                            let votes = "★ " + voteAvg + "/5";
                            let voteCounts = voteCount + " votes";
                            
                            let posterPathUrl = "./static/posterpath_placeholder.jpg";
                            if (posterPath != null) {
                                posterPathUrl = "https://image.tmdb.org/t/p/w500" + posterPath;
                            }
                            
                            if (ndx == 2) {
                                newVerticalWhiteLineHeight += 590;
                                newHeight += 15;
                            } else if (ndx > 2) {
                                newHeight += 315;
                                newVerticalWhiteLineHeight += 315;
                            }
                            var newPixelHeight = newHeight.toString() + "px";
                            newVerticalWhiteLinePixelHeight = newVerticalWhiteLineHeight.toString() + "px";

                            var resultsDiv = document.createElement("div");
                            var verticalLine = document.createElement("div");
                            var textDiv = document.createElement("div");
                            var titleParagraph = document.createElement("p");
                            var yearGenreParagraph = document.createElement("p");
                            var overviewParagraph = document.createElement("p");
                            var showMoreButton = document.createElement("button");
                            var poster = document.createElement("img");

                            var resultsIdAttribute = "results" + ndx;
                            var textIdAttribute = "text-container" + ndx;
                            var titleIdAttribute = "title" + ndx;
                            var yearGenreIdAttribute = "year-genre" + ndx;
                            var overviewIdAttribute = "overview" + ndx;
                            var showMoreButtonIdAttribute = "show-more" + ndx;

                            resultsDiv.setAttribute("id", resultsIdAttribute);
                            textDiv.setAttribute("id", textIdAttribute);
                            titleParagraph.setAttribute("id", titleIdAttribute);
                            yearGenreParagraph.setAttribute("id", yearGenreIdAttribute);
                            overviewParagraph.setAttribute("id", overviewIdAttribute);
                            showMoreButton.setAttribute("id", showMoreButtonIdAttribute);

                            verticalLine.className = "vl-search";
                            textDiv.className = "text-container";
                            titleParagraph.className = "movie-title";
                            yearGenreParagraph.className = "year-genre";
                            overviewParagraph.className = "overview";
                            showMoreButton.className = "show-more";
                            titleParagraph.innerHTML = title;
                            yearGenreParagraph.innerHTML = yearGenre + "<br><span class='voting'>" + votes + "&nbsp </span><span class='vote-counts'>" + voteCounts + "</span>";
                            overviewParagraph.innerHTML = overview;
                            showMoreButton.innerHTML = "Show more";
                            showMoreButton.onclick = function() {showMovieDetails(id, overview)};

                            resultsDiv.style.height = "310px";
                            resultsDiv.style.marginBottom = "10px";
                            poster.style.width = "185px";
                            poster.style.height = "280px";
                            poster.style.marginBottom = "10px";
                            poster.style.display = "inline-block";

                            poster.setAttribute("src", posterPathUrl);
                            poster.setAttribute("alt", name);
                            
                            if (dataLen > 1) {
                                document.getElementById("search-area").style.height = newPixelHeight;
                                verticalWhiteLine.style.height = newVerticalWhiteLinePixelHeight;
                            }
                            document.getElementById("search-container").appendChild(resultsDiv);
                            document.getElementById(resultsIdAttribute).appendChild(verticalLine);
                            document.getElementById(resultsIdAttribute).appendChild(poster);
                            document.getElementById(resultsIdAttribute).appendChild(textDiv);
                            document.getElementById(textIdAttribute).appendChild(titleParagraph);
                            document.getElementById(textIdAttribute).appendChild(yearGenreParagraph);
                            document.getElementById(textIdAttribute).appendChild(overviewParagraph);
                            document.getElementById(textIdAttribute).appendChild(showMoreButton);

                            ndx += 1;
                            
                        });
                    } else if (data.length == 0) {
                        let showResults = document.getElementById("show-results");
                        showResults.style.opacity = 1;
                        showResults.style.textAlign = "center";
                        showResults.innerHTML = "No results found.";

                        clearAllSearchElements();
                    }
                } else if (categories.value == "tv-shows") {
                    if (data.length > 0) {
                        let showResults = document.getElementById("show-results");
                        var verticalWhiteLine = document.getElementById("vl");
                        showResults.style.opacity = 1;
                        showResults.style.textAlign = "left";
                        showResults.innerHTML = "Showing results...";

                        let ndx = 1;
                        let dataLen = data.length;
                        data.forEach(element => {
                            let id = element['id'];
                            let name = element['name'];
                            let posterPath = element['poster_path'];
                            let firstAirDate = element['first_air_date'];
                            let genres = element['genre_ids'];
                            let voteAvg = element['vote_average'];
                            let voteCount = element['vote_count'];
                            let overview = element['overview'];

                            if (voteAvg == "0") {
                                voteAvg = "0.0";
                            } else if (voteAvg == "5") {
                                voteAvg = "5.0";
                            }

                            if (firstAirDate == null) {
                                firstAirDate = "N/A";
                            }
                            
                            let genreString = "";
                            for (var i = 0; i < genres.length; i++) {
                                if (i == genres.length - 1) {
                                    genreString += genres[i];
                                } else {
                                    genreString += genres[i] + ", ";
                                }
                            }
                            let yearGenre = firstAirDate + " | " + genreString;

                            let votes = "★ " + voteAvg + "/5";
                            let voteCounts = voteCount + " votes";
                            
                            let posterPathUrl = "./static/posterpath_placeholder.jpg";
                            if (posterPath != null) {
                                posterPathUrl = "https://image.tmdb.org/t/p/w500" + posterPath;
                            }
                            
                            if (ndx == 2) {
                                newVerticalWhiteLineHeight += 590;
                                newHeight += 15;
                            } else if (ndx > 2) {
                                newHeight += 315;
                                newVerticalWhiteLineHeight += 315;
                            }
                            var newPixelHeight = newHeight.toString() + "px";
                            newVerticalWhiteLinePixelHeight = newVerticalWhiteLineHeight.toString() + "px";

                            var resultsDiv = document.createElement("div");
                            var verticalLine = document.createElement("div");
                            var textDiv = document.createElement("div");
                            var nameParagraph = document.createElement("p");
                            var yearGenreParagraph = document.createElement("p");
                            var overviewParagraph = document.createElement("p");
                            var showMoreButton = document.createElement("button");
                            var poster = document.createElement("img");

                            var resultsIdAttribute = "results" + ndx;
                            var textIdAttribute = "text-container" + ndx;
                            var nameIdAttribute = "name" + ndx;
                            var yearGenreIdAttribute = "year-genre" + ndx;
                            var overviewIdAttribute = "overview" + ndx;
                            var showMoreButtonIdAttribute = "show-more" + ndx;

                            resultsDiv.setAttribute("id", resultsIdAttribute);
                            textDiv.setAttribute("id", textIdAttribute);
                            nameParagraph.setAttribute("id", nameIdAttribute);
                            yearGenreParagraph.setAttribute("id", yearGenreIdAttribute);
                            overviewParagraph.setAttribute("id", overviewIdAttribute);
                            showMoreButton.setAttribute("id", showMoreButtonIdAttribute);
                            showMoreButton.onclick = function() { showTvDetails(id, overview) };

                            verticalLine.className = "vl-search";
                            textDiv.className = "text-container";
                            nameParagraph.className = "movie-title";
                            yearGenreParagraph.className = "year-genre";
                            overviewParagraph.className = "overview";
                            showMoreButton.className = "show-more";
                            nameParagraph.innerHTML = name;
                            yearGenreParagraph.innerHTML = yearGenre + "<br><span class='voting'>" + votes + "&nbsp </span><span class='vote-counts'>" + voteCounts + "</span>";
                            overviewParagraph.innerHTML = overview;
                            showMoreButton.innerHTML = "Show more";

                            resultsDiv.style.height = "310px";
                            resultsDiv.style.marginBottom = "10px";
                            poster.style.width = "185px";
                            poster.style.height = "280px";
                            poster.style.marginBottom = "10px";
                            poster.style.display = "inline-block";

                            poster.setAttribute("src", posterPathUrl);
                            poster.setAttribute("alt", name);
                            
                            if (dataLen > 1) {
                                document.getElementById("search-area").style.height = newPixelHeight;
                                verticalWhiteLine.style.height = newVerticalWhiteLinePixelHeight;
                            }
                            document.getElementById("search-container").appendChild(resultsDiv);
                            document.getElementById(resultsIdAttribute).appendChild(verticalLine);
                            document.getElementById(resultsIdAttribute).appendChild(poster);
                            document.getElementById(resultsIdAttribute).appendChild(textDiv);
                            document.getElementById(textIdAttribute).appendChild(nameParagraph);
                            document.getElementById(textIdAttribute).appendChild(yearGenreParagraph);
                            document.getElementById(textIdAttribute).appendChild(overviewParagraph);
                            document.getElementById(textIdAttribute).appendChild(showMoreButton);

                            ndx += 1;
                            
                        });
                    } else if (data.length == 0) {
                        let showResults = document.getElementById("show-results");
                        showResults.style.opacity = 1;
                        showResults.style.textAlign = "center";
                        showResults.innerHTML = "No results found.";

                        clearAllSearchElements();
                    }
                } else if (categories.value == "movies-and-tv-shows") {
                    console.log(data);
                    if (data.length > 0) {
                        let showResults = document.getElementById("show-results");
                        var verticalWhiteLine = document.getElementById("vl");
                        showResults.style.opacity = 1;
                        showResults.style.textAlign = "left";
                        showResults.innerHTML = "Showing results...";

                        let ndx = 1;
                        let dataLen = data.length;
                        data.forEach(element => {
                            let id = element['id'];
                            let media_type = element['media_type'];
                            let firstAirDate = "";
                            let name = "";

                            if (media_type == "tv") {
                                name = element['name'];
                                firstAirDate = element['first_air_date'];
                            } else if (media_type == "movie") {
                                name = element['title'];
                                firstAirDate = element['release_date']; 
                            }
                            let posterPath = element['poster_path'];
                            let genres = element['genre_ids'];
                            let voteAvg = element['vote_average'];
                            let voteCount = element['vote_count'];
                            let overview = element['overview'];

                            if (voteAvg == "0") {
                                voteAvg = "0.0";
                            } else if (voteAvg == "5") {
                                voteAvg = "5.0";
                            }

                            if (firstAirDate == null) {
                                firstAirDate = "N/A";
                            }
                            
                            let genreString = "";
                            for (var i = 0; i < genres.length; i++) {
                                if (i == genres.length - 1) {
                                    genreString += genres[i];
                                } else {
                                    genreString += genres[i] + ", ";
                                }
                            }
                            let yearGenre = firstAirDate + " | " + genreString;

                            let votes = "★ " + voteAvg + "/5";
                            let voteCounts = voteCount + " votes";
                            
                            let posterPathUrl = "./static/posterpath_placeholder.jpg";
                            if (posterPath != null) {
                                posterPathUrl = "https://image.tmdb.org/t/p/w500" + posterPath;
                            }
                            
                            if (ndx == 2) {
                                newVerticalWhiteLineHeight += 590;
                                newHeight += 15;
                            } else if (ndx > 2) {
                                newHeight += 315;
                                newVerticalWhiteLineHeight += 315;
                            }
                            var newPixelHeight = newHeight.toString() + "px";
                            newVerticalWhiteLinePixelHeight = newVerticalWhiteLineHeight.toString() + "px";

                            var resultsDiv = document.createElement("div");
                            var verticalLine = document.createElement("div");
                            var textDiv = document.createElement("div");
                            var nameParagraph = document.createElement("p");
                            var yearGenreParagraph = document.createElement("p");
                            var overviewParagraph = document.createElement("p");
                            var showMoreButton = document.createElement("button");
                            var poster = document.createElement("img");

                            var resultsIdAttribute = "results" + ndx;
                            var textIdAttribute = "text-container" + ndx;
                            var nameIdAttribute = "name" + ndx;
                            var yearGenreIdAttribute = "year-genre" + ndx;
                            var overviewIdAttribute = "overview" + ndx;
                            var showMoreButtonIdAttribute = "show-more" + ndx;

                            resultsDiv.setAttribute("id", resultsIdAttribute);
                            textDiv.setAttribute("id", textIdAttribute);
                            nameParagraph.setAttribute("id", nameIdAttribute);
                            yearGenreParagraph.setAttribute("id", yearGenreIdAttribute);
                            overviewParagraph.setAttribute("id", overviewIdAttribute);
                            showMoreButton.setAttribute("id", showMoreButtonIdAttribute);
                            if (media_type == "movie") {
                                showMoreButton.onclick = function() {showMovieDetails(id, overview)};
                            } else if (media_type == "tv") {
                                showMoreButton.onclick = function() {showTvDetails(id, overview)};
                            }

                            verticalLine.className = "vl-search";
                            textDiv.className = "text-container";
                            nameParagraph.className = "movie-title";
                            yearGenreParagraph.className = "year-genre";
                            overviewParagraph.className = "overview";
                            showMoreButton.className = "show-more";
                            nameParagraph.innerHTML = name;
                            yearGenreParagraph.innerHTML = yearGenre + "<br><span class='voting'>" + votes + "&nbsp </span><span class='vote-counts'>" + voteCounts + "</span>";
                            overviewParagraph.innerHTML = overview;
                            showMoreButton.innerHTML = "Show more";

                            resultsDiv.style.height = "310px";
                            resultsDiv.style.marginBottom = "10px";
                            poster.style.width = "185px";
                            poster.style.height = "280px";
                            poster.style.marginBottom = "10px";
                            poster.style.display = "inline-block";

                            poster.setAttribute("src", posterPathUrl);
                            poster.setAttribute("alt", name);
                            
                            if (dataLen > 1) {
                                document.getElementById("search-area").style.height = newPixelHeight;
                                verticalWhiteLine.style.height = newVerticalWhiteLinePixelHeight;
                            }
                            document.getElementById("search-container").appendChild(resultsDiv);
                            document.getElementById(resultsIdAttribute).appendChild(verticalLine);
                            document.getElementById(resultsIdAttribute).appendChild(poster);
                            document.getElementById(resultsIdAttribute).appendChild(textDiv);
                            document.getElementById(textIdAttribute).appendChild(nameParagraph);
                            document.getElementById(textIdAttribute).appendChild(yearGenreParagraph);
                            document.getElementById(textIdAttribute).appendChild(overviewParagraph);
                            document.getElementById(textIdAttribute).appendChild(showMoreButton);

                            ndx += 1;
                            
                        });
                    } else if (data.length == 0) {
                        let showResults = document.getElementById("show-results");
                        showResults.style.opacity = 1;
                        showResults.style.textAlign = "center";
                        showResults.innerHTML = "No results found.";

                        clearAllSearchElements();
                    }
                }
            }
        };

        xhttp.open("GET", params, true);
        xhttp.send();
    }
}