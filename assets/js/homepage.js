//Declarations
var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
var languageButtonsEl = document.querySelector("#language-buttons");

//Get repositories from API
var getUserRepos = function (user) {
  //Format the github api url
  var apiUrl = "https://api.github.com/users/" + user + "/repos";

  //Make a request to the url
  fetch(apiUrl)
    .then(function (response) {
      //Request was successful
      if (response.ok) {
        response.json().then(function (data) {
          displayRepos(data, user);
        });
      } else {
        alert("Error: GitHub User Not Found");
      }
    })
    .catch(function (error) {
      //Notice this `.catch()` getting chained onto the end of the `.then()` method
      alert("Unable to connect to GitHub");
    });
};

//Receive input from form
function formSubmitHandler(event) {
  event.preventDefault();

  var username = nameInputEl.value.trim();
  if (username) {
    getUserRepos(username);
    nameInputEl.value = "";
  } else {
    alert("Please enter a GitHub username");
  }
}

//Event listener on form
userFormEl.addEventListener("submit", formSubmitHandler);

//Function to display API content
var displayRepos = function (repos, searchTerm) {
  // check if api returned any repos
  if (repos.length === 0) {
    repoContainerEl.textContent = "No repositories found.";
    return;
  }
  //Clear old content
  repoContainerEl.textContent = "";
  repoSearchTerm.textContent = searchTerm;

  //Loop over repos
  for (var i = 0; i < repos.length; i++) {
    //Format repo name
    var repoName = repos[i].owner.login + "/" + repos[i].name;

    //Create a container for each repo
    var repoEl = document.createElement("a");
    repoEl.classList = "list-item flex-row justify-space-between align-center";
    repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);
    repoEl.setAttribute("target", "_blank");

    //Create a span element to hold repository name
    var titleEl = document.createElement("span");
    titleEl.textContent = repoName;

    //Append to container
    repoEl.appendChild(titleEl);

    //Create a status element
    var statusEl = document.createElement("span");
    statusEl.classList = "flex-row align-center";

    //Check if current repo has issues or not
    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML =
        "<i class='fas fa-times status-icon icon-danger'></i>" +
        repos[i].open_issues_count +
        " issue(s)";
    } else {
      statusEl.innerHTML =
        "<i class='fas fa-check-square status-icon icon-success'></i>";
    }
    //Append status to container
    repoEl.appendChild(statusEl);

    //Append container to the DOM
    repoContainerEl.appendChild(repoEl);
  }

  console.log(repos);
};

var getFeaturedRepos = function(language) {
  var apiUrl =
    "https://api.github.com/search/repositories?q=" +
    language +
    "+is:featured&sort=help-wanted-issues";

    fetch(apiUrl).then(function(response){
      console.log(response);
      if (response.ok){
        response.json().then(function(data){

          displayRepos(data.items, language);
          console.log(data.items);
        });

      } else {
        alert('Error: GitHub User Not Found')
      }
    });
};

var buttonClickHandler = function(event) {
var language = event.target.getAttribute("data-language");
console.log(language);
if (language) {
  getFeaturedRepos(language);
}
//Clear old content
repoContainerEl.textContent = "";


}

languageButtonsEl.addEventListener('click', buttonClickHandler)