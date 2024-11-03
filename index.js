
document.addEventListener("DOMContentLoaded", () => {
  // Start typing animation
  startTypingAnimation();

  // Initialize page with Home content
  loadPage("Home");
  setActiveLink("Home");

  // Set up event listeners for navigation links
  const navLinks = document.querySelectorAll(".nav-bar a");
  navLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const pageName =
        this.getAttribute("onclick").match(/loadPage\('(.*)'\)/)[1];
      loadPage(pageName);
      setActiveLink(pageName);
    });
  });
});

// Typing animation function
function startTypingAnimation() {
  const text = "A UX designer";
  const speed = 250; // Typing speed in milliseconds
  const pauseDuration = 2000; // Pause duration after typing completes in milliseconds
  const typingElement = document.getElementById("typing-text");

  let currentIndex = 0;

  function typeText() {
    if (currentIndex < text.length) {
      typingElement.innerHTML += text.charAt(currentIndex);
      currentIndex++;
      setTimeout(typeText, speed);
    } else {
      // Pause, then restart the animation
      setTimeout(() => {
        typingElement.innerHTML = ""; // Clear text
        currentIndex = 0;
        typeText(); // Restart animation
      }, pauseDuration);
    }
  }

  typeText(); // Start typing
}

// Function to load the page content dynamically
function loadPage(pageName) {
  const pageFile = `${pageName}.html`;
  const contentDiv = document.getElementById("content");

  fetch(pageFile)
    .then((response) => {
      if (!response.ok) throw new Error("Page not found");
      return response.text();
    })
    .then((data) => {
      contentDiv.innerHTML = data;

      // If the page loaded is Blog, load blog posts
      if (pageName === "Blog") {
        loadBlogPosts();
      }

      // Smooth scroll to position right before nav becomes sticky
      setTimeout(() => {
        const introElement = document.querySelector(".Intro");
        const navElement = document.querySelector(".nav");

        if (introElement && navElement) {
          const scrollToPosition =
            introElement.offsetHeight - navElement.offsetHeight;

          window.scrollTo({
            top: scrollToPosition,
            behavior: "smooth",
          });
        }
      }, 100); // Delay to ensure content is fully loaded
    })
    .catch((error) => {
      contentDiv.innerHTML = `
        <h2>Error Loading Page</h2>
        <p>${error.message}</p>
      `;
    });
}

// Function to set the active link
function setActiveLink(pageName) {
  const navLinks = document.querySelectorAll(".nav-bar a");

  navLinks.forEach((link) => {
    if (link.getAttribute("onclick").includes(`loadPage('${pageName}')`)) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}


//Blog.js
// Function to load blog posts
function loadBlogPosts() {
  fetch("posts.json")
    .then((response) => {
      if (!response.ok) throw new Error("Failed to load posts.json");
      return response.json();
    })
    .then((data) => {
      const postContainer = document.getElementById("post-container");
      if (!postContainer) {
        console.error("No post-container element found in the HTML.");
        return;
      }

      // Clear any previous posts
      postContainer.innerHTML = "";

      data.forEach((post) => {
        const postCard = document.createElement("div");
        postCard.classList.add("post-card");
        postCard.setAttribute("onclick", `openModal('${post.id}')`);

        postCard.innerHTML = `
          <img src="${post.coverImage}" alt="${post.title}">
          <p class="post-date">${post.date}</p>
          <h3 class="post-title">${post.title}</h3>
        `;

        postContainer.appendChild(postCard);
      });
    })
    .catch((error) => {
      console.error("An error occurred while loading posts:", error);
    });
}

// Function to open modal with post details
function openModal(postId) {
  fetch("posts.json")
    .then((response) => response.json())
    .then((data) => {
      const post = data.find((p) => p.id === postId);
      if (post) {
        const modal = document.getElementById("modal");
        const modalImages = document.querySelector(".modal-images");
        const modalTitle = document.querySelector(".modal-title");
        const modalDate = document.querySelector(".modal-date");

        modalImages.innerHTML = ""; // Clear previous content

        // Add images to the modal
        post.images.forEach((imageSrc) => {
          const img = document.createElement("img");
          img.src = imageSrc;
          modalImages.appendChild(img);
        });

        // Set title and date
        modalTitle.innerText = post.title;
        modalDate.innerText = post.date;

        // Show the modal
        modal.style.display = "block";

        enableDragToScroll(modalImages);
      }
    });
}

// Function to close the modal
function closeModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
}


//Scroll function
function enableDragToScroll(container) {
  let isDown = false;
  let startX, scrollLeft;

  // When mouse is pressed down on the container
  container.addEventListener("mousedown", (e) => {
    isDown = true;
    container.classList.add("dragging");
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;

    // Prevent default to stop any unwanted selections
    e.preventDefault();
  });

  // When the mouse leaves the container area
  container.addEventListener("mouseleave", () => {
    isDown = false;
    container.classList.remove("dragging");
  });

  // When the mouse is released (inside or outside the container)
  container.addEventListener("mouseup", () => {
    isDown = false;
    container.classList.remove("dragging");
  });

  // Listen to the `mouseup` event on the whole window to ensure drag stops if mouse is released outside container
  window.addEventListener("mouseup", () => {
    isDown = false;
    container.classList.remove("dragging");
  });

  // Move the container's scroll position while dragging
  container.addEventListener("mousemove", (e) => {
    if (!isDown) return; // If not pressed, do nothing
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2; // Adjust the multiplier for scroll speed
    container.scrollLeft = scrollLeft - walk;
  });
}