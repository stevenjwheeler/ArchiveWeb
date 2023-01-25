function refresh() {
  const refreshButton = document.querySelector(".refresh-button");
  // disable the refresh button for more clicks
  refreshButton.disabled = true;
  // set the style so that it is no longer a pointer cursor
  refreshButton.style.cursor = "default";
  // remove the hover effect
  refreshButton.style.backgroundColor = "#404abe";

  // add a loading spinner to the refresh button
  refreshButton.classList.add("button-loading-spinner");

  // send a POST request to the server to refresh the archive
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/refresh-archive", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(
    JSON.stringify({
      archiveName: "<%= archiveName %>",
    })
  );

  // wait for the server to respond with a 200 OK
  xhr.onreadystatechange = function () {
    if (xhr.status == 200) {
      // reload the page
      location.reload();
    }
  };
}

function loadAndFadeOnScroll() {
  const content = document.querySelectorAll(".content");
  const loadingtext = document.getElementById("loading-text");

  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0,
  };

  const observer = new IntersectionObserver(onIntersection, options);

  content.forEach((content) => {
    observer.observe(content);
  });

  function onIntersection(entries) {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0) {
        // check the avatar
        const avatarImage = entry.target.querySelector(".avatar-image");

        var xhr = new XMLHttpRequest();
        xhr.open("HEAD", avatarImage.src, true);
        xhr.send();

        xhr.onreadystatechange = function () {
          if (this.readyState == this.DONE) {
            if (this.status == 404) {
              avatarImage.src = "/assets/default-avatar.png";
            }
          }
        };

        // grab the media-image and media-video elements
        const mediaImages = entry.target.querySelectorAll(".media-image");
        const mediaVideos = entry.target.querySelectorAll(".media-video");

        // load each mediaImage and mediaVideo
        loadContent(mediaImages, mediaVideos).then(() => {
          // once the content is loaded, fade it in
          entry.target.style.visibility = "visible";
          entry.target.classList.add("fade-in");
        }),
          observer.unobserve(entry.target);
      }
    });
  }
  loadingtext.style.visibility = "hidden";
  loadingtext.style.margin = "0";
}

function loadContent(mediaImages, mediaVideos) {
  mediaImages.forEach((mediaImage) => {
    mediaImage.src = mediaImage.dataset.src;
    moveImages();
  });
  mediaVideos.forEach((mediaVideo) => {
    mediaVideo.src = mediaVideo.dataset.src;
  });
  return Promise.resolve();
}

function moveImages() {
  const imageGrid = document.querySelectorAll(".image-grid");
  var gridArray = [...imageGrid];

  gridArray.forEach((imageGrid) => {
    const imageGridItems = imageGrid.querySelectorAll(".image-grid-item");
    const numberOfImages = imageGridItems.length;

    if (numberOfImages === 1) {
      imageGrid.style.gridTemplateColumns = "1fr";
    } else if (numberOfImages === 2) {
      imageGrid.style.gridTemplateColumns = "1fr 1fr";
    } else if (numberOfImages === 3) {
      imageGrid.style.gridTemplateColumns = "1fr 1fr";
      imageGrid.style.gridTemplateRows =
        "1fr " + imageGridItems[2].clientHeight - 1 + "px";
      imageGridItems[0].style.gridColumn = "1 / 3";
    } else if (numberOfImages === 4) {
      imageGrid.style.gridTemplateColumns = "1fr 1fr";
      imageGrid.style.gridTemplateRows =
        "1fr " + imageGridItems[2].clientHeight - 1 + "px";
    } else {
      imageGrid.style.gridTemplateColumns =
        "repeat(auto-fit, minmax(150px, 1fr))";
    }

    imageGridItems.forEach((imageGridItem) => {
      // stretch the image to fit the grid
      imageGridItem.style.width = "100%";
      imageGridItem.style.height = "100%";
    });
  });
}

function expandedView(id) {
  //remove the bigint n from the id
  const idNumber = id.replace("n", "");
  const expandedView = document.querySelector(".expanded-view");

  // get the info for the post using the id by querying the archiveDatabase.json

  //expandedView.getElementById("expanded-view-avatar").src = data.author.profile_image;

  // set the visibility to visible
  expandedView.classList.remove("pop-out");
  expandedView.style.visibility = "visible";
  expandedView.classList.add("pop-in");
}

function closeExpandedView() {
  const expandedView = document.querySelector(".expanded-view");
  expandedView.classList.add("pop-out");
  // wait for the animation to finish
  setTimeout(() => {
    expandedView.style.visibility = "hidden";
  }, 230);
  expandedView.classList.remove("pop-in");
}
