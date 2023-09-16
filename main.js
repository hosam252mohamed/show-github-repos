let userInput = document.querySelector(".input-user-form input");
let userSearchBtn = document.querySelector(".input-user-form button");
let allUserInfo = document.querySelector(".all-info-user");

userSearchBtn.onclick = function () {
  if (userInput.value === "") {
    return false;
  }
  let userName = userInput.value;
  [...allUserInfo.children].forEach((el) => el.remove());
  fetch(`https://api.github.com/users/${userName}/repos`)
    .then((data) => {
      if (data.ok) return data.json();
      throw new Error("No Valid URL");
    })
    .then((userDetails) => {
      fetch(`https://api.github.com/users/${userName}`)
        .then((data) => data.json())
        .then((userData) => {
          if (userDetails.length) {
            showUseDetails(userName, userData);
            createAllRepos(userDetails);
          } else {
            showUseDetails(userName, userData);
            let noReposText = document.createElement("p");
            noReposText.className = "no-repo";
            noReposText.append(document.createTextNode("No Repos To Show"));
            allUserInfo.append(noReposText);
          }
        });
    })
    .catch(() => {
      let showError = document.createElement("span");
      showError.className = "error-user";
      showError.textContent = "Please Enter A Valid User Name";
      allUserInfo.append(showError);
    });
  userInput.value = "";
};

function showUseDetails(userName, userDetails) {
  let userContainer = document.createElement("div");
  userContainer.className = "user-container";
  allUserInfo.appendChild(userContainer);

  let avatar = document.createElement("img");
  avatar.src = `${userDetails.avatar_url}`;
  userContainer.appendChild(avatar);

  let userNameAndProfile = document.createElement("div");
  userNameAndProfile.className = "user-details";
  userContainer.appendChild(userNameAndProfile);

  let userNameSpan = document.createElement("span");
  userNameSpan.className = "user-name";
  userNameSpan.textContent = userName;
  userNameAndProfile.appendChild(userNameSpan);

  let userLink = document.createElement("a");
  userLink.className = "user-link";
  userLink.textContent = "Profile";
  userLink.target = "_blank";
  userLink.href = `https://github.com/${userName}/`;
  userNameAndProfile.appendChild(userLink);
}

function createAllRepos(userDetails) {
  let reposHeader = document.createElement("span");
  reposHeader.className = "repos-header";
  reposHeader.innerHTML = "All Repos: <span></span>";
  allUserInfo.appendChild(reposHeader);
  document.querySelector(".repos-header span").textContent = userDetails.length;

  let reposContainer = document.createElement("div");
  reposContainer.className = "all-repos";
  allUserInfo.appendChild(reposContainer);

  for (let i = 0; i < userDetails.length; i++) {
    let repo = document.createElement("div");
    repo.className = "repo";
    reposContainer.appendChild(repo);

    let repoTitle = document.createElement("p");
    repoTitle.textContent = userDetails[i].name;
    repo.appendChild(repoTitle);

    let repoLink = document.createElement("a");
    repoLink.className = "repo-link";
    repoLink.href = userDetails[i].html_url;
    repoLink.textContent = "Visit The Repo";
    repoLink.target = "_blank";
    repo.appendChild(repoLink);

    let starCount = document.createElement("span");
    starCount.className = "star-count";
    starCount.textContent = userDetails[i].stargazers_count;
    repo.appendChild(starCount);
  }
}
