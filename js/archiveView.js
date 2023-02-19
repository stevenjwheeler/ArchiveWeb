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

        const xhr = new XMLHttpRequest();
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
        });
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
  const gridArray = [...imageGrid];

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

function expandedView(mediaDataArray, avatar, username, content) {
  const expandedView = document.querySelector(".expanded-view");
  const darkenLayer = document.querySelector(".darken-layer");

  // get the expanded media carousel from the view
  const expandedCarousel = document.querySelector('.expanded-media-carousel');
  expandedCarousel.innerHTML = null;

  // add each of the media items to the carousel
  mediaDataArray.forEach((mediaData) => {
    // remove the _preview from the url if it exists
    mediaData = mediaData.replace("_preview", "");

    // add content into the slide
    if (mediaData.includes(".mp4")) {
      const mediaVideo = document.createElement('video');
      mediaVideo.src = mediaData;
      mediaVideo.setAttribute('controls', true);
      mediaVideo.setAttribute('autoplay', true);
      mediaVideo.setAttribute('loop', true);
      mediaVideo.classList.add('expanded-content');
      expandedCarousel.appendChild(mediaVideo);
    } else if (mediaData.includes(".jpg") || mediaData.includes(".png")) {
      const mediaImage = document.createElement('img');
      mediaImage.classList.add('expanded-content');
      mediaImage.src = mediaData;
      expandedCarousel.appendChild(mediaImage);
    }
  });

  // set the avatar
  const expandedAvatar = document.querySelector('#expanded-view-avatar');
  expandedAvatar.src = avatar;

  // set the username
  const expandedUsername = document.querySelector('#expanded-view-username');
  expandedUsername.innerHTML = username;

  // set the content
  const expandedContent = document.querySelector('#expanded-view-contenttext');
  expandedContent.innerHTML = content;
  
  // set the visibility to visible
  darkenLayer.style.visibility = "visible";
  expandedView.classList.remove("pop-out");
  expandedView.style.visibility = "visible";
  expandedView.classList.add("pop-in");
}

function closeExpandedView() {
  const expandedView = document.querySelector(".expanded-view");
  const darkenLayer = document.querySelector(".darken-layer");

  expandedView.classList.add("pop-out");
  // wait for the animation to finish
  setTimeout(() => {
    expandedView.style.visibility = "hidden";
    darkenLayer.style.visibility = "hidden";
    // remove all the images from the carousel
    const expandedCarousel = document.querySelector('.expanded-media-carousel');
    expandedCarousel.innerHTML = null;
  }, 230);
  expandedView.classList.remove("pop-in");
}
